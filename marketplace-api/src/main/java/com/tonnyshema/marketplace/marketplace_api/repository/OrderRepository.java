package com.tonnyshema.marketplace.marketplace_api.repository;

import com.tonnyshema.marketplace.marketplace_api.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerId(Long buyerId);
    List<Order> findByItems_Product_Store_Id(Long storeId);
}
