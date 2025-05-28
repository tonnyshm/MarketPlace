package com.tonnyshema.marketplace.marketplace_api.service;

import com.tonnyshema.marketplace.marketplace_api.dto.ProductDto;
import com.tonnyshema.marketplace.marketplace_api.model.Category;
import com.tonnyshema.marketplace.marketplace_api.model.Product;
import com.tonnyshema.marketplace.marketplace_api.model.Store;
import com.tonnyshema.marketplace.marketplace_api.repository.CategoryRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.ProductRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public ProductService(ProductRepository productRepository,
                          StoreRepository storeRepository,
                          CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        // 1) fetch real entities
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Store store = storeRepository.findById(dto.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        // 2) map fields
        Product p = new Product();
        p.setName(dto.getName());
        p.setDescription(dto.getDescription());
        p.setPrice(dto.getPrice());
        p.setOldPrice(dto.getOldPrice());
        p.setFeatured(dto.isFeatured());
        p.setStock(dto.getStock());
        p.setCategory(category);
        p.setStore(store);

        // 3) save & return DTO
        return new ProductDto(productRepository.save(p));
    }

    public List<ProductDto> listAll() {
        return productRepository.findAll().stream()
                .map(ProductDto::new)
                .collect(Collectors.toList());
    }

    public List<ProductDto> listByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(ProductDto::new)
                .collect(Collectors.toList());
    }

    public List<ProductDto> listByStore(Long storeId) {
        return productRepository.findByStoreId(storeId).stream()
                .map(ProductDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setPrice(dto.getPrice());
        existing.setFeatured(dto.isFeatured());
        existing.setStock(dto.getStock());

        // update associations if changed
        if (!existing.getCategory().getId().equals(dto.getCategoryId())) {
            Category cat = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            existing.setCategory(cat);
        }
        if (!existing.getStore().getId().equals(dto.getStoreId())) {
            Store st = storeRepository.findById(dto.getStoreId())
                    .orElseThrow(() -> new RuntimeException("Store not found"));
            existing.setStore(st);
        }

        return new ProductDto(productRepository.save(existing));
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public ProductDto getByIdDto(Long id) {
        return productRepository.findById(id)
                .map(ProductDto::new)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<ProductDto> search(String query) {
        return productRepository
                .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query)
                .stream()
                .map(ProductDto::new)
                .collect(Collectors.toList());
    }

    // in ProductService.java

    @Transactional
    public ProductDto featureProduct(Long id) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        existing.setFeatured(true);
        Product saved = productRepository.save(existing);
        return new ProductDto(saved);
    }

}


