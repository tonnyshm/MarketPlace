//package com.tonnyshema.marketplace.marketplace_api.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.tonnyshema.marketplace.marketplace_api.component.JwtAuthenticationFilter;
//import com.tonnyshema.marketplace.marketplace_api.config.JwtUtil;
//import com.tonnyshema.marketplace.marketplace_api.controller.CategoryController;
//import com.tonnyshema.marketplace.marketplace_api.dto.CategoryDto;
//import com.tonnyshema.marketplace.marketplace_api.service.CategoryService;
//import com.tonnyshema.marketplace.marketplace_api.service.CustomUserDetailsService;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mockito;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.http.MediaType;
//
//import java.util.Arrays;
//import java.util.List;
//
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(CategoryController.class)
//public class CategoryControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private CategoryService categoryService;
//
//    // ✅ These are required to prevent Spring Boot context errors
//    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;
//    @MockBean private JwtUtil jwtUtil;
//    @MockBean private CustomUserDetailsService customUserDetailsService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Test
//    @DisplayName("GET /api/category - should return category list")
//    public void getCategories_shouldReturnList() throws Exception {
//        // given
//        CategoryDto cat1 = new CategoryDto();
//        cat1.setId(1L);
//        cat1.setName("Electronics");
//        cat1.setDescription("Gadgets and devices");
//
//        CategoryDto cat2 = new CategoryDto();
//        cat2.setId(2L);
//        cat2.setName("Books");
//        cat2.setDescription("Fiction and Non-fiction");
//
//        List<CategoryDto> mockList = Arrays.asList(cat1, cat2);
//        when(categoryService.listAll()).thenReturn(mockList);
//
//        // when + then
//        mockMvc.perform(get("/api/category")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.size()").value(2))
//                .andExpect(jsonPath("$[0].name").value("Electronics"))
//                .andExpect(jsonPath("$[1].name").value("Books"));
//    }
//}
