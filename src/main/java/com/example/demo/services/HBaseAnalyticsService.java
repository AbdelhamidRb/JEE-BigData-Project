package com.example.demo.services;

import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.TableNotFoundException;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class HBaseAnalyticsService {

    @Autowired
    private Connection hbaseConnection;

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
            Table table = hbaseConnection.getTable(TableName.valueOf(tableName));
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
            System.out.println("[HBase] " + tableName + " → " + results.size() + " rows");
            return results;
        } catch (TableNotFoundException e) {
            System.out.println("[HBase] Table not found: " + tableName + " (will be created on next seed)");
            return new ArrayList<>();
        } catch (Exception e) {
            System.err.println("[HBase] Error reading " + tableName + " : " + e.getMessage());
            return new ArrayList<>();
        }
    }
}
