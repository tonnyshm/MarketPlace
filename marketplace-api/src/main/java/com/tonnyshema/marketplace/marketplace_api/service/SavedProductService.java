package com.tonnyshema.marketplace.marketplace_api.service;

import com.tonnyshema.marketplace.marketplace_api.model.Product;
import com.tonnyshema.marketplace.marketplace_api.model.SavedProduct;
import com.tonnyshema.marketplace.marketplace_api.model.User;
import com.tonnyshema.marketplace.marketplace_api.repository.SavedProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SavedProductService {
    private final SavedProductRepository savedProductRepository;

    public SavedProductService(SavedProductRepository savedProductRepository) {
        this.savedProductRepository = savedProductRepository;
    }

    public List<Product> getSavedProducts(Long userId) {
        return savedProductRepository.findByUserId(userId)
                .stream()
                .map(SavedProduct::getProduct)
                .collect(Collectors.toList());
    }

    public boolean isProductSaved(Long userId, Long productId) {
        return savedProductRepository.findByUserIdAndProductId(userId, productId).isPresent();
    }

    public void saveProduct(Long userId, Long productId) {
        SavedProduct savedProduct = new SavedProduct();
        savedProduct.setUser(new User(userId));
        savedProduct.setProduct(new Product(productId));
        savedProduct.setCreatedAt(LocalDateTime.now());
        savedProductRepository.save(savedProduct);
    }

    public void unsaveProduct(Long userId, Long productId) {
        savedProductRepository.deleteByUserIdAndProductId(userId, productId);
    }
}
