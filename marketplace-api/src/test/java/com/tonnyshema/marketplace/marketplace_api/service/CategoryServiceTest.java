package com.tonnyshema.marketplace.marketplace_api.service;

import com.tonnyshema.marketplace.marketplace_api.dto.CategoryDto;
import com.tonnyshema.marketplace.marketplace_api.model.Category;
import com.tonnyshema.marketplace.marketplace_api.repository.CategoryRepository;
import com.tonnyshema.marketplace.marketplace_api.service.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    private CategoryDto dto;
    private Category entity;

    @BeforeEach
    void setUp() {
        dto = new CategoryDto();
        dto.setName("Electronics");
        dto.setDescription("Electronic gadgets");

        entity = new Category();
        entity.setId(1L);
        entity.setName("Electronics");
        entity.setDescription("Electronic gadgets");
    }

    @Test
    void createCategory_success() {
        // no existing category
        when(categoryRepository.findByName("Electronics")).thenReturn(Optional.empty());
        when(categoryRepository.save(any(Category.class))).thenAnswer(inv -> {
            Category c = inv.getArgument(0);
            c.setId(1L);
            return c;
        });

        CategoryDto result = categoryService.createCategory(dto);

        assertEquals(1L, result.getId());
        assertEquals("Electronics", result.getName());
        assertEquals("Electronic gadgets", result.getDescription());
        verify(categoryRepository).findByName("Electronics");
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void createCategory_alreadyExists_throws() {
        when(categoryRepository.findByName("Electronics")).thenReturn(Optional.of(entity));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> categoryService.createCategory(dto));
        assertEquals("Category already exists", ex.getMessage());
        verify(categoryRepository).findByName("Electronics");
        verify(categoryRepository, never()).save(any());
    }

    @Test
    void listAll_returnsDtoList() {
        Category other = new Category();
        other.setId(2L);
        other.setName("Books");
        other.setDescription("All books");

        when(categoryRepository.findAll()).thenReturn(List.of(entity, other));

        List<CategoryDto> list = categoryService.listAll();

        assertEquals(2, list.size());
        assertEquals(1L, list.get(0).getId());
        assertEquals("Books", list.get(1).getName());
        verify(categoryRepository).findAll();
    }

    @Test
    void getById_found() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(entity));

        CategoryDto result = categoryService.getById(1L);

        assertEquals(1L, result.getId());
        assertEquals("Electronics", result.getName());
        verify(categoryRepository).findById(1L);
    }

    @Test
    void getById_notFound_throws() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> categoryService.getById(1L));
        assertEquals("Category not found", ex.getMessage());
    }

    @Test
    void updateCategory_success() {
        CategoryDto update = new CategoryDto();
        update.setName("Gadgets");
        update.setDescription("All gadgets");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(categoryRepository.save(entity)).thenReturn(entity);

        CategoryDto result = categoryService.updateCategory(1L, update);

        assertEquals("Gadgets", result.getName());
        assertEquals("All gadgets", result.getDescription());
        verify(categoryRepository).findById(1L);
        verify(categoryRepository).save(entity);
    }

    @Test
    void updateCategory_notFound_throws() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        CategoryDto update = new CategoryDto();
        update.setName("X");
        update.setDescription("Y");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> categoryService.updateCategory(1L, update));
        assertEquals("Category not found", ex.getMessage());
        verify(categoryRepository, never()).save(any());
    }

    @Test
    void deleteCategory_delegatesToRepo() {
        doNothing().when(categoryRepository).deleteById(5L);
        categoryService.deleteCategory(5L);
        verify(categoryRepository).deleteById(5L);
    }
}

