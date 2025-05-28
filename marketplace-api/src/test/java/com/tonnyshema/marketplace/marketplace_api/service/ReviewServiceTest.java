package com.tonnyshema.marketplace.marketplace_api.service;

import com.tonnyshema.marketplace.marketplace_api.dto.ReviewDto;
import com.tonnyshema.marketplace.marketplace_api.model.*;
import com.tonnyshema.marketplace.marketplace_api.repository.OrderRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.ProductRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.ReviewRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.UserRepository;
import com.tonnyshema.marketplace.marketplace_api.service.ReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReviewServiceTest {
    @Mock private ReviewRepository reviewRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private UserRepository userRepository;
    @Mock private ProductRepository productRepository;
    @InjectMocks private ReviewService reviewService;

    private User user;
    private Product product;
    private Order order;
    private OrderItem orderItem;
    private Review review;

    @BeforeEach
    void setUp() {
        // Setup user
        user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@example.com");

        // Setup product
        product = new Product();
        product.setId(10L);
        product.setName("Test Product");
        product.setPrice(new BigDecimal("99.99"));

        // Setup order item
        orderItem = new OrderItem();
        orderItem.setProduct(product);
        orderItem.setQuantity(1);

        // Setup order
        order = new Order();
        order.setId(100L);
        order.setBuyer(user);
        order.setItems(List.of(orderItem));
        order.setStatus(OrderStatus.COMPLETED);

        // Setup review
        review = new Review();
        review.setId(200L);
        review.setRating(5);
        review.setComment("Great product!");
        review.setUser(user);
        review.setProduct(product);
        review.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void addReview_success() {
        // Arrange
        ReviewDto dto = new ReviewDto();
        dto.setRating(5);
        dto.setComment("Great product!");

        when(orderRepository.findByBuyerId(1L)).thenReturn(List.of(order));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(reviewRepository.save(any(Review.class))).thenAnswer(inv -> {
            Review r = inv.getArgument(0);
            r.setId(200L);
            r.setCreatedAt(LocalDateTime.now());
            return r;
        });

        // Act
        ReviewDto result = reviewService.addReview(1L, 10L, dto);

        // Assert
        assertNotNull(result);
        assertEquals(5, result.getRating());
        assertEquals("Great product!", result.getComment());
        assertEquals(200L, result.getId());
        assertEquals(1L, result.getUserId());
        assertEquals(10L, result.getProductId());
        assertNotNull(result.getCreatedAt());
        
        verify(reviewRepository).save(any(Review.class));
    }

    @Test
    void addReview_failsIfNotPurchased() {
        // Arrange
        ReviewDto dto = new ReviewDto();
        dto.setRating(4);
        dto.setComment("Nice");
        when(orderRepository.findByBuyerId(1L)).thenReturn(Collections.emptyList());

        // Act & Assert
        Exception ex = assertThrows(RuntimeException.class, 
            () -> reviewService.addReview(1L, 10L, dto));
        assertEquals("Cannot review a product not purchased", ex.getMessage());
        
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void addReview_failsIfUserNotFound() {
        // Arrange
        ReviewDto dto = new ReviewDto();
        dto.setRating(4);
        dto.setComment("Nice");
        when(orderRepository.findByBuyerId(1L)).thenReturn(List.of(order));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        Exception ex = assertThrows(RuntimeException.class, 
            () -> reviewService.addReview(1L, 10L, dto));
        assertEquals("User not found", ex.getMessage());
        
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void addReview_failsIfProductNotFound() {
        // Arrange
        ReviewDto dto = new ReviewDto();
        dto.setRating(4);
        dto.setComment("Nice");
        when(orderRepository.findByBuyerId(1L)).thenReturn(List.of(order));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(productRepository.findById(10L)).thenReturn(Optional.empty());

        // Act & Assert
        Exception ex = assertThrows(RuntimeException.class, 
            () -> reviewService.addReview(1L, 10L, dto));
        assertEquals("Product not found", ex.getMessage());
        
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void listByProduct_returnsReviews() {
        // Arrange
        Review review2 = new Review();
        review2.setId(201L);
        review2.setRating(4);
        review2.setComment("Good");
        review2.setUser(user);
        review2.setProduct(product);
        review2.setCreatedAt(LocalDateTime.now());

        Review otherProductReview = new Review();
        otherProductReview.setId(202L);
        otherProductReview.setRating(3);
        otherProductReview.setComment("Other");
        otherProductReview.setUser(user);
        Product otherProduct = new Product();
        otherProduct.setId(99L);
        otherProductReview.setProduct(otherProduct);
        otherProductReview.setCreatedAt(LocalDateTime.now());

        when(reviewRepository.findAll()).thenReturn(List.of(review, review2, otherProductReview));

        // Act
        List<ReviewDto> result = reviewService.listByProduct(10L);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(r -> r.getProductId().equals(10L)));
        assertTrue(result.stream().allMatch(r -> r.getUserId().equals(1L)));
        assertEquals(2, result.stream().map(ReviewDto::getRating).distinct().count());
    }

    @Test
    void listByProduct_returnsEmptyListWhenNoReviews() {
        // Arrange
        when(reviewRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        List<ReviewDto> result = reviewService.listByProduct(10L);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}
