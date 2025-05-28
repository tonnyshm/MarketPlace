package com.tonnyshema.marketplace.marketplace_api.service;

import com.tonnyshema.marketplace.marketplace_api.dto.ProductDto;
import com.tonnyshema.marketplace.marketplace_api.model.Category;
import com.tonnyshema.marketplace.marketplace_api.model.Product;
import com.tonnyshema.marketplace.marketplace_api.model.Store;
import com.tonnyshema.marketplace.marketplace_api.repository.CategoryRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.ProductRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.StoreRepository;
import com.tonnyshema.marketplace.marketplace_api.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock private ProductRepository productRepository;
    @Mock private StoreRepository storeRepository;
    @Mock private CategoryRepository categoryRepository;
    @InjectMocks private ProductService productService;

    private Category category;
    private Store store;
    private Product existing;
    private ProductDto dto;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(1L);
        store = new Store();
        store.setId(2L);

        existing = new Product();
        existing.setId(5L);
        existing.setName("Old");
        existing.setDescription("Old desc");
        existing.setPrice(BigDecimal.valueOf(10));
        existing.setOldPrice(BigDecimal.valueOf(15));
        existing.setFeatured(false);
        existing.setCategory(category);
        existing.setStore(store);

        dto = new ProductDto();
        dto.setName("New");
        dto.setDescription("New desc");
        dto.setPrice(BigDecimal.valueOf(20));
        dto.setOldPrice(BigDecimal.valueOf(25));
        dto.setFeatured(true);
        dto.setCategoryId(1L);
        dto.setStoreId(2L);
    }

    @Test
    void createProduct_success() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(storeRepository.findById(2L)).thenReturn(Optional.of(store));
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> {
            Product p = inv.getArgument(0);
            p.setId(100L);
            return p;
        });

        ProductDto result = productService.createProduct(dto);

        assertEquals(100L, result.getId());
        assertEquals("New", result.getName());
        assertTrue(result.isFeatured());
        verify(categoryRepository).findById(1L);
        verify(storeRepository).findById(2L);
        verify(productRepository).save(any());
    }

    @Test
    void createProduct_categoryNotFound() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> productService.createProduct(dto));
        assertEquals("Category not found", ex.getMessage());
        verify(storeRepository, never()).findById(any());
    }

    @Test
    void createProduct_storeNotFound() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(storeRepository.findById(2L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> productService.createProduct(dto));
        assertEquals("Store not found", ex.getMessage());
    }

    @Test
    void listAll_mapsToDtoList() {
        when(productRepository.findAll()).thenReturn(List.of(existing));
        List<ProductDto> list = productService.listAll();
        assertEquals(1, list.size());
        assertEquals(existing.getId(), list.get(0).getId());
    }

    @Test
    void listByCategory_mapsToDtoList() {
        when(productRepository.findByCategoryId(1L)).thenReturn(List.of(existing));
        List<ProductDto> list = productService.listByCategory(1L);
        assertEquals(1, list.size());
        assertEquals("Old", list.get(0).getName());
    }

    @Test
    void listByStore_mapsToDtoList() {
        when(productRepository.findByStoreId(2L)).thenReturn(List.of(existing));
        List<ProductDto> list = productService.listByStore(2L);
        assertEquals(1, list.size());
        assertEquals("Old desc", list.get(0).getDescription());
    }

    @Test
    void updateProduct_success_noAssocChange() {
        ProductDto update = new ProductDto();
        update.setName("Upd");
        update.setDescription("Upd desc");
        update.setPrice(BigDecimal.valueOf(30));
        update.setFeatured(false);
        update.setCategoryId(1L);
        update.setStoreId(2L);

        when(productRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(productRepository.save(existing)).thenReturn(existing);

        ProductDto res = productService.updateProduct(5L, update);

        assertEquals("Upd", res.getName());
        assertFalse(res.isFeatured());
        verify(categoryRepository, never()).findById(any());
        verify(storeRepository, never()).findById(any());
    }

    @Test
    void updateProduct_success_withAssocChange() {
        // change both category and store
        Category newCat = new Category(); newCat.setId(9L);
        Store newStore = new Store(); newStore.setId(8L);
        ProductDto update = new ProductDto();
        update.setName("X");
        update.setDescription("X desc");
        update.setPrice(BigDecimal.valueOf(40));
        update.setFeatured(true);
        update.setCategoryId(9L);
        update.setStoreId(8L);

        when(productRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(categoryRepository.findById(9L)).thenReturn(Optional.of(newCat));
        when(storeRepository.findById(8L)).thenReturn(Optional.of(newStore));
        when(productRepository.save(existing)).thenReturn(existing);

        ProductDto res = productService.updateProduct(5L, update);

        assertEquals(9L, res.getCategoryId());
        assertEquals(8L, res.getStoreId());
        verify(categoryRepository).findById(9L);
        verify(storeRepository).findById(8L);
    }

    @Test
    void updateProduct_notFound() {
        when(productRepository.findById(5L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> productService.updateProduct(5L, dto));
        assertEquals("Product not found", ex.getMessage());
    }

    @Test
    void deleteProduct_delegatesToRepo() {
        productService.deleteProduct(5L);
        verify(productRepository).deleteById(5L);
    }

    @Test
    void getByIdDto_found() {
        when(productRepository.findById(5L)).thenReturn(Optional.of(existing));
        ProductDto res = productService.getByIdDto(5L);
        assertEquals(5L, res.getId());
    }

    @Test
    void getByIdDto_notFound() {
        when(productRepository.findById(5L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> productService.getByIdDto(5L));
        assertEquals("Product not found", ex.getMessage());
    }

    @Test
    void search_mapsToDtoList() {
        when(productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase("q", "q"))
                .thenReturn(List.of(existing));
        List<ProductDto> list = productService.search("q");
        assertEquals(1, list.size());
        assertEquals("Old", list.get(0).getName());
    }

    @Test
    void featureProduct_setsFeaturedTrue() {
        when(productRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(productRepository.save(existing)).thenAnswer(i -> {
            existing.setFeatured(true);
            return existing;
        });

        ProductDto res = productService.featureProduct(5L);

        assertTrue(res.isFeatured());
        verify(productRepository).save(existing);
    }

    @Test
    void featureProduct_notFound() {
        when(productRepository.findById(5L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> productService.featureProduct(5L));
        assertEquals("Product not found", ex.getMessage());
    }
}

