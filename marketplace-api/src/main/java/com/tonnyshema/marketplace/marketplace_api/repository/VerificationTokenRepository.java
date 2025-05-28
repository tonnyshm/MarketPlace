package com.tonnyshema.marketplace.marketplace_api.repository;

import com.tonnyshema.marketplace.marketplace_api.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VerificationTokenRepository
        extends JpaRepository<VerificationToken,Long> {
    Optional<VerificationToken> findByToken(String token);
}