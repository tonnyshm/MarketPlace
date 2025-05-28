package com.tonnyshema.marketplace.marketplace_api.dto;
import com.tonnyshema.marketplace.marketplace_api.model.OrderItem;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
public class OrderItemDto {
    private Long id;

    @NotNull
    private ProductDto product; // <-- Use the full product object!

    @Min(1)
    private int quantity;

    private BigDecimal price;
    public OrderItemDto(OrderItem item) {
        this.id = item.getId();
        this.product = new ProductDto(item.getProduct()); // <-- map product
        this.quantity = item.getQuantity();
        this.price = item.getPrice();
    }
}

