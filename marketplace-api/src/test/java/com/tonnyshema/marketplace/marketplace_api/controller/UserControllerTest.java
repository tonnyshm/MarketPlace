//package com.tonnyshema.marketplace.marketplace_api.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.tonnyshema.marketplace.marketplace_api.controller.UserController;
//import com.tonnyshema.marketplace.marketplace_api.model.User;
//import com.tonnyshema.marketplace.marketplace_api.service.UserService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.web.servlet.MockMvc;
//
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(UserController.class)
//@AutoConfigureMockMvc(addFilters = false)
//
//class UserControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//    @MockBean
//    private UserService userService;
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private User existing;
//    private User updated;
//
//    @BeforeEach
//    void setUp() {
//        existing = new User();
//        existing.setId(1L);
//        existing.setName("Alice");
//        existing.setEmail("alice@example.com");
//
//        updated = new User();
//        updated.setId(1L);
//        updated.setName("Alice Smith");
//        updated.setEmail("alice.smith@example.com");
//    }
//
//    @Test
//    @WithMockUser(roles = {"SHOPPER"})
//    void getProfile_returnsUser() throws Exception {
//        when(userService.getById(1L)).thenReturn(existing);
//
//        mockMvc.perform(get("/api/users/{id}", 1L))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1))
//                .andExpect(jsonPath("$.name").value("Alice"))
//                .andExpect(jsonPath("$.email").value("alice@example.com"));
//    }
//
//    @Test
//    @WithMockUser(roles = {"SELLER"})
//    void updateProfile_returnsUpdatedUser() throws Exception {
//        // The controller accepts a full User JSON; include required fields
//        User request = new User();
//        request.setName("Alice Smith");
//        request.setEmail("alice.smith@example.com");
//        request.setPassword("newpass123");
//
//        when(userService.updateProfile(eq(1L), any(User.class))).thenReturn(updated);
//
//        mockMvc.perform(put("/api/users/{id}", 1L)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1))
//                .andExpect(jsonPath("$.name").value("Alice Smith"))
//                .andExpect(jsonPath("$.email").value("alice.smith@example.com"));
//    }
//
//    @Test
//    @WithMockUser(roles = {"SHOPPER"})
//    void applySeller_returnsUserWithPendingStatus() throws Exception {
//        User pending = new User();
//        pending.setId(1L);
//        pending.setName("Alice");
//        pending.setEmail("alice@example.com");
//        // simulate applicationStatus change; other fields not shown
//        when(userService.applySeller(1L)).thenReturn(pending);
//
//        mockMvc.perform(post("/api/users/{id}/apply-seller", 1L))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(1))
//                .andExpect(jsonPath("$.name").value("Alice"))
//                .andExpect(jsonPath("$.email").value("alice@example.com"));
//    }
//}
//
