package com.tonnyshema.marketplace.marketplace_api.dto;

import com.tonnyshema.marketplace.marketplace_api.model.Order;
import com.tonnyshema.marketplace.marketplace_api.model.OrderStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class OrderDto {
    private Long id;
    private Long buyerId;
    private List<OrderItemDto> items;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;

    public OrderDto(Order o) {
        this.id = o.getId();
        this.buyerId = o.getBuyer().getId();
        this.items = o.getItems().stream()
                .map(OrderItemDto::new)
                .collect(Collectors.toList());
        this.totalAmount = o.getTotalAmount();
        this.status = o.getStatus();
        this.createdAt = o.getCreatedAt();
    }
}


