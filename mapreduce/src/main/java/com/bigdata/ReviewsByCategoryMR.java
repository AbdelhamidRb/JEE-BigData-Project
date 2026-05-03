package com.bigdata;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.io.ImmutableBytesWritable;
import org.apache.hadoop.hbase.mapreduce.TableOutputFormat;
import org.apache.hadoop.hbase.util.Bytes;

import java.io.IOException;

public class ReviewsByCategoryMR {

    // review_id(0), order_id(1), review_score(2), review_comment_title(3),
    // review_comment_message(4), review_creation_date(5), review_answer_timestamp(6)
    public static class ReviewsMapper
            extends Mapper<LongWritable, Text, Text, IntWritable> {

        private boolean isHeader = true;

        @Override
        public void map(LongWritable key, Text value, Context context)
                throws IOException, InterruptedException {
            if (isHeader) { isHeader = false; return; }

            String[] f = value.toString().split(",");
            if (f.length < 3) return;

            try {
                int score = Integer.parseInt(f[2].trim().replace("\"", ""));
                // Grouper par note (1 à 5)
                String scoreKey = "score_" + score;
                context.write(new Text(scoreKey), new IntWritable(score));
            } catch (Exception e) { /* ignore */ }
        }
    }

    public static class ReviewsReducer
            extends Reducer<Text, IntWritable, ImmutableBytesWritable, Put> {

        @Override
        public void reduce(Text key, Iterable<IntWritable> values, Context context)
                throws IOException, InterruptedException {

            int totalReviews   = 0;
            double totalScore  = 0;

            for (IntWritable val : values) {
                totalScore += val.get();
                totalReviews++;
            }

            double avgRating       = totalReviews > 0 ? totalScore / totalReviews : 0;
            int positiveReviews    = key.toString().startsWith("score_4") ||
                    key.toString().startsWith("score_5") ? totalReviews : 0;
            int negativeReviews    = key.toString().startsWith("score_1") ||
                    key.toString().startsWith("score_2") ? totalReviews : 0;
            double satisfactionPct = totalReviews > 0
                    ? ((double) positiveReviews / totalReviews) * 100 : 0;

            String rowKey = "hist_" + key.toString();
            Put put = new Put(Bytes.toBytes(rowKey));
            byte[] family = Bytes.toBytes("stats");

            put.addColumn(family, Bytes.toBytes("source"),           Bytes.toBytes("historical"));
            put.addColumn(family, Bytes.toBytes("category"),         Bytes.toBytes(key.toString()));
            put.addColumn(family, Bytes.toBytes("avg_rating"),       Bytes.toBytes(String.format("%.2f", avgRating)));
            put.addColumn(family, Bytes.toBytes("total_reviews"),    Bytes.toBytes(String.valueOf(totalReviews)));
            put.addColumn(family, Bytes.toBytes("positive_reviews"), Bytes.toBytes(String.valueOf(positiveReviews)));
            put.addColumn(family, Bytes.toBytes("negative_reviews"), Bytes.toBytes(String.valueOf(negativeReviews)));
            put.addColumn(family, Bytes.toBytes("satisfaction_pct"), Bytes.toBytes(String.format("%.1f", satisfactionPct)));

            context.write(new ImmutableBytesWritable(Bytes.toBytes(rowKey)), put);
        }
    }

    public static void run(Configuration conf) throws Exception {
        conf.set(TableOutputFormat.OUTPUT_TABLE, "analytics_reviews_by_category");

        Job job = Job.getInstance(conf, "Reviews By Score");
        job.setJarByClass(ReviewsByCategoryMR.class);
        job.setMapperClass(ReviewsMapper.class);
        job.setReducerClass(ReviewsReducer.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);
        job.setOutputFormatClass(TableOutputFormat.class);
        job.setOutputKeyClass(ImmutableBytesWritable.class);
        job.setOutputValueClass(Put.class);

        FileInputFormat.addInputPath(job,
                new Path("hdfs://namenode:8020/data/historical/olist_order_reviews_dataset.csv"));

        boolean success = job.waitForCompletion(true);
        System.out.println("[MR] ReviewsByCategory : " + (success ? "OK ✅" : "ECHEC ❌"));
    }
}