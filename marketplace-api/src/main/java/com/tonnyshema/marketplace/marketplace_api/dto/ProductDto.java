package com.tonnyshema.marketplace.marketplace_api.dto;

import com.tonnyshema.marketplace.marketplace_api.model.Product;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
public class ProductDto {
    private Long   id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal oldPrice;
    private Long   categoryId;
    private Long   storeId;
    private boolean featured;
    private Integer stock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Entity → DTO
    public ProductDto(Product p) {
        this.id          = p.getId();
        this.name        = p.getName();
        this.description = p.getDescription();
        this.price       = p.getPrice();
        this.oldPrice    = p.getOldPrice();
        this.categoryId  = p.getCategory().getId();
        this.storeId     = p.getStore().getId();
        this.featured    = p.isFeatured();
        this.stock = p.getStock();
        this.createdAt   = p.getCreatedAt();
        this.updatedAt   = p.getUpdatedAt();
    }
}


