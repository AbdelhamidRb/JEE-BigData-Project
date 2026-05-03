package com.example.demo.services;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class MapReduceJobService {

    private static final String TRIGGER_FILE = "/app/logs/trigger_mr.txt";

    @Async
    public void runRealtimeJob() {
        try {
            System.out.println("[MapReduce] Création du trigger...");
            File trigger = new File(TRIGGER_FILE);
            trigger.createNewFile();
            System.out.println("[MapReduce] Trigger créé → watcher va lancer le job");
        } catch (IOException e) {
            System.err.println("[MapReduce] Erreur trigger : " + e.getMessage());
        }
    }
}