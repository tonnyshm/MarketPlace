package com.tonnyshema.marketplace.marketplace_api.controller;

import com.tonnyshema.marketplace.marketplace_api.model.Review;
import com.tonnyshema.marketplace.marketplace_api.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import com.tonnyshema.marketplace.marketplace_api.dto.ReviewDto;
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    /** Add a review (only if purchased) **/
    @PostMapping("/{userId}/{productId}")
    @PreAuthorize("hasRole('SHOPPER') or hasRole('ADMIN')")
    public ResponseEntity<ReviewDto> addReview(
            @PathVariable Long userId,
            @PathVariable Long productId,
            @Valid @RequestBody ReviewDto dto) {
        return ResponseEntity.ok(reviewService.addReview(userId, productId, dto));
    }

    /** List all reviews for a given product **/
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDto>> listByProduct(
            @PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.listByProduct(productId));
    }
}
