package com.example.demo.repositories;

import com.example.demo.entities.Order;
import com.example.demo.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.demo.dto.CategorySalesDto;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Permet à un utilisateur de voir l'historique de ses commandes
    List<Order> findByUserId(Long userId);
    List<Order> findByUserOrderByIdDesc(User user);


    @Query("SELECT c.name as categoryName, SUM(oi.quantity * oi.price) as totalSales " +
            "FROM OrderItem oi " +
            "JOIN oi.product p " +
            "JOIN p.category c " +
            "JOIN oi.order o " +
            "WHERE o.status != 'ANNULE' " + // On ignore les commandes annulées
            "GROUP BY c.name " +
            "ORDER BY totalSales DESC")
    List<CategorySalesDto> findSalesByCategory();
}