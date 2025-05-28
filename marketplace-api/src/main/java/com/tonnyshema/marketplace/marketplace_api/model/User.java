package com.tonnyshema.marketplace.marketplace_api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Email
    @Column(unique = true)
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.SHOPPER;

    /** Has the user clicked their confirmation link? */
    private boolean enabled = false;

    /** For seller‐application workflow */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus  applicationStatus= ApplicationStatus.NONE;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    /** Once approved as seller, each user may own one store */
    @OneToOne(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore            // ← don’t serialize back to Store
    private Store store;

    public User(Long id) {
        this.id = id;
    }

}
