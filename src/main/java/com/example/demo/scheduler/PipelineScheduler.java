package com.example.demo.scheduler;

import com.example.demo.services.MapReduceJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
public class PipelineScheduler {

    @Autowired
    private MapReduceJobService mapReduceJobService;

    private static final long THRESHOLD_BYTES = 128L * 1024 * 1024;
    private static final String LOG_FILE = "/app/logs/bigdata_events.log";

    @Scheduled(fixedRate = 120000) // toutes les 2 minutes
    public void checkAndTrigger() {
        File logFile = new File(LOG_FILE);
        if (logFile.exists() && logFile.length() >= THRESHOLD_BYTES) {
            System.out.println("[Pipeline] Fichier ≥ 128MB → déclenchement MapReduce");
            mapReduceJobService.runRealtimeJob();
        }
    }
}