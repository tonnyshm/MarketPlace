package com.tonnyshema.marketplace.marketplace_api.controller;

import com.tonnyshema.marketplace.marketplace_api.model.User;
import com.tonnyshema.marketplace.marketplace_api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get a user's profile by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SHOPPER') or hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<User> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    // Update a user's own profile (name/email/password if you choose)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SHOPPER') or hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<User> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody User userUpdate) {
        return ResponseEntity.ok(userService.updateProfile(id, userUpdate));
    }

    @PostMapping("/{id}/apply-seller")
    @PreAuthorize("hasRole('SHOPPER')")
    public ResponseEntity<User> applySeller(@PathVariable Long id) {
        return ResponseEntity.ok(userService.applySeller(id));
    }
}
