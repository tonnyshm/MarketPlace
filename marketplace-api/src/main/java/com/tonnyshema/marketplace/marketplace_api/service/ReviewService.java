package com.tonnyshema.marketplace.marketplace_api.service;

import com.tonnyshema.marketplace.marketplace_api.dto.ReviewDto;
import com.tonnyshema.marketplace.marketplace_api.model.*;
import com.tonnyshema.marketplace.marketplace_api.repository.OrderRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.ProductRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.ReviewRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
@Service
public class ReviewService {
    private final ReviewRepository  reviewRepository;
    private final OrderRepository   orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository,
                         OrderRepository orderRepository,
                         UserRepository userRepository,
                         ProductRepository productRepository) {
        this.reviewRepository   = reviewRepository;
        this.orderRepository    = orderRepository;
        this.userRepository     = userRepository;
        this.productRepository  = productRepository;
    }

    @Transactional
    public ReviewDto addReview(Long userId, Long productId, ReviewDto dto) {
        // 1) Ensure user purchased this product
        Set<Long> purchased = orderRepository.findByBuyerId(userId).stream()
                .flatMap(o -> o.getItems().stream())
                .map(item -> item.getProduct().getId())
                .collect(Collectors.toSet());
        if (!purchased.contains(productId)) {
            throw new RuntimeException("Cannot review a product not purchased");
        }

        // 2) Fetch user & product
        User user       = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 3) Build entity & save
        Review r = new Review();
        r.setRating(dto.getRating());
        r.setComment(dto.getComment());
        r.setUser(user);
        r.setProduct(product);
        Review saved = reviewRepository.save(r);

        // 4) Return DTO
        return new ReviewDto(saved);
    }

    public List<ReviewDto> listByProduct(Long productId) {
        return reviewRepository.findAll().stream()
                .filter(r -> r.getProduct().getId().equals(productId))
                .map(ReviewDto::new)
                .collect(Collectors.toList());
    }
}
