//package com.tonnyshema.marketplace.marketplace_api.controller;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.tonnyshema.marketplace.marketplace_api.controller.OrderController;
//import com.tonnyshema.marketplace.marketplace_api.dto.OrderDto;
//import com.tonnyshema.marketplace.marketplace_api.dto.OrderItemDto;
//import com.tonnyshema.marketplace.marketplace_api.dto.ProductDto;
//import com.tonnyshema.marketplace.marketplace_api.model.OrderStatus;
//import com.tonnyshema.marketplace.marketplace_api.service.OrderService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mockito;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.math.BigDecimal;
//import java.util.List;
//import java.util.Map;
//
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(OrderController.class)
//// disable security for controller tests
//@AutoConfigureMockMvc(addFilters = false)
//public class OrderControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private OrderService orderService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private List<OrderItemDto> items;
//    private OrderDto sampleOrder;
//    private OrderDto historyOrder;
//
//    @BeforeEach
//    void setUp() {
//        OrderItemDto item1 = new OrderItemDto();
//        item1.setProduct(new ProductDto());
//        item1.setQuantity(2);
//        OrderItemDto item2 = new OrderItemDto();
//        item2.setProduct(new ProductDto());
//        item2.setQuantity(3);
//        items = List.of(item1, item2);
//
//        sampleOrder = new OrderDto();
//        sampleOrder.setId(100L);
//        sampleOrder.setStatus(OrderStatus.PENDING);
//        sampleOrder.setTotalAmount(new BigDecimal("50.00"));
//        sampleOrder.setItems(List.of(item1, item2));
//
//        historyOrder = new OrderDto();
//        historyOrder.setId(200L);
//        historyOrder.setStatus(OrderStatus.COMPLETED);
//        historyOrder.setTotalAmount(new BigDecimal("30.00"));
//        historyOrder.setItems(List.of(item1));
//    }
//
//    @Test
//    void placeOrder_returnsOrderDto() throws Exception {
//        when(orderService.placeOrder(eq(5L), anyList())).thenReturn(sampleOrder);
//
//        mockMvc.perform(post("/api/orders/{buyerId}", 5L)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(items)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.id").value(100))
//                .andExpect(jsonPath("$.status").value("PENDING"))
//                .andExpect(jsonPath("$.totalAmount").value(50.00))
//                .andExpect(jsonPath("$.items.length()").value(2));
//
//        verify(orderService).placeOrder(eq(5L), anyList());
//    }
//
//    @Test
//    void orderHistory_returnsListOfOrderDto() throws Exception {
//        when(orderService.history(7L)).thenReturn(List.of(historyOrder));
//
//        mockMvc.perform(get("/api/orders/history/{buyerId}", 7L))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()").value(1))
//                .andExpect(jsonPath("$[0].id").value(200))
//                .andExpect(jsonPath("$[0].status").value("SHIPPED"));
//
//        verify(orderService).history(7L);
//    }
//
//    @Test
//    void getOrderStatus_returnsStatusMap() throws Exception {
//        when(orderService.getById(15L)).thenReturn(sampleOrder);
//
//        mockMvc.perform(get("/api/orders/{orderId}/status", 15L))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.status").value("PENDING"));
//
//        verify(orderService).getById(15L);
//    }
//}
//
