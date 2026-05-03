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

public class RealtimeMR {

    // Input  : JSON ligne par ligne depuis HDFS /data/realtime/
    // Output : categoryName → totalAmount
    public static class RealtimeMapper
            extends Mapper<LongWritable, Text, Text, DoubleWritable> {

        @Override
        public void map(LongWritable key, Text value, Context context)
                throws IOException, InterruptedException {
            String line = value.toString().trim();
            if (line.isEmpty()) return;

            try {
                // Parse JSON manuellement (pas de lib externe)
                String eventType = extractJson(line, "eventType");
                if (!"ORDER_CREATED".equals(eventType)) return;

                String totalAmountStr = extractJson(line, "totalAmount");
                double totalAmount    = Double.parseDouble(totalAmountStr);

                // Extraire categoryName depuis items[]
                // Format: "items":[{"categoryName":"Electronique",...}]
                int itemsStart = line.indexOf("\"items\":[");
                if (itemsStart == -1) return;

                String itemsSection = line.substring(itemsStart);
                int braceStart = itemsSection.indexOf('{');
                if (braceStart == -1) return;

                String firstItem    = itemsSection.substring(braceStart);
                String categoryName = extractJson(firstItem, "categoryName");
                if (categoryName == null || categoryName.isEmpty()) return;

                context.write(new Text(categoryName), new DoubleWritable(totalAmount));
            } catch (Exception e) { /* ignore JSON malformé */ }
        }

        private String extractJson(String json, String key) {
            String search = "\"" + key + "\":\"";
            int start = json.indexOf(search);
            if (start == -1) {
                // Essaye sans guillemets (valeur numérique)
                search = "\"" + key + "\":";
                start = json.indexOf(search);
                if (start == -1) return null;
                start += search.length();
                int end = json.indexOf(",", start);
                if (end == -1) end = json.indexOf("}", start);
                return end == -1 ? null : json.substring(start, end).trim();
            }
            start += search.length();
            int end = json.indexOf("\"", start);
            return end == -1 ? null : json.substring(start, end);
        }
    }

    public static class RealtimeReducer
            extends Reducer<Text, DoubleWritable, ImmutableBytesWritable, Put> {

        @Override
        public void reduce(Text key, Iterable<DoubleWritable> values, Context context)
                throws IOException, InterruptedException {

            double totalRevenue = 0;
            int    totalOrders  = 0;

            for (DoubleWritable val : values) {
                totalRevenue += val.get();
                totalOrders++;
            }

            String rowKey = "rt_" + key.toString()
                    .replace(" ", "_").toLowerCase();
            Put put = new Put(Bytes.toBytes(rowKey));
            byte[] family = Bytes.toBytes("stats");

            put.addColumn(family, Bytes.toBytes("source"),
                    Bytes.toBytes("realtime"));
            put.addColumn(family, Bytes.toBytes("category"),
                    Bytes.toBytes(key.toString()));
            put.addColumn(family, Bytes.toBytes("total_revenue"),
                    Bytes.toBytes(String.format("%.2f", totalRevenue)));
            put.addColumn(family, Bytes.toBytes("total_orders"),
                    Bytes.toBytes(String.valueOf(totalOrders)));

            context.write(new ImmutableBytesWritable(Bytes.toBytes(rowKey)), put);
        }
    }

    public static void run(Configuration conf) throws Exception {
        conf.set(TableOutputFormat.OUTPUT_TABLE, "analytics_sales_by_category");

        Job job = Job.getInstance(conf, "Realtime Orders Analysis");
        job.setJarByClass(RealtimeMR.class);
        job.setMapperClass(RealtimeMapper.class);
        job.setReducerClass(RealtimeReducer.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(DoubleWritable.class);
        job.setOutputFormatClass(TableOutputFormat.class);
        job.setOutputKeyClass(ImmutableBytesWritable.class);
        job.setOutputValueClass(Put.class);
        FileInputFormat.setInputDirRecursive(job, true);
        FileInputFormat.addInputPath(job,
                new Path("hdfs://namenode:8020/data/realtime"));

        boolean success = job.waitForCompletion(true);
        System.out.println("[MR] Realtime : " + (success ? "OK ✅" : "ECHEC ❌"));
    }
}