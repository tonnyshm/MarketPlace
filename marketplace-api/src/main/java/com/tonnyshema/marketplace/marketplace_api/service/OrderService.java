package com.tonnyshema.marketplace.marketplace_api.service;

import com.tonnyshema.marketplace.marketplace_api.dto.OrderDto;
import com.tonnyshema.marketplace.marketplace_api.dto.OrderItemDto;
import com.tonnyshema.marketplace.marketplace_api.model.*;
import com.tonnyshema.marketplace.marketplace_api.repository.OrderRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.ProductRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.UserRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository,
                        RabbitTemplate rabbitTemplate) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Transactional
    public OrderDto placeOrder(Long buyerId, List<OrderItemDto> dtos) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
        Order order = new Order();
        order.setBuyer(buyer);

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        for (OrderItemDto dto : dtos) {
            Product product = productRepository.findById(dto.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // STOCK CHECK
            int requestedQty = dto.getQuantity();
            if (product.getStock() == null || product.getStock() < requestedQty) {
                throw new RuntimeException("Product " + product.getName() + " is out of stock or not enough quantity available.");
            }

            // DECREMENT STOCK
            product.setStock(product.getStock() - requestedQty);
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(requestedQty);
            BigDecimal price = product.getPrice().multiply(BigDecimal.valueOf(requestedQty));
            item.setPrice(price);
            items.add(item);

            total = total.add(price);
        }

        order.setItems(items);
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);
        rabbitTemplate.convertAndSend("orders.exchange","orders.routingkey", saved);
        return new OrderDto(saved);
    }

    public List<OrderDto> history(Long buyerId) {
        return orderRepository.findByBuyerId(buyerId).stream()
                .map(OrderDto::new)
                .collect(Collectors.toList());
    }

    public List<OrderDto> findAllOrders() {
        return orderRepository.findAll().stream()
                .map(OrderDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDto updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(OrderStatus.valueOf(status));
        Order savedOrder = orderRepository.save(order);

        // Send notification event to RabbitMQ
        rabbitTemplate.convertAndSend("orders.exchange", "orders.status.update", savedOrder.getId());

        return new OrderDto(savedOrder);
    }

    public List<OrderDto> findOrdersByStore(Long storeId) {
        return orderRepository.findByItems_Product_Store_Id(storeId).stream()
                .map(OrderDto::new)
                .collect(Collectors.toList());
    }

    public OrderDto getById(Long id) {
        return orderRepository.findById(id)
                .map(OrderDto::new)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}

