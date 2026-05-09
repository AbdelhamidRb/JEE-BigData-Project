package com.example.demo.services;

import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.TableNotFoundException;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class HBaseAnalyticsService {

    private org.apache.hadoop.conf.Configuration getHBaseConfig() {
        org.apache.hadoop.conf.Configuration config = org.apache.hadoop.hbase.HBaseConfiguration.create();
        config.set("hbase.zookeeper.quorum", "hbase-master");
        config.set("hbase.zookeeper.property.clientPort", "2181");
        config.set("hbase.client.retries.number", "3");
        config.set("hbase.rpc.timeout", "10000");
        config.set("hbase.client.operation.timeout", "15000");
        config.set("zookeeper.session.timeout", "60000");
        config.set("zookeeper.recovery.retry", "1");
        return config;
    }

    private Map<String, String> rowToMap(Result result) {
        Map<String, String> map = new HashMap<>();
        byte[] statsFamily = Bytes.toBytes("stats");
        byte[] infoFamily  = Bytes.toBytes("info");
        if (result.getFamilyMap(statsFamily) != null) {
            result.getFamilyMap(statsFamily).forEach((q, v) ->
                    map.put(Bytes.toString(q), Bytes.toString(v)));
        }
        if (result.getFamilyMap(infoFamily) != null) {
            result.getFamilyMap(infoFamily).forEach((q, v) ->
                    map.put(Bytes.toString(q), Bytes.toString(v)));
        }
        return map;
    }

    public List<Map<String, String>> scanTable(String tableName) {
        System.out.println("[HBase] Attempting to connect to: " + tableName);
        try {
            org.apache.hadoop.conf.Configuration config = getHBaseConfig();
            Connection connection = ConnectionFactory.createConnection(config);
            Table table = connection.getTable(TableName.valueOf(tableName));
            List<Map<String, String>> results = new ArrayList<>();
            Scan scan = new Scan();
            scan.setCaching(100);
            ResultScanner scanner = table.getScanner(scan);
            for (Result result : scanner) {
                Map<String, String> row = rowToMap(result);
                row.put("rowKey", Bytes.toString(result.getRow()));
                results.add(row);
            }
            scanner.close();
            table.close();
            connection.close();
            System.out.println("[HBase] " + tableName + " → " + results.size() + " rows");
            return results;
        } catch (TableNotFoundException e) {
            System.out.println("[HBase] Table not found: " + tableName + " (will be created on next seed)");
            return new ArrayList<>();
        } catch (Exception e) {
            System.err.println("[HBase] Error reading " + tableName + " : " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}