package com.tonnyshema.marketplace.marketplace_api.controller;

import com.tonnyshema.marketplace.marketplace_api.dto.ProductDto;
import com.tonnyshema.marketplace.marketplace_api.model.Product;
import com.tonnyshema.marketplace.marketplace_api.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /** Create a new product **/
    @PostMapping
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<ProductDto> createProduct(
            @Valid @RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.createProduct(dto));
    }

    /** List all products **/
    @GetMapping
    public ResponseEntity<List<ProductDto>> listAll() {
        return ResponseEntity.ok(productService.listAll());
    }

    /** Get a single product by ID **/
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getByIdDto(id));
    }

    /** List products in a given store **/
    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ProductDto>> listByStore(@PathVariable Long storeId) {
        return ResponseEntity.ok(productService.listByStore(storeId));
    }

    /** List products in a given category **/
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductDto>> listByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.listByCategory(categoryId));
    }

    /** Update an existing product **/
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    /** Delete a product **/
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /** Search for products by name or description **/
    @GetMapping("/search")
    public ResponseEntity<List<ProductDto>> searchProducts(@RequestParam String query) {
        return ResponseEntity.ok(productService.search(query));
    }
}
