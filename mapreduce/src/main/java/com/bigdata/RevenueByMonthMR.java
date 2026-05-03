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

public class RevenueByMonthMR {

    // Input  : order_id, customer_id, status, purchase_timestamp, ...
    // Output : YYYY-MM → 1 (pour compter les commandes)
    public static class RevenueMapper
            extends Mapper<LongWritable, Text, Text, DoubleWritable> {

        private boolean isHeader = true;

        @Override
        public void map(LongWritable key, Text value, Context context)
                throws IOException, InterruptedException {
            if (isHeader) { isHeader = false; return; }

            String[] f = value.toString().split(",");
            if (f.length < 4) return;

            try {
                String timestamp = f[3].trim(); // ex: 2017-10-02 10:56:33
                String month     = timestamp.substring(0, 7); // YYYY-MM
                // On utilise 1.0 comme valeur — le reducer compte
                context.write(new Text(month), new DoubleWritable(1.0));
            } catch (Exception e) { /* ignore */ }
        }
    }

    public static class RevenueReducer
            extends Reducer<Text, DoubleWritable, ImmutableBytesWritable, Put> {

        @Override
        public void reduce(Text key, Iterable<DoubleWritable> values, Context context)
                throws IOException, InterruptedException {

            int totalOrders = 0;
            for (DoubleWritable val : values) {
                totalOrders++;
            }

            String rowKey = "hist_" + key.toString();
            Put put = new Put(Bytes.toBytes(rowKey));
            byte[] family = Bytes.toBytes("stats");

            put.addColumn(family, Bytes.toBytes("source"),
                    Bytes.toBytes("historical"));
            put.addColumn(family, Bytes.toBytes("month"),
                    Bytes.toBytes(key.toString()));
            put.addColumn(family, Bytes.toBytes("total_orders"),
                    Bytes.toBytes(String.valueOf(totalOrders)));

            context.write(new ImmutableBytesWritable(Bytes.toBytes(rowKey)), put);
        }
    }

    public static void run(Configuration conf) throws Exception {
        conf.set(TableOutputFormat.OUTPUT_TABLE, "analytics_revenue_by_month");

        Job job = Job.getInstance(conf, "Revenue By Month");
        job.setJarByClass(RevenueByMonthMR.class);
        job.setMapperClass(RevenueMapper.class);
        job.setReducerClass(RevenueReducer.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(DoubleWritable.class);
        job.setOutputFormatClass(TableOutputFormat.class);
        job.setOutputKeyClass(ImmutableBytesWritable.class);
        job.setOutputValueClass(Put.class);

        FileInputFormat.addInputPath(job,
                new Path("hdfs://namenode:8020/data/historical/olist_orders_dataset.csv"));

        boolean success = job.waitForCompletion(true);
        System.out.println("[MR] RevenueByMonth : " + (success ? "OK ✅" : "ECHEC ❌"));
    }
}