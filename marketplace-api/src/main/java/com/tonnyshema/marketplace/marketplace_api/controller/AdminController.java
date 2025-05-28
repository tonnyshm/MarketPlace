package com.tonnyshema.marketplace.marketplace_api.controller;

import com.tonnyshema.marketplace.marketplace_api.dto.CategoryDto;
import com.tonnyshema.marketplace.marketplace_api.dto.OrderDto;
import com.tonnyshema.marketplace.marketplace_api.dto.ProductDto;
import com.tonnyshema.marketplace.marketplace_api.dto.StoreDto;
import com.tonnyshema.marketplace.marketplace_api.model.*;
import com.tonnyshema.marketplace.marketplace_api.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final StoreService storeService;
    private final CategoryService categoryService;
    private final ProductService productService;
    private final OrderService orderService;

    @Autowired
    public AdminController(UserService userService,
                           StoreService storeService,
                           CategoryService categoryService,
                           ProductService productService,
                           OrderService orderService) {
        this.userService = userService;
        this.storeService = storeService;
        this.categoryService = categoryService;
        this.productService = productService;
        this.orderService = orderService;
    }

    // --- User management ---
    @GetMapping("/users")
    public ResponseEntity<List<User>> listUsers() {
        return ResponseEntity.ok(userService.listAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/pending-sellers")
    public ResponseEntity<List<User>> listPendingSellers() {
        return ResponseEntity.ok(userService.findPendingSellers());
    }

    @PostMapping("/users/reject-seller/{id}")
    public ResponseEntity<User> rejectSeller(@PathVariable Long id) {
        return ResponseEntity.ok(userService.rejectSeller(id));
    }

    @PostMapping("/users/approve-seller/{id}")
    public ResponseEntity<User> approveSeller(@PathVariable Long id) {
        return ResponseEntity.ok(userService.approveSeller(id));
    }

    // --- Store management ---
    @GetMapping("/stores")
    public ResponseEntity<List<StoreDto>> listStores() {
        return ResponseEntity.ok(storeService.listAll());
    }

    @DeleteMapping("/stores/{id}")
    public ResponseEntity<?> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.noContent().build();
    }

    // --- Category management ---
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> listCategories() {
        return ResponseEntity.ok(categoryService.listAll());
    }



    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // --- Product management ---
    // List all products (now DTOs)
    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> listProducts() {
        return ResponseEntity.ok(productService.listAll());
    }

    // Mark as featured and return updated DTO
    @PostMapping("/products/{id}/feature")
    public ResponseEntity<ProductDto> featureProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.featureProduct(id));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // --- Order management ---
    /** List all orders (DTOs) **/
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> listAllOrders() {
        return ResponseEntity.ok(orderService.findAllOrders());
    }

    /** Update an order's status **/
    @PostMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(orderService.updateStatus(orderId, status));
    }
}
