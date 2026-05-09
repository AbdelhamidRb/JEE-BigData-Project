package com.example.demo.config;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.HTableDescriptor;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.TableExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.concurrent.ThreadLocalRandom;

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

    @PostConstruct
    public void init() {
        log.info("[HBaseInit] Starting HBase initialization...");
        Configuration config = createConfig();

        if (!waitForHBase(config, 60)) {
            log.error("[HBaseInit] HBase not available after 60s — skipping initialization");
            return;
        }
        log.info("[HBaseInit] HBase is available!");

        try (Connection conn = ConnectionFactory.createConnection(config)) {
            createTablesIfNotExist(conn);
            log.info("[HBaseInit] All tables ready.");
        } catch (Exception e) {
            log.error("[HBaseInit] Failed to initialize HBase: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private Configuration createConfig() {
        Configuration config = HBaseConfiguration.create();
        config.set("hbase.zookeeper.quorum", "hbase-master");
        config.set("hbase.zookeeper.property.clientPort", "2181");
        config.set("zookeeper.session.timeout", "60000");
        config.set("hbase.client.retries.number", "3");
        return config;
    }

    private boolean waitForHBase(Configuration config, int maxSeconds) {
        for (int i = 0; i < maxSeconds / 5; i++) {
            try (Connection conn = ConnectionFactory.createConnection(config)) {
                Admin admin = conn.getAdmin();
                admin.listTableNames();
                admin.close();
                conn.close();
                log.info("[HBaseInit] HBase responded on attempt " + (i + 1));
                return true;
            } catch (Exception e) {
                log.info("[HBaseInit] Waiting for HBase... attempt {} of {}", i + 1, maxSeconds / 5);
                try { Thread.sleep(5000); } catch (InterruptedException ignored) {}
            }
        }
        return false;
    }

    private void createTablesIfNotExist(Connection conn) throws Exception {
        Admin admin = conn.getAdmin();
        try {
            for (String tableName : TABLES) {
                TableName tn = TableName.valueOf(tableName);
                if (!admin.tableExists(tn)) {
                    HTableDescriptor desc = new HTableDescriptor(tn);
                    if (tableName.equals("analytics_top_products")) {
                        desc.addFamily(new org.apache.hadoop.hbase.HColumnDescriptor("info"));
                    } else {
                        desc.addFamily(new org.apache.hadoop.hbase.HColumnDescriptor("stats"));
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
        try {
            Configuration config = createConfig();
            try (Connection conn = ConnectionFactory.createConnection(config);
                 Table table = conn.getTable(TableName.valueOf(tableName))) {

                org.apache.hadoop.hbase.client.Put put =
                        new org.apache.hadoop.hbase.client.Put(rowKey.getBytes());
                put.addColumn(family.getBytes(), qualifier.getBytes(), value.getBytes());
                table.put(put);
            }
        } catch (Exception e) {
            log.error("[HBaseInit] Failed to write to HBase table " + tableName + ": " + e.getMessage());
        }
    }
}