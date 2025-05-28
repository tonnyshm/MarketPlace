package com.tonnyshema.marketplace.marketplace_api.dto;

import com.tonnyshema.marketplace.marketplace_api.model.Review;
import com.tonnyshema.marketplace.marketplace_api.model.Store;
import com.tonnyshema.marketplace.marketplace_api.model.Product;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Data
@NoArgsConstructor
public class StoreDto {
    private Long id;
    private String name;
    private String description;
    private Long ownerId;
    private String ownerName;
    private Integer productCount;
    private List<CategoryDto> categories;

    private Double rating;      // average rating
    private Integer reviewCount; // total number of reviews

    public StoreDto(Store store) {
        this.id = store.getId();
        this.name = store.getName();
        this.description = store.getDescription();
        this.ownerId = store.getOwner().getId();
        this.ownerName = store.getOwner().getName();
        this.productCount = store.getProducts() != null ? store.getProducts().size() : 0;

        // Collect unique categories from the store's products
        if (store.getProducts() != null) {
            this.categories = store.getProducts().stream()
                    .filter(product -> product.getCategory() != null)
                    .map(product -> product.getCategory())
                    .distinct()
                    .map(CategoryDto::new)
                    .collect(Collectors.toList());
        } else {
            this.categories = new ArrayList<>();
        }

        // Collect all reviews for all products in this store
        List<Review> allReviews = new ArrayList<>();
        if (store.getProducts() != null) {
            for (Product product : store.getProducts()) {
                if (product.getReviews() != null) {
                    allReviews.addAll(product.getReviews());
                }
            }
        }
        this.reviewCount = allReviews.size();
        this.rating = this.reviewCount > 0
                ? allReviews.stream().mapToInt(Review::getRating).average().orElse(0.0)
                : null;
    }
    public static StoreDto fromEntity(Store store) {
        return new StoreDto(store);
    }
}

