package com.example.demo.controllers;

import com.example.demo.services.HBaseAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private HBaseAnalyticsService hbaseService;

    @GetMapping("/sales-by-category")
    public ResponseEntity<?> salesByCategory() throws Exception {
        return ResponseEntity.ok(hbaseService.scanTable("analytics_sales_by_category"));
    }

    @GetMapping("/reviews-by-category")
    public ResponseEntity<?> reviewsByCategory() throws Exception {
        return ResponseEntity.ok(hbaseService.scanTable("analytics_reviews_by_category"));
    }

    @GetMapping("/revenue-by-month")
    public ResponseEntity<?> revenueByMonth() throws Exception {
        return ResponseEntity.ok(hbaseService.scanTable("analytics_revenue_by_month"));
    }

    @GetMapping("/top-products")
    public ResponseEntity<?> topProducts() throws Exception {
        return ResponseEntity.ok(hbaseService.scanTable("analytics_top_products"));
    }

    @GetMapping("/sales-by-state")
    public ResponseEntity<?> salesByState() throws Exception {
        return ResponseEntity.ok(hbaseService.scanTable("analytics_sales_by_state"));
    }
}