package com.tonnyshema.marketplace.marketplace_api.controller;

import com.tonnyshema.marketplace.marketplace_api.dto.OrderDto;
import com.tonnyshema.marketplace.marketplace_api.dto.OrderItemDto;
import com.tonnyshema.marketplace.marketplace_api.model.Order;
import com.tonnyshema.marketplace.marketplace_api.model.OrderItem;
import com.tonnyshema.marketplace.marketplace_api.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/{buyerId}")
    @PreAuthorize("hasRole('SHOPPER') or hasRole('ADMIN')")
    public ResponseEntity<OrderDto> placeOrder(
            @PathVariable Long buyerId,
            @Valid @RequestBody List<OrderItemDto> items) {
        return ResponseEntity.ok(orderService.placeOrder(buyerId, items));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> listAllOrders() {
        return ResponseEntity.ok(orderService.findAllOrders());
    }


    @GetMapping("/history/{buyerId}")
    public ResponseEntity<List<OrderDto>> orderHistory(@PathVariable Long buyerId) {
        return ResponseEntity.ok(orderService.history(buyerId));
    }

    @GetMapping("/{orderId}/status")
    @PreAuthorize("hasRole('SHOPPER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> getOrderStatus(@PathVariable Long orderId) {
        OrderDto dto = orderService.getById(orderId);
        return ResponseEntity.ok(Map.of("status", dto.getStatus().name()));
    }
}

