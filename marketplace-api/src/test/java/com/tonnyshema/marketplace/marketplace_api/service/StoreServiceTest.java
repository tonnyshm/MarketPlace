package com.tonnyshema.marketplace.marketplace_api.service;
import com.tonnyshema.marketplace.marketplace_api.dto.StoreDto;
import com.tonnyshema.marketplace.marketplace_api.model.Store;
import com.tonnyshema.marketplace.marketplace_api.model.User;
import com.tonnyshema.marketplace.marketplace_api.repository.StoreRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.UserRepository;
import com.tonnyshema.marketplace.marketplace_api.service.StoreService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StoreServiceTest {

    @Mock
    private StoreRepository storeRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private StoreService storeService;

    private User user;
    private Store store;
    private StoreDto dto;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("owner@example.com");
        user.setName("Owner");

        store = new Store();
        store.setId(10L);
        store.setName("My Store");
        store.setDescription("Description");
        store.setOwner(user);

        dto = new StoreDto();
        dto.setName("New Store");
        dto.setDescription("New Description");
    }

    @Test
    void createStore_success() {
        // owner exists and has no store
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(storeRepository.save(any(Store.class))).thenAnswer(invocation -> {
            Store s = invocation.getArgument(0);
            s.setId(10L);
            return s;
        });

        StoreDto result = storeService.createStore(1L, dto);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("New Store", result.getName());
        assertEquals("New Description", result.getDescription());
        verify(storeRepository).save(any(Store.class));
    }

    @Test
    void createStore_userNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> storeService.createStore(1L, dto));
        assertEquals("User not found", ex.getMessage());
        verify(storeRepository, never()).save(any());
    }

    @Test
    void createStore_alreadyHasStore() {
        user.setStore(store);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> storeService.createStore(1L, dto));
        assertEquals("Store already exists for user", ex.getMessage());
        verify(storeRepository, never()).save(any());
    }

//    @Test
//    void listAll_returnsDtos() {
//        List<Store> stores = List.of(store);
//        when(storeRepository.findAll()).thenReturn(stores);
//
//        List<StoreDto> result = storeService.listAll();
//
//        assertEquals(1, result.size());
//        assertEquals(store.getId(), result.get(0).getId());
//        verify(storeRepository).findAll();
//    }

    @Test
    void getByIdDto_found() {
        when(storeRepository.findById(10L)).thenReturn(Optional.of(store));

        StoreDto result = storeService.getByIdDto(10L);

        assertNotNull(result);
        assertEquals("My Store", result.getName());
    }

    @Test
    void getByIdDto_notFound() {
        when(storeRepository.findById(10L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> storeService.getByIdDto(10L));
        assertEquals("Store not found", ex.getMessage());
    }

    @Test
    void updateStore_success() {
        StoreDto update = new StoreDto();
        update.setName("Updated");
        update.setDescription("Updated Desc");

        when(storeRepository.findById(10L)).thenReturn(Optional.of(store));
        when(storeRepository.save(store)).thenReturn(store);

        StoreDto result = storeService.updateStore(10L, update);

        assertEquals("Updated", result.getName());
        assertEquals("Updated Desc", result.getDescription());
        verify(storeRepository).save(store);
    }

    @Test
    void updateStore_notFound() {
        when(storeRepository.findById(10L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> storeService.updateStore(10L, dto));
        assertEquals("Store not found", ex.getMessage());
        verify(storeRepository, never()).save(any());
    }

    @Test
    void deleteStore_delegatesToRepo() {
        storeService.deleteStore(10L);
        verify(storeRepository).deleteById(10L);
    }

    @Test
    void getByOwnerId_success() {
        when(storeRepository.findByOwnerId(1L)).thenReturn(Optional.of(store));

        StoreDto result = storeService.getByOwnerId(1L);

        assertEquals(store.getName(), result.getName());
        assertEquals(store.getDescription(), result.getDescription());
    }

    @Test
    void getByOwnerId_notFound() {
        when(storeRepository.findByOwnerId(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> storeService.getByOwnerId(1L));
        assertEquals("Store not found for user", ex.getMessage());
    }
}

