package com.tonnyshema.marketplace.marketplace_api.repository;

import com.tonnyshema.marketplace.marketplace_api.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StoreRepository extends JpaRepository<Store, Long> {
    Optional<Store> findByOwnerId(Long ownerId);
    @Query("SELECT s FROM Store s LEFT JOIN FETCH s.products p LEFT JOIN FETCH p.category")
    List<Store> findAllWithProductsAndCategories();

    }
