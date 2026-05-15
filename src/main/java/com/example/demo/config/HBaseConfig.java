package com.example.demo.config;

import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.springframework.context.annotation.Bean;

@org.springframework.context.annotation.Configuration
public class HBaseConfig {

    @Bean
    public org.apache.hadoop.conf.Configuration hbaseConfiguration() {
        org.apache.hadoop.conf.Configuration config = HBaseConfiguration.create();
        config.set("hbase.zookeeper.quorum", "hbase-master");
        config.set("hbase.zookeeper.property.clientPort", "2181");
        config.set("zookeeper.session.timeout", "60000");
        config.set("hbase.client.retries.number", "3");
        config.set("hbase.rpc.timeout", "10000");
        config.set("hbase.client.operation.timeout", "15000");
        config.set("zookeeper.recovery.retry", "1");
        return config;
    }

    @Bean(destroyMethod = "close")
    public Connection hbaseConnection(org.apache.hadoop.conf.Configuration hbaseConfiguration) {
        try {
            return ConnectionFactory.createConnection(hbaseConfiguration);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create HBase connection", e);
        }
    }
}
