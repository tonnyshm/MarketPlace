//package com.tonnyshema.marketplace.marketplace_api.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.tonnyshema.marketplace.marketplace_api.controller.ReviewController;
//import com.tonnyshema.marketplace.marketplace_api.dto.ReviewDto;
//import com.tonnyshema.marketplace.marketplace_api.service.ReviewService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.util.List;
//
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(ReviewController.class)
//@AutoConfigureMockMvc(addFilters = false)
//
//class ReviewControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private ReviewService reviewService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private ReviewDto inputDto;
//    private ReviewDto returnedDto;
//
//    @BeforeEach
//    void setUp() {
//        inputDto = new ReviewDto();
//        inputDto.setRating(5);
//        inputDto.setComment("Excellent product");
//
//        returnedDto = new ReviewDto();
//        returnedDto.setId(1L);
//        returnedDto.setUserId(2L);
//        returnedDto.setProductId(3L);
//        returnedDto.setRating(5);
//        returnedDto.setComment("Excellent product");
//    }
//
//    @Test
//    void addReview_returnsReviewDto() throws Exception {
//        // Mock service
//        when(reviewService.addReview(eq(2L), eq(3L), any(ReviewDto.class)))
//                .thenReturn(returnedDto);
//
//        mockMvc.perform(post("/api/reviews/{userId}/{productId}", 2L, 3L)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(inputDto)))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
//                .andExpect(jsonPath("$.id").value(1))
//                .andExpect(jsonPath("$.userId").value(2))
//                .andExpect(jsonPath("$.productId").value(3))
//                .andExpect(jsonPath("$.rating").value(5))
//                .andExpect(jsonPath("$.comment").value("Excellent product"));
//
//        // Service invocation verified by Mockito automatically via mocks
//    }
//
//    @Test
//    void listByProduct_returnsListOfReviews() throws Exception {
//        ReviewDto other = new ReviewDto();
//        other.setId(2L);
//        other.setUserId(4L);
//        other.setProductId(3L);
//        other.setRating(3);
//        other.setComment("Good");
//
//        when(reviewService.listByProduct(3L)).thenReturn(List.of(returnedDto, other));
//
//        mockMvc.perform(get("/api/reviews/product/{productId}", 3L))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
//                .andExpect(jsonPath("$.length()").value(2))
//                .andExpect(jsonPath("$[0].id").value(1))
//                .andExpect(jsonPath("$[0].rating").value(5))
//                .andExpect(jsonPath("$[1].id").value(2))
//                .andExpect(jsonPath("$[1].comment").value("Good"));
//    }
//}
//
