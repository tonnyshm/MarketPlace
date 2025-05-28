package com.tonnyshema.marketplace.marketplace_api.service;

import com.tonnyshema.marketplace.marketplace_api.dto.StoreDto;
import com.tonnyshema.marketplace.marketplace_api.model.Store;
import com.tonnyshema.marketplace.marketplace_api.model.User;
import com.tonnyshema.marketplace.marketplace_api.repository.StoreRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StoreService {
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;

    @Autowired
    public StoreService(StoreRepository storeRepository,
                        UserRepository userRepository) {
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public StoreDto createStore(Long userId, StoreDto dto) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (owner.getStore() != null) {
            throw new RuntimeException("Store already exists for user");
        }

        Store s = new Store();
        s.setName(dto.getName());
        s.setDescription(dto.getDescription());
        s.setOwner(owner);

        return new StoreDto(storeRepository.save(s));
    }


    public List<StoreDto> listAll() {
        List<Store> stores = storeRepository.findAllWithProductsAndCategories();
        return stores.stream().map(StoreDto::new).collect(Collectors.toList());
    }
    public StoreDto getByIdDto(Long id) {
        return storeRepository.findById(id)
                .map(StoreDto::new)
                .orElseThrow(() -> new RuntimeException("Store not found"));
    }

    @Transactional
    public StoreDto updateStore(Long id, StoreDto dto) {
        Store existing = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        // owner never changes here
        Store saved = storeRepository.save(existing);
        return new StoreDto(saved);
    }

    @Transactional
    public void deleteStore(Long id) {
        storeRepository.deleteById(id);
    }

    public StoreDto getByOwnerId(Long ownerId) {
        Store store = storeRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new RuntimeException("Store not found for user"));
        return StoreDto.fromEntity(store); // Adjust if you use a mapper
    }

    public List<StoreDto> findTopStores() {
        return storeRepository.findAll().stream()
                .sorted((a, b) -> Integer.compare(b.getProducts().size(), a.getProducts().size()))
                .limit(10)
                .map(StoreDto::new)
                .collect(Collectors.toList());
    }

}

