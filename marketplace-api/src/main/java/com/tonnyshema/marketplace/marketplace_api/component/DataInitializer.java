package com.tonnyshema.marketplace.marketplace_api.component;

import com.tonnyshema.marketplace.marketplace_api.model.ApplicationStatus;
import com.tonnyshema.marketplace.marketplace_api.model.Role;
import com.tonnyshema.marketplace.marketplace_api.model.User;
import com.tonnyshema.marketplace.marketplace_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepo;
    @Autowired private PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (!userRepo.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setName("Administrator");
            admin.setEmail("admin@example.com");
            admin.setPassword(encoder.encode("adminpass"));
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);
            admin.setApplicationStatus(ApplicationStatus.NONE);
            userRepo.save(admin);
        }
    }
}

