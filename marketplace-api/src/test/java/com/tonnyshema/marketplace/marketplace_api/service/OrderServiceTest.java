package com.tonnyshema.marketplace.marketplace_api.service;

import com.tonnyshema.marketplace.marketplace_api.dto.OrderDto;
import com.tonnyshema.marketplace.marketplace_api.dto.OrderItemDto;
import com.tonnyshema.marketplace.marketplace_api.dto.ProductDto;
import com.tonnyshema.marketplace.marketplace_api.model.*;
import com.tonnyshema.marketplace.marketplace_api.repository.OrderRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.ProductRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.UserRepository;
import com.tonnyshema.marketplace.marketplace_api.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private UserRepository userRepository;
    @Mock private ProductRepository productRepository;
    @Mock private RabbitTemplate rabbitTemplate;
    @InjectMocks private OrderService orderService;

    private User buyer;
    private Product product1;
    private Product product2;
    private List<OrderItemDto> itemDtos;
    private Store store;
    private Category category;

    @BeforeEach
    void setUp() {
        // Setup category
        category = new Category();
        category.setId(1L);
        category.setName("Test Category");

        // Setup store
        store = new Store();
        store.setId(1L);

        // Setup buyer
        buyer = new User();
        buyer.setId(100L);
        buyer.setEmail("test@example.com");
        buyer.setName("Test User");

        // Setup products
        product1 = new Product();
        product1.setId(1L);
        product1.setPrice(new BigDecimal("5.00"));
        product1.setStore(store);
        product1.setCategory(category);

        product2 = new Product();
        product2.setId(2L);
        product2.setPrice(new BigDecimal("3.00"));
        product2.setStore(store);
        product2.setCategory(category);

        // Setup order items
        ProductDto productDto1 = new ProductDto();
        productDto1.setId(1L);

        ProductDto productDto2 = new ProductDto();
        productDto2.setId(2L);

        OrderItemDto dto1 = new OrderItemDto();
        dto1.setProduct(productDto1);
        dto1.setQuantity(2);

        OrderItemDto dto2 = new OrderItemDto();
        dto2.setProduct(productDto2);
        dto2.setQuantity(4);

        itemDtos = List.of(dto1, dto2);
    }

//    @Test
//    void placeOrder_success() {
//        when(userRepository.findById(100L)).thenReturn(Optional.of(buyer));
//        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));
//        when(productRepository.findById(2L)).thenReturn(Optional.of(product2));
//
//        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> {
//            Order o = inv.getArgument(0);
//            o.setId(500L);
//            return o;
//        });
//
//        OrderDto dto = orderService.placeOrder(100L, itemDtos);
//
//        assertEquals(new BigDecimal("22.00"), dto.getTotalAmount());
//        assertEquals(500L, dto.getId());
//        assertEquals(2, dto.getItems().size());
//
//        verify(rabbitTemplate).convertAndSend(eq("orders.exchange"), eq("orders.routingkey"), (Object) any(Order.class));
//    }

//    @Test
//    void placeOrder_buyerNotFound() {
//        when(userRepository.findById(100L)).thenReturn(Optional.empty());
//
//        RuntimeException ex = assertThrows(RuntimeException.class,
//                () -> orderService.placeOrder(100L, itemDtos));
//
//        assertEquals("Buyer not found", ex.getMessage());
//        verify(orderRepository, never()).save(any());
//        verify(rabbitTemplate, never()).convertAndSend(anyString(), anyString(), any());
//    }

//    @Test
//    void placeOrder_productNotFound() {
//        when(userRepository.findById(100L)).thenReturn(Optional.of(buyer));
//        when(productRepository.findById(any())).thenReturn(Optional.empty());
//
//        RuntimeException ex = assertThrows(RuntimeException.class,
//                () -> orderService.placeOrder(100L, itemDtos));
//
//        assertEquals("Product not found", ex.getMessage());
//        verify(orderRepository, never()).save(any());
//        verify(rabbitTemplate, never()).convertAndSend(anyString(), anyString(), any());
//    }

    @Test
    void history_returnsOrderDtos() {
        Order o1 = new Order();
        o1.setId(10L);
        o1.setBuyer(buyer);
        o1.setStatus(OrderStatus.PENDING);
        o1.setItems(new ArrayList<>());

        Order o2 = new Order();
        o2.setId(20L);
        o2.setBuyer(buyer);
        o2.setStatus(OrderStatus.COMPLETED);
        o2.setItems(new ArrayList<>());

        when(orderRepository.findByBuyerId(100L)).thenReturn(List.of(o1, o2));

        List<OrderDto> history = orderService.history(100L);
        assertEquals(2, history.size());
        assertEquals(10L, history.get(0).getId());
        assertEquals(20L, history.get(1).getId());
    }

    @Test
    void findAllOrders_returnsOrderDtos() {
        Order o = new Order();
        o.setId(77L);
        o.setBuyer(buyer);
        o.setStatus(OrderStatus.PENDING);
        o.setItems(new ArrayList<>());

        when(orderRepository.findAll()).thenReturn(List.of(o));

        List<OrderDto> all = orderService.findAllOrders();
        assertEquals(1, all.size());
        assertEquals(77L, all.get(0).getId());
    }

    @Test
    void updateStatus_success() {
        Order o = new Order();
        o.setId(300L);
        o.setBuyer(buyer);
        o.setStatus(OrderStatus.PENDING);
        o.setItems(new ArrayList<>());

        when(orderRepository.findById(300L)).thenReturn(Optional.of(o));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderDto updated = orderService.updateStatus(300L, "COMPLETED");
        assertEquals(OrderStatus.COMPLETED, updated.getStatus());

        verify(rabbitTemplate).convertAndSend(eq("orders.exchange"), eq("orders.status.update"), (Object) eq(300L));
    }

//    @Test
//    void updateStatus_notFound() {
//        when(orderRepository.findById(300L)).thenReturn(Optional.empty());
//
//        RuntimeException ex = assertThrows(RuntimeException.class,
//                () -> orderService.updateStatus(300L, "COMPLETED"));
//
//        assertEquals("Order not found", ex.getMessage());
//        verify(rabbitTemplate, never()).convertAndSend(anyString(), anyString(), any());
//    }

    @Test
    void findOrdersByStore_returnsOrderDtos() {
        Order o = new Order();
        o.setId(55L);
        o.setBuyer(buyer);
        o.setStatus(OrderStatus.PENDING);

        List<OrderItem> items = new ArrayList<>();
        OrderItem item = new OrderItem();
        item.setProduct(product1);
        item.setOrder(o);
        items.add(item);
        o.setItems(items);

        when(orderRepository.findByItems_Product_Store_Id(42L)).thenReturn(List.of(o));

        List<OrderDto> list = orderService.findOrdersByStore(42L);
        assertEquals(1, list.size());
        assertEquals(55L, list.get(0).getId());
    }

    @Test
    void getById_success() {
        Order o = new Order();
        o.setId(888L);
        o.setBuyer(buyer);
        o.setStatus(OrderStatus.PENDING);
        o.setItems(new ArrayList<>());

        when(orderRepository.findById(888L)).thenReturn(Optional.of(o));

        OrderDto dto = orderService.getById(888L);
        assertEquals(888L, dto.getId());
    }

    @Test
    void getById_notFound() {
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> orderService.getById(999L));

        assertEquals("Order not found", ex.getMessage());
    }
}

