//package com.tonnyshema.marketplace.marketplace_api.controller;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.tonnyshema.marketplace.marketplace_api.model.Product;
//import com.tonnyshema.marketplace.marketplace_api.model.User;
//import com.tonnyshema.marketplace.marketplace_api.repository.UserRepository;
//import com.tonnyshema.marketplace.marketplace_api.service.SavedProductService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.beans.factory.annotation.Autowired;
//
//import java.math.BigDecimal;
//import java.util.List;
//
//import static org.hamcrest.Matchers.*;
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(SavedProductController.class)
//class SavedProductControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private SavedProductService savedProductService;
//
//    @MockBean
//    private UserRepository userRepository;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private User user;
//    private Product p1, p2;
//
//    @BeforeEach
//    void setUp() {
//        user = new User();
//        user.setId(7L);
//        user.setEmail("user@example.com");
//
//        p1 = new Product(11L);
//        p1.setName("Prod1");
//        p1.setDescription("Desc1");
//        p1.setPrice(new BigDecimal("5.00"));
//
//        p2 = new Product(22L);
//        p2.setName("Prod2");
//        p2.setDescription("Desc2");
//        p2.setPrice(new BigDecimal("7.50"));
//    }
//
//    @Test
//    @WithMockUser(username = "user@example.com")
//    void getSavedProducts_returnsProductDtoList() throws Exception {
//        when(userRepository.findByEmail("user@example.com")).thenReturn(java.util.Optional.of(user));
//        when(savedProductService.getSavedProducts(7L)).thenReturn(List.of(p1, p2));
//
//        mockMvc.perform(get("/api/saved")
//                        .accept(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()", is(2)))
//                .andExpect(jsonPath("$[0].id", is(11)))
//                .andExpect(jsonPath("$[1].id", is(22)));
//
//        verify(savedProductService).getSavedProducts(7L);
//    }
//
//    @Test
//    @WithMockUser(username = "user@example.com")
//    void checkIfSaved_trueAndFalse() throws Exception {
//        when(userRepository.findByEmail("user@example.com")).thenReturn(java.util.Optional.of(user));
//
//        when(savedProductService.isProductSaved(7L, 11L)).thenReturn(true);
//        mockMvc.perform(get("/api/saved/check/{productId}", 11L))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.saved", is(true)));
//
//        when(savedProductService.isProductSaved(7L, 22L)).thenReturn(false);
//        mockMvc.perform(get("/api/saved/check/{productId}", 22L))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.saved", is(false)));
//
//        verify(savedProductService).isProductSaved(7L, 11L);
//        verify(savedProductService).isProductSaved(7L, 22L);
//    }
//
//    @Test
//    @WithMockUser(username = "user@example.com")
//    void saveAndUnsaveProduct_delegatesToService() throws Exception {
//        when(userRepository.findByEmail("user@example.com")).thenReturn(java.util.Optional.of(user));
//
//        mockMvc.perform(post("/api/saved/{productId}", 33L))
//                .andExpect(status().isOk());
//        verify(savedProductService).saveProduct(7L, 33L);
//
//        mockMvc.perform(delete("/api/saved/{productId}", 44L))
//                .andExpect(status().isOk());
//        verify(savedProductService).unsaveProduct(7L, 44L);
//    }
//
//    @Test
//    @WithMockUser(username = "noone@example.com")
//    void unknownUser_throwsUsernameNotFoundException() throws Exception {
//        when(userRepository.findByEmail("noone@example.com")).thenReturn(java.util.Optional.empty());
//
//        mockMvc.perform(get("/api/saved"))
//                .andExpect(status().isInternalServerError());
//    }
//}
//
