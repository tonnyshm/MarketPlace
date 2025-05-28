//package com.tonnyshema.marketplace.marketplace_api.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.tonnyshema.marketplace.marketplace_api.controller.PaymentController;
//import com.tonnyshema.marketplace.marketplace_api.dto.CardPaymentDto;
//import com.tonnyshema.marketplace.marketplace_api.dto.MobileMoneyPaymentDto;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.math.BigDecimal;
//import java.util.UUID;
//
//import static org.hamcrest.Matchers.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(PaymentController.class)
//@AutoConfigureMockMvc(addFilters = false)
//class PaymentControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private CardPaymentDto cardDto;
//    private MobileMoneyPaymentDto mmDto;
//
//    @BeforeEach
//    void setUp() {
//        cardDto = new CardPaymentDto();
//        cardDto.setCardNumber("4111111111111111");
//        cardDto.setExpiryMonth("12");
//        cardDto.setExpiryYear("2030");
//        cardDto.setCvv("123");
//        cardDto.setAmount(new BigDecimal("99.99"));
//
//        mmDto = new MobileMoneyPaymentDto();
//        mmDto.setPhoneNumber("0788000111");
//        mmDto.setProvider("MTN");
//        mmDto.setAmount(new BigDecimal("49.50"));
//    }
//
//    @Test
//    void payByCard_returnsSuccessPayload() throws Exception {
//        mockMvc.perform(post("/api/payments/card")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(cardDto)))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
//                .andExpect(jsonPath("$.status").value("SUCCESS"))
//                .andExpect(jsonPath("$.method").value("card"))
//                .andExpect(jsonPath("$.transactionId", matchesPattern(
//                        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"
//                )));
//    }
//
//    @Test
//    void payByMobileMoney_returnsSuccessPayload() throws Exception {
//        mockMvc.perform(post("/api/payments/mobile-money")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(mmDto)))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
//                .andExpect(jsonPath("$.status").value("SUCCESS"))
//                .andExpect(jsonPath("$.method").value("mobile-money"))
//                .andExpect(jsonPath("$.transactionId", matchesPattern(
//                        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"
//                )));
//    }
//}
//
