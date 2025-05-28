package com.tonnyshema.marketplace.marketplace_api.service;
import com.tonnyshema.marketplace.marketplace_api.model.Product;
import com.tonnyshema.marketplace.marketplace_api.model.SavedProduct;
import com.tonnyshema.marketplace.marketplace_api.model.User;
import com.tonnyshema.marketplace.marketplace_api.repository.SavedProductRepository;
import com.tonnyshema.marketplace.marketplace_api.service.SavedProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SavedProductServiceTest {

    @Mock
    private SavedProductRepository savedProductRepository;

    @InjectMocks
    private SavedProductService savedProductService;

    private final Long userId = 42L;
    private final Long productId = 99L;

    private SavedProduct sp1;
    private SavedProduct sp2;

    @BeforeEach
    void setUp() {
        Product p1 = new Product(1L);
        Product p2 = new Product(2L);
        sp1 = new SavedProduct();
        sp1.setUser(new User(userId));
        sp1.setProduct(p1);
        sp1.setCreatedAt(LocalDateTime.of(2025,5,1,10,0));
        sp2 = new SavedProduct();
        sp2.setUser(new User(userId));
        sp2.setProduct(p2);
        sp2.setCreatedAt(LocalDateTime.of(2025,5,2,11,0));
    }

    @Test
    void getSavedProducts_mapsToProductList() {
        when(savedProductRepository.findByUserId(userId))
                .thenReturn(List.of(sp1, sp2));

        List<Product> result = savedProductService.getSavedProducts(userId);

        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals(2L, result.get(1).getId());
        verify(savedProductRepository).findByUserId(userId);
    }

    @Test
    void isProductSaved_returnsTrueWhenPresent() {
        when(savedProductRepository.findByUserIdAndProductId(userId, productId))
                .thenReturn(Optional.of(new SavedProduct()));

        assertTrue(savedProductService.isProductSaved(userId, productId));
        verify(savedProductRepository).findByUserIdAndProductId(userId, productId);
    }

    @Test
    void isProductSaved_returnsFalseWhenAbsent() {
        when(savedProductRepository.findByUserIdAndProductId(userId, productId))
                .thenReturn(Optional.empty());

        assertFalse(savedProductService.isProductSaved(userId, productId));
        verify(savedProductRepository).findByUserIdAndProductId(userId, productId);
    }

    @Test
    void saveProduct_constructsAndSavesEntity() {
        ArgumentCaptor<SavedProduct> captor = ArgumentCaptor.forClass(SavedProduct.class);

        savedProductService.saveProduct(userId, productId);

        verify(savedProductRepository).save(captor.capture());
        SavedProduct saved = captor.getValue();

        assertNotNull(saved.getCreatedAt(), "createdAt should be set");
        assertEquals(userId, saved.getUser().getId());
        assertEquals(productId, saved.getProduct().getId());
    }

    @Test
    void unsaveProduct_delegatesToRepository() {
        savedProductService.unsaveProduct(userId, productId);
        verify(savedProductRepository).deleteByUserIdAndProductId(userId, productId);
    }
}

