package com.example.demo.services;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class HBaseAnalyticsService {

    private Configuration getHBaseConfig() {
        Configuration config = HBaseConfiguration.create();
        config.set("hbase.zookeeper.quorum", "jee-bigdata-project-hbase-master-1");
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
        // Nouvelle connexion à chaque appel — évite les sessions expirées
        try (Connection connection = ConnectionFactory.createConnection(getHBaseConfig())) {
            List<Map<String, String>> results = new ArrayList<>();
            Table table = connection.getTable(TableName.valueOf(tableName));
            Scan scan = new Scan();
            ResultScanner scanner = table.getScanner(scan);
            for (Result result : scanner) {
                Map<String, String> row = rowToMap(result);
                row.put("rowKey", Bytes.toString(result.getRow()));
                results.add(row);
            }
            scanner.close();
            table.close();
            System.out.println("[HBase] " + tableName + " → " + results.size() + " lignes");
            return results;
        } catch (Exception e) {
            System.err.println("[HBase] Erreur " + tableName + " : " + e.getMessage());
            return new ArrayList<>();
        }
    }
}