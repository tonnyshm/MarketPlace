package com.tonnyshema.marketplace.marketplace_api.controller;

import com.tonnyshema.marketplace.marketplace_api.dto.ProductDto;
import com.tonnyshema.marketplace.marketplace_api.model.User;
import com.tonnyshema.marketplace.marketplace_api.repository.UserRepository;
import com.tonnyshema.marketplace.marketplace_api.service.CustomUserDetailsService;
import com.tonnyshema.marketplace.marketplace_api.service.SavedProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/saved")
public class SavedProductController {

    @Autowired
    private UserRepository userRepository;
    private final SavedProductService savedProductService;

    public SavedProductController(SavedProductService savedProductService) {
        this.savedProductService = savedProductService;
    }

    @GetMapping
    public List<ProductDto> getSavedProducts(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromUserDetails(userDetails);
        return savedProductService.getSavedProducts(userId)
                .stream()
                .map(ProductDto::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/check/{productId}")
    public Map<String, Boolean> checkIfSaved(
            @PathVariable Long productId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Long userId = getUserIdFromUserDetails(userDetails);
        boolean saved = savedProductService.isProductSaved(userId, productId);
        return Map.of("saved", saved);
    }

    @PostMapping("/{productId}")
    public void saveProduct(
            @PathVariable Long productId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Long userId = getUserIdFromUserDetails(userDetails);
        savedProductService.saveProduct(userId, productId);
    }

    @DeleteMapping("/{productId}")
    public void unsaveProduct(
            @PathVariable Long productId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Long userId = getUserIdFromUserDetails(userDetails);
        savedProductService.unsaveProduct(userId, productId);
    }

    //If you don't want to create a custom class, you can get the email from userDetails.getUsername()
    // and then look up the user in the database
    private Long getUserIdFromUserDetails(UserDetails userDetails) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return user.getId();
    }
}
