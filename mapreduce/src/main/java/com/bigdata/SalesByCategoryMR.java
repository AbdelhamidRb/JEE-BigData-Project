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
import org.apache.hadoop.hbase.HBaseConfiguration;

import java.io.IOException;

public class SalesByCategoryMR {

    public static class SalesMapper
            extends Mapper<LongWritable, Text, Text, DoubleWritable> {

        private boolean isHeader = true;

        @Override
        public void map(LongWritable key, Text value, Context context)
                throws IOException, InterruptedException {
            if (isHeader) { isHeader = false; return; }

            // order_id(0), order_item_id(1), product_id(2), seller_id(3),
            // shipping_limit_date(4), price(5), freight_value(6)
            String[] f = value.toString().split(",");
            if (f.length < 6) return;

            try {
                String productId = f[2].trim().replace("\"", "");
                double price     = Double.parseDouble(f[5].trim().replace("\"", ""));
                context.write(new Text(productId), new DoubleWritable(price));
            } catch (Exception e) { /* ignore */ }
        }
    }

    public static class SalesReducer
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

            String rowKey = "hist_product_" + key.toString();
            Put put = new Put(Bytes.toBytes(rowKey));
            byte[] family = Bytes.toBytes("stats");

            put.addColumn(family, Bytes.toBytes("source"),        Bytes.toBytes("historical"));
            put.addColumn(family, Bytes.toBytes("product_id"),    Bytes.toBytes(key.toString()));
            put.addColumn(family, Bytes.toBytes("total_revenue"), Bytes.toBytes(String.format("%.2f", totalRevenue)));
            put.addColumn(family, Bytes.toBytes("total_orders"),  Bytes.toBytes(String.valueOf(totalOrders)));

            context.write(new ImmutableBytesWritable(Bytes.toBytes(rowKey)), put);
        }
    }

    public static void run(Configuration conf) throws Exception {
        conf.set(TableOutputFormat.OUTPUT_TABLE, "analytics_sales_by_category");

        Job job = Job.getInstance(conf, "Sales By Product");
        job.setJarByClass(SalesByCategoryMR.class);
        job.setMapperClass(SalesMapper.class);
        job.setReducerClass(SalesReducer.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(DoubleWritable.class);
        job.setOutputFormatClass(TableOutputFormat.class);
        job.setOutputKeyClass(ImmutableBytesWritable.class);
        job.setOutputValueClass(Put.class);

        FileInputFormat.addInputPath(job,
                new Path("hdfs://namenode:8020/data/historical/olist_order_items_dataset.csv"));

        boolean success = job.waitForCompletion(true);
        System.out.println("[MR] SalesByCategory : " + (success ? "OK ✅" : "ECHEC ❌"));
    }
}