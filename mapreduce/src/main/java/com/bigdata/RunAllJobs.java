package com.bigdata;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;

public class RunAllJobs {

    public static void main(String[] args) throws Exception {
        Configuration conf = HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum", "hbase-master");
        conf.set("hbase.zookeeper.property.clientPort", "2181");
        conf.set("fs.defaultFS", "hdfs://namenode:8020");

        String mode = args.length > 0 ? args[0] : "all";

        System.out.println("=== MapReduce Jobs — mode: " + mode + " ===");

        if ("all".equals(mode) || "historical".equals(mode)) {
            System.out.println("\n→ Job 1: Ventes par catégorie...");
            SalesByCategoryMR.run(conf);

            System.out.println("\n→ Job 2: Reviews par catégorie...");
            ReviewsByCategoryMR.run(conf);

            System.out.println("\n→ Job 3: Revenus par mois...");
            RevenueByMonthMR.run(conf);
        }

        if ("all".equals(mode) || "realtime".equals(mode)) {
            System.out.println("\n→ Job 4: Données temps réel...");
            RealtimeMR.run(conf);
        }

        System.out.println("\n=== Tous les jobs terminés ✅ ===");
    }
}