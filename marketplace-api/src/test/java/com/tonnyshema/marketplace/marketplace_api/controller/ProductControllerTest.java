//package com.tonnyshema.marketplace.marketplace_api.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.tonnyshema.marketplace.marketplace_api.controller.ProductController;
//import com.tonnyshema.marketplace.marketplace_api.dto.ProductDto;
//import com.tonnyshema.marketplace.marketplace_api.service.ProductService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.ArgumentMatchers;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.math.BigDecimal;
//import java.util.List;
//
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.doNothing;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(ProductController.class)
//@AutoConfigureMockMvc(addFilters = false)
//
//class ProductControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private ProductService productService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private ProductDto sample;
//    private ProductDto updated;
//
//    @BeforeEach
//    void setUp() {
//        sample = new ProductDto();
//        sample.setId(1L);
//        sample.setName("Widget");
//        sample.setDescription("A useful widget");
//        sample.setPrice(new BigDecimal("9.99"));
//        sample.setOldPrice(new BigDecimal("19.99"));
//        sample.setFeatured(false);
//        sample.setCategoryId(10L);
//        sample.setStoreId(20L);
//
//        updated = new ProductDto();
//        updated.setId(1L);
//        updated.setName("Widget Pro");
//        updated.setDescription("An even more useful widget");
//        updated.setPrice(new BigDecimal("14.99"));
//        updated.setOldPrice(new BigDecimal("24.99"));
//        updated.setFeatured(true);
//        updated.setCategoryId(11L);
//        updated.setStoreId(21L);
//    }
//
//    @Test
//    void createProduct_returnsCreatedDto() throws Exception {
//        when(productService.createProduct(any(ProductDto.class))).thenReturn(sample);
//
//        mockMvc.perform(post("/api/products")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(sample)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1))
//                .andExpect(jsonPath("$.name").value("Widget"))
//                .andExpect(jsonPath("$.categoryId").value(10))
//                .andExpect(jsonPath("$.storeId").value(20));
//
//        // Verify service was called
//        // (Mockito verifies by default with any())
//    }
//
//    @Test
//    void listAll_returnsList() throws Exception {
//        when(productService.listAll()).thenReturn(List.of(sample));
//
//        mockMvc.perform(get("/api/products"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()").value(1))
//                .andExpect(jsonPath("$[0].name").value("Widget"));
//    }
//
//    @Test
//    void getById_returnsDto() throws Exception {
//        when(productService.getByIdDto(1L)).thenReturn(sample);
//
//        mockMvc.perform(get("/api/products/{id}", 1L))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1))
//                .andExpect(jsonPath("$.description").value("A useful widget"));
//    }
//
//    @Test
//    void listByStore_returnsList() throws Exception {
//        when(productService.listByStore(20L)).thenReturn(List.of(sample));
//
//        mockMvc.perform(get("/api/products/store/{storeId}", 20L))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()").value(1))
//                .andExpect(jsonPath("$[0].storeId").value(20));
//    }
//
//    @Test
//    void listByCategory_returnsList() throws Exception {
//        when(productService.listByCategory(10L)).thenReturn(List.of(sample));
//
//        mockMvc.perform(get("/api/products/category/{categoryId}", 10L))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()").value(1))
//                .andExpect(jsonPath("$[0].categoryId").value(10));
//    }
//
//    @Test
//    void updateProduct_returnsUpdatedDto() throws Exception {
//        when(productService.updateProduct(eq(1L), any(ProductDto.class))).thenReturn(updated);
//
//        mockMvc.perform(put("/api/products/{id}", 1L)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(updated)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.name").value("Widget Pro"))
//                .andExpect(jsonPath("$.featured").value(true))
//                .andExpect(jsonPath("$.categoryId").value(11))
//                .andExpect(jsonPath("$.storeId").value(21));
//    }
//
//    @Test
//    void deleteProduct_returnsNoContent() throws Exception {
//        doNothing().when(productService).deleteProduct(5L);
//
//        mockMvc.perform(delete("/api/products/{id}", 5L))
//                .andExpect(status().isNoContent());
//    }
//
//    @Test
//    void searchProducts_returnsList() throws Exception {
//        when(productService.search("wid")).thenReturn(List.of(sample));
//
//        mockMvc.perform(get("/api/products/search").param("query", "wid"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()").value(1))
//                .andExpect(jsonPath("$[0].name").value("Widget"));
//    }
//}
//
