package com.example.demo.config;

import org.apache.hadoop.hbase.HColumnDescriptor;
import org.apache.hadoop.hbase.HTableDescriptor;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class HBaseInitializer {

    private static final Logger log = LoggerFactory.getLogger(HBaseInitializer.class);

    private static final String[] TABLES = {
            "analytics_sales_by_category",
            "analytics_reviews_by_category",
            "analytics_revenue_by_month",
            "analytics_top_products",
            "analytics_sales_by_state"
    };

    @Autowired
    private Connection hbaseConnection;

    @PostConstruct
    public void init() {
        log.info("[HBaseInit] Starting HBase initialization...");

        if (!waitForHBase(60)) {
            log.error("[HBaseInit] HBase not available after 60s — skipping initialization");
            return;
        }
        log.info("[HBaseInit] HBase is available!");

        try {
            createTablesIfNotExist();
            log.info("[HBaseInit] All tables ready.");
        } catch (Exception e) {
            log.error("[HBaseInit] Failed to initialize HBase: " + e.getMessage());
        }
    }

    private boolean waitForHBase(int maxSeconds) {
        for (int i = 0; i < maxSeconds / 5; i++) {
            try {
                Admin admin = hbaseConnection.getAdmin();
                admin.listTableNames();
                admin.close();
                log.info("[HBaseInit] HBase responded on attempt " + (i + 1));
                return true;
            } catch (Exception e) {
                log.info("[HBaseInit] Waiting for HBase... attempt {} of {}", i + 1, maxSeconds / 5);
                try { Thread.sleep(5000); } catch (InterruptedException ignored) {}
            }
        }
        return false;
    }

    private void createTablesIfNotExist() throws Exception {
        Admin admin = hbaseConnection.getAdmin();
        try {
            for (String tableName : TABLES) {
                TableName tn = TableName.valueOf(tableName);
                if (!admin.tableExists(tn)) {
                    HTableDescriptor desc = new HTableDescriptor(tn);
                    if (tableName.equals("analytics_top_products")) {
                        desc.addFamily(new HColumnDescriptor("info"));
                    } else {
                        desc.addFamily(new HColumnDescriptor("stats"));
                    }
                    admin.createTable(desc);
                    log.info("[HBaseInit] Created table: " + tableName);
                } else {
                    log.info("[HBaseInit] Table already exists: " + tableName);
                }
            }
        } finally {
            admin.close();
        }
    }

    public void writeToHBase(String tableName, String rowKey, String family, String qualifier, String value) {
        try (Table table = hbaseConnection.getTable(TableName.valueOf(tableName))) {
            Put put = new Put(rowKey.getBytes());
            put.addColumn(family.getBytes(), qualifier.getBytes(), value.getBytes());
            table.put(put);
        } catch (Exception e) {
            log.error("[HBaseInit] Failed to write to HBase table " + tableName + ": " + e.getMessage());
        }
    }
}
