package com.tonnyshema.marketplace.marketplace_api.repository;

import com.tonnyshema.marketplace.marketplace_api.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
}
