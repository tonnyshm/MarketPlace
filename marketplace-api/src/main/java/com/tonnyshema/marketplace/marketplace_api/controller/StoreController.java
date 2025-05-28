package com.tonnyshema.marketplace.marketplace_api.controller;

import com.tonnyshema.marketplace.marketplace_api.dto.OrderDto;
import com.tonnyshema.marketplace.marketplace_api.dto.StoreDto;
import com.tonnyshema.marketplace.marketplace_api.model.Order;
import com.tonnyshema.marketplace.marketplace_api.model.Store;
import com.tonnyshema.marketplace.marketplace_api.service.OrderService;
import com.tonnyshema.marketplace.marketplace_api.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    private final StoreService storeService;
    private final OrderService orderService;

    @Autowired
    public StoreController(StoreService storeService,
                           OrderService orderService) {
        this.storeService = storeService;
        this.orderService = orderService;
    }

    @PostMapping("/{userId}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<StoreDto> createStore(
            @PathVariable Long userId,
            @Valid @RequestBody StoreDto dto) {
        return ResponseEntity.ok(storeService.createStore(userId, dto));
    }

    @GetMapping
    public ResponseEntity<List<StoreDto>> listStores() {
        return ResponseEntity.ok(storeService.listAll());
    }



    @GetMapping("/{id}")
    public ResponseEntity<StoreDto> getStore(@PathVariable Long id) {
        return ResponseEntity.ok(storeService.getByIdDto(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<StoreDto> updateStore(
            @PathVariable Long id,
            @Valid @RequestBody StoreDto dto) {
        return ResponseEntity.ok(storeService.updateStore(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/owner/{userId}")
    public ResponseEntity<StoreDto> getStoreByOwner(@PathVariable Long userId) {
        return ResponseEntity.ok(storeService.getByOwnerId(userId));
    }

    @GetMapping("/{storeId}/orders")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getOrdersForStore(
            @PathVariable Long storeId) {
        return ResponseEntity.ok(orderService.findOrdersByStore(storeId));
    }

    @GetMapping("/top")
    public ResponseEntity<List<StoreDto>> getTopStores() {
        return ResponseEntity.ok(storeService.findTopStores());
    }

}



