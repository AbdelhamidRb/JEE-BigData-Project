package com.example.demo.config;

import com.example.demo.entities.*;
import com.example.demo.repositories.*;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String DATA_DIR = "/tmp/olist/";
    private Map<String, String> ptToEnCategory = new LinkedHashMap<>();
    private Configuration hbaseConfig;

    @Override
    public void run(String... args) throws Exception {
        initRoles();
        initAdminUser();
        checkDataDir();
        seedCategories();
        seedProducts();
        seedSampleUsers();
        seedOrdersAndItems();
        writeToHBase();
    }

    private void checkDataDir() {
        Path dataDir = Path.of(DATA_DIR);
        if (!Files.exists(dataDir)) {
            log.info("[DataInit] {} not found, skipping CSV import", DATA_DIR);
            return;
        }
        log.info("[DataInit] Data dir found: " + DATA_DIR);
    }

    private void initRoles() {
        if (roleRepository.findByName("USER").isEmpty()) {
            roleRepository.save(new Role(null, "USER"));
        }
        if (roleRepository.findByName("ADMIN").isEmpty()) {
            roleRepository.save(new Role(null, "ADMIN"));
        }
    }

    private void initAdminUser() {
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setCity("AdminCity");
            admin.setState("AdminState");
            admin.setActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setRoles(List.of(roleRepository.findByName("ADMIN").orElse(null)));
            userRepository.save(admin);
            log.info("[DataInit] Admin user created: admin@example.com / admin123");
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() > 0) {
            log.info("[DataInit] Categories already exist, skipping");
            return;
        }
        String file = DATA_DIR + "product_category_name_translation.csv";
        if (!Files.exists(Path.of(file))) {
            log.info("[DataInit] Category CSV not found: " + file);
            return;
        }
        int count = 0;
        try (CSVReader reader = new CSVReader(new FileReader(file))) {
            reader.readNext();
            String[] row;
            while ((row = reader.readNext()) != null) {
                if (row.length < 2) continue;
                String ptName = stripBOM(row[0]).trim().toLowerCase();
                String enName = row[1].trim();
                if (ptName.isEmpty() || enName.isEmpty()) continue;

                ptToEnCategory.put(ptName, enName);

                Category cat = new Category();
                cat.setName(enName.replace("_", " "));
                cat.setDescription("Category: " + enName.replace("_", " "));
                cat.setActive(true);
                categoryRepository.save(cat);
                count++;
            }
        } catch (IOException | CsvValidationException e) {
            log.info("[DataInit] Error reading categories: " + e.getMessage());
        }
        log.info("[DataInit] Categories seeded: {}", count);
    }

    private void seedProducts() {
        if (productRepository.count() > 0) {
            log.info("[DataInit] Products already exist, skipping");
            return;
        }
        String file = DATA_DIR + "olist_products_dataset.csv";
        if (!Files.exists(Path.of(file))) {
            log.info("[DataInit] Products CSV not found: " + file);
            return;
        }
        List<Category> categories = categoryRepository.findAll();
        if (categories.isEmpty()) {
            log.info("[DataInit] No categories found, cannot seed products");
            return;
        }
        int count = 0;
        int maxProducts = 500;
        try (CSVReader reader = new CSVReader(new FileReader(file))) {
            String[] header = reader.readNext();
            int ptCatIdx = findIndex(header, "product_category_name");
            int weightIdx = findIndex(header, "product_weight_g");
            int lengthIdx = findIndex(header, "product_length_cm");
            int heightIdx = findIndex(header, "product_height_cm");
            int widthIdx = findIndex(header, "product_width_cm");

            String[] row;
            while ((row = reader.readNext()) != null && count < maxProducts) {
                String ptCat = ptCatIdx >= 0 ? stripBOM(row[ptCatIdx]).trim().toLowerCase() : "";
                Category cat = findCategoryByPtName(categories, ptCat);
                if (cat == null) continue;

                int weight = weightIdx >= 0 && !row[weightIdx].trim().isEmpty() ? parseInt(row[weightIdx]) : 100;
                double price = Math.max(9.99, weight / 10.0 + ThreadLocalRandom.current().nextDouble(0, 50));
                price = Math.round(price * 100.0) / 100.0;

                Product product = new Product();
                product.setName(cat.getName() + " #" + (count + 1));
                product.setDescription("High quality " + cat.getName() + " from Brazil. " +
                    "Dimensions: " + lengthStr(row, lengthIdx) + "x" +
                    lengthStr(row, heightIdx) + "x" + lengthStr(row, widthIdx) + " cm. " +
                    "Weight: " + weight + "g.");
                product.setPrice(price);
                product.setStock(ThreadLocalRandom.current().nextInt(1, 200));
                product.setCategory(cat);
                product.setActive(true);
                product.setImageUrl("https://picsum.photos/seed/p" + count + "/400/400");
                productRepository.save(product);
                count++;
            }
        } catch (IOException | CsvValidationException e) {
            log.info("[DataInit] Error reading products: " + e.getMessage());
        }
        log.info("[DataInit] Products seeded: {}", count);
    }

    private void seedSampleUsers() {
        if (userRepository.count() > 2) {
            log.info("[DataInit] Users already exist, skipping");
            return;
        }
        String file = DATA_DIR + "olist_customers_dataset.csv";
        if (!Files.exists(Path.of(file))) {
            log.info("[DataInit] Customers CSV not found: " + file);
            return;
        }
        int count = 0;
        int maxUsers = 30;
        try (CSVReader reader = new CSVReader(new FileReader(file))) {
            reader.readNext();
            String[] row;
            while ((row = reader.readNext()) != null && count < maxUsers) {
                if (row.length < 5) continue;
                String city = row[3].trim();
                String state = row[4].trim().toUpperCase();
                if (city.isEmpty() || state.isEmpty()) continue;
                if (userRepository.findByEmail("customer" + (count + 1) + "@olist.com").isPresent()) continue;

                User user = new User();
                user.setUsername("user" + (count + 1));
                user.setEmail("customer" + (count + 1) + "@olist.com");
                user.setPassword(passwordEncoder.encode("password123"));
                user.setCity(city.substring(0, Math.min(city.length(), 50)));
                user.setState(state);
                user.setActive(true);
                user.setCreatedAt(LocalDateTime.now().minusDays(ThreadLocalRandom.current().nextInt(1, 730)));
                user.setRoles(List.of(roleRepository.findByName("USER").orElse(null)));
                userRepository.save(user);
                count++;
            }
        } catch (IOException | CsvValidationException e) {
            log.info("[DataInit] Error reading customers: " + e.getMessage());
        }
        log.info("[DataInit] Sample users seeded: {}", count);
    }

    private void seedOrdersAndItems() {
        if (orderRepository.count() > 0) {
            log.info("[DataInit] Orders already exist, skipping");
            return;
        }
        String ordersFile = DATA_DIR + "olist_orders_dataset.csv";
        String itemsFile = DATA_DIR + "olist_order_items_dataset.csv";
        if (!Files.exists(Path.of(ordersFile)) || !Files.exists(Path.of(itemsFile))) {
            log.info("[DataInit] Order CSV files not found");
            return;
        }
        List<User> users = userRepository.findAll().stream()
            .filter(u -> u.getEmail().startsWith("customer")).toList();
        if (users.isEmpty()) {
            log.info("[DataInit] No sample users, cannot seed orders");
            return;
        }
        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) {
            log.info("[DataInit] No products, cannot seed orders");
            return;
        }
        log.info("[DataInit] Users available: {}, Products available: {}", users.size(), products.size());

        String[] ordersHeader = new String[]{"order_id","customer_id","order_status","order_purchase_timestamp","order_approved_at","order_delivered_carrier_date","order_delivered_customer_date","order_estimated_delivery_date"};
        int dateIdxH = findIndex(ordersHeader, "order_purchase_timestamp");
        int statusIdxH = findIndex(ordersHeader, "order_status");

        Map<String, List<String[]>> ordersMap = new LinkedHashMap<>();
        int ordersRead = 0;
        try (CSVReader reader = new CSVReader(new FileReader(ordersFile))) {
            String[] header = reader.readNext();
            int idIdx = findIndex(header, "order_id");
            String[] row;
            while ((row = reader.readNext()) != null && ordersRead < 2000) {
                String orderId = idIdx >= 0 ? stripBOM(row[idIdx]).replace("\"", "").trim() : "";
                if (orderId.isEmpty()) continue;
                ordersMap.put(orderId, new ArrayList<>());
                ordersMap.get(orderId).add(row);
                ordersRead++;
            }
        } catch (IOException | CsvValidationException e) {
            log.info("[DataInit] Error reading orders: " + e.getMessage());
        }
        log.info("[DataInit] Orders loaded from CSV: {}", ordersRead);

        int itemsRead = 0;
        Map<String, List<String[]>> itemsMap = new LinkedHashMap<>();
        try (CSVReader reader = new CSVReader(new FileReader(itemsFile))) {
            String[] header = reader.readNext();
            int orderIdx = findIndex(header, "order_id");
            String[] row;
            while ((row = reader.readNext()) != null) {
                String orderId = orderIdx >= 0 ? stripBOM(row[orderIdx]).replace("\"", "").trim() : "";
                if (orderId.isEmpty()) continue;
                itemsMap.computeIfAbsent(orderId, k -> new ArrayList<>()).add(row);
                itemsRead++;
            }
        } catch (IOException | CsvValidationException e) {
            log.info("[DataInit] Error reading order items: " + e.getMessage());
        }
        log.info("[DataInit] Order items loaded from CSV: {} rows, {} orders", itemsRead, itemsMap.size());

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        int orderCount = 0;
        int itemCount = 0;
        Random rand = ThreadLocalRandom.current();

        for (Map.Entry<String, List<String[]>> entry : ordersMap.entrySet()) {
            String orderId = entry.getKey();
            List<String[]> orderRows = entry.getValue();
            List<String[]> itemRows = itemsMap.get(orderId);

            User user = users.get(rand.nextInt(users.size()));
            String[] orderRow = orderRows.get(0);

            String dateStr = "";
            String status = "delivered";
            if (dateIdxH >= 0 && dateIdxH < orderRow.length) dateStr = orderRow[dateIdxH].trim();
            if (statusIdxH >= 0 && statusIdxH < orderRow.length) status = orderRow[statusIdxH].trim();

            double total = 0;
            List<OrderItem> items = new ArrayList<>();

            List<String[]> rowsToUse = itemRows != null ? itemRows : new ArrayList<String[]>();
            for (String[] row : rowsToUse) {
                if (items.size() >= 3) break;

                double itemPrice;
                int priceIdx = 4;
                if (row.length > priceIdx && !row[priceIdx].trim().isEmpty()) {
                    try { itemPrice = Double.parseDouble(row[priceIdx].trim()); }
                    catch (Exception e) { itemPrice = 0; }
                } else {
                    itemPrice = 0;
                }
                if (itemPrice <= 0) itemPrice = 10 + rand.nextDouble() * 290;

                total += itemPrice;
                Product prod = products.get(rand.nextInt(products.size()));
                OrderItem item = new OrderItem();
                item.setPrice(Math.round(itemPrice * 100.0) / 100.0);
                item.setQuantity(1 + rand.nextInt(3));
                item.setProduct(prod);
                items.add(item);
            }

            if (items.isEmpty()) {
                double basePrice = 10 + rand.nextDouble() * 290;
                total = basePrice;
                Product prod = products.get(rand.nextInt(products.size()));
                OrderItem item = new OrderItem();
                item.setPrice(Math.round(basePrice * 100.0) / 100.0);
                item.setQuantity(1 + rand.nextInt(2));
                item.setProduct(prod);
                items.add(item);
            }

            LocalDateTime orderDate;
            try { orderDate = LocalDateTime.parse(dateStr, fmt); }
            catch (Exception e) { orderDate = LocalDateTime.now().minusDays(rand.nextInt(1, 365)); }

            Order order = new Order();
            order.setUser(user);
            order.setOrderDate(orderDate);
            order.setTotalAmount(Math.round(total * 100.0) / 100.0);
            order.setStatus(mapStatus(status));
            order.setShippingAddress(user.getCity() + ", " + user.getState() + ", Brazil");
            order = orderRepository.save(order);

            for (OrderItem item : items) {
                item.setOrder(order);
                orderItemRepository.save(item);
                itemCount++;
            }
            orderCount++;
            if (orderCount % 50 == 0) log.info("[DataInit] Orders processed: {}", orderCount);
        }
        log.info("[DataInit] Orders seeded: {}, items: {}", orderCount, itemCount);
    }

    private void writeToHBase() {
        log.info("[DataInit] Writing data to HBase...");
        hbaseConfig = HBaseConfiguration.create();
        hbaseConfig.set("hbase.zookeeper.quorum", "hbase-master");
        hbaseConfig.set("hbase.zookeeper.property.clientPort", "2181");
        hbaseConfig.set("zookeeper.session.timeout", "60000");
        hbaseConfig.set("hbase.client.retries.number", "3");

        if (!waitForHBase(30)) {
            log.warn("[DataInit] HBase not available — skipping HBase write");
            return;
        }

        try {
            writeSalesByCategory();
            writeRevenueByMonth();
            writeReviewsByCategory();
            log.info("[DataInit] HBase write complete!");
        } catch (Exception e) {
            log.error("[DataInit] Error writing to HBase: {}", e.getMessage());
            e.printStackTrace();
        }
    }

    private boolean waitForHBase(int maxSeconds) {
        for (int i = 0; i < maxSeconds / 5; i++) {
            try (Connection conn = ConnectionFactory.createConnection(hbaseConfig)) {
                Admin admin = conn.getAdmin();
                admin.listTableNames();
                admin.close();
                conn.close();
                return true;
            } catch (Exception e) {
                log.info("[DataInit] Waiting for HBase... attempt {}", i + 1);
                try { Thread.sleep(5000); } catch (InterruptedException ignored) {}
            }
        }
        return false;
    }

    private void writeSalesByCategory() throws IOException {
        List<Order> orders = orderRepository.findAll();
        Map<String, Double> revenueByCategory = new LinkedHashMap<>();
        Map<String, Integer> ordersByCategory = new LinkedHashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getProduct() == null || item.getProduct().getCategory() == null) continue;
                String catName = item.getProduct().getCategory().getName();
                double price = item.getPrice() * item.getQuantity();
                revenueByCategory.merge(catName, price, Double::sum);
                ordersByCategory.merge(catName, 1, Integer::sum);
            }
        }

        try (Connection conn = ConnectionFactory.createConnection(hbaseConfig);
             Table table = conn.getTable(TableName.valueOf("analytics_sales_by_category"))) {

            for (Map.Entry<String, Double> entry : revenueByCategory.entrySet()) {
                String cat = entry.getKey().replace(" ", "_").toLowerCase();
                String rowKey = "hist_cat_" + cat;
                Put put = new Put(Bytes.toBytes(rowKey));
                put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("source"), Bytes.toBytes("historical"));
                put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("category"), Bytes.toBytes(entry.getKey()));
                put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("total_revenue"), Bytes.toBytes(String.format("%.2f", entry.getValue())));
                put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("total_orders"), Bytes.toBytes(String.valueOf(ordersByCategory.get(entry.getKey()))));
                table.put(put);
            }
        }
        log.info("[DataInit] Wrote {} categories to analytics_sales_by_category", revenueByCategory.size());
    }

    private void writeRevenueByMonth() throws IOException {
        List<Order> orders = orderRepository.findAll();
        Map<String, Integer> ordersByMonth = new LinkedHashMap<>();

        for (Order order : orders) {
            if (order.getOrderDate() != null) {
                String month = order.getOrderDate().toString().substring(0, 7);
                ordersByMonth.merge(month, 1, Integer::sum);
            }
        }

        try (Connection conn = ConnectionFactory.createConnection(hbaseConfig);
             Table table = conn.getTable(TableName.valueOf("analytics_revenue_by_month"))) {

            for (Map.Entry<String, Integer> entry : ordersByMonth.entrySet()) {
                String rowKey = "hist_" + entry.getKey();
                Put put = new Put(Bytes.toBytes(rowKey));
                put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("source"), Bytes.toBytes("historical"));
                put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("month"), Bytes.toBytes(entry.getKey()));
                put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("total_orders"), Bytes.toBytes(String.valueOf(entry.getValue())));
                table.put(put);
            }
        }
        log.info("[DataInit] Wrote {} months to analytics_revenue_by_month", ordersByMonth.size());
    }

    private void writeReviewsByCategory() throws IOException {
        try (Connection conn = ConnectionFactory.createConnection(hbaseConfig);
             Table table = conn.getTable(TableName.valueOf("analytics_reviews_by_category"))) {

            int[] scoreDistribution = {5000, 2000, 3000, 20000, 45000};
            int[] scores = {1, 2, 3, 4, 5};
            int total = 0;
            for (int d : scoreDistribution) total += d;

            for (int i = 0; i < scores.length; i++) {
                int score = scores[i];
                int count = scoreDistribution[i];
                double avgRating = score;
                int positive = (score >= 4) ? count : 0;
                int negative = (score <= 2) ? count : 0;
                double satPct = (positive + negative > 0) ? ((double) positive / count) * 100 : 0;

                String rowKey = "hist_score_" + score;
                Put put = new Put(Bytes.toBytes(rowKey));
                put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("source"), Bytes.toBytes("historical"));
                put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("category"), Bytes.toBytes("score_" + score));
                put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("avg_rating"), Bytes.toBytes(String.format("%.2f", avgRating)));
                put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("total_reviews"), Bytes.toBytes(String.valueOf(count)));
                put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("positive_reviews"), Bytes.toBytes(String.valueOf(positive)));
                put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("negative_reviews"), Bytes.toBytes(String.valueOf(negative)));
                put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("satisfaction_pct"), Bytes.toBytes(String.format("%.1f", satPct)));
                table.put(put);
            }
        }
        log.info("[DataInit] Wrote review scores to analytics_reviews_by_category");
    }

    private String stripBOM(String s) {
        if (s != null && s.length() > 0 && s.charAt(0) == '\uFEFF') {
            return s.substring(1);
        }
        return s;
    }

    private Category findCategoryByPtName(List<Category> categories, String ptName) {
        String enName = ptToEnCategory.get(ptName.toLowerCase());
        if (enName != null) {
            for (Category cat : categories) {
                if (cat.getName().replace(" ", "_").equalsIgnoreCase(enName)) {
                    return cat;
                }
            }
        }
        if (!categories.isEmpty()) return categories.get(ThreadLocalRandom.current().nextInt(categories.size()));
        return null;
    }

    private int parseInt(String s) {
        try { return (int) Double.parseDouble(s.trim()); }
        catch (Exception e) { return 0; }
    }

    private String lengthStr(String[] row, int idx) {
        if (idx < 0 || idx >= row.length) return "0";
        return row[idx].trim().isEmpty() ? "0" : row[idx].trim();
    }

    private int findIndex(String[] header, String name) {
        for (int i = 0; i < header.length; i++) {
            if (header[i].trim().equalsIgnoreCase(name)) return i;
        }
        return -1;
    }

    private String mapStatus(String olistStatus) {
        return switch (olistStatus.toLowerCase()) {
            case "delivered" -> "LIVRE";
            case "shipped" -> "EXPEDIEE";
            case "canceled", "unavailable" -> "ANNULEE";
            case "invoiced" -> "CONFIRMEE";
            case "processing", "created" -> "EN_ATTENTE";
            case "approved" -> "CONFIRMEE";
            default -> "EN_ATTENTE";
        };
    }
}