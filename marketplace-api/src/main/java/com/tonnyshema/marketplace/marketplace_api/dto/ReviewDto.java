package com.tonnyshema.marketplace.marketplace_api.dto;
import com.tonnyshema.marketplace.marketplace_api.model.Review;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ReviewDto {
    private Long id;

    @Min(1) @Max(5)
    private int rating;

    @Size(max = 1000)
    private String comment;

    private Long userId;
    private Long productId;
    private LocalDateTime createdAt;

    public ReviewDto(Review r) {
        this.id         = r.getId();
        this.rating     = r.getRating();
        this.comment    = r.getComment();
        this.userId     = r.getUser().getId();
        this.productId  = r.getProduct().getId();
        this.createdAt  = r.getCreatedAt();
    }
}

