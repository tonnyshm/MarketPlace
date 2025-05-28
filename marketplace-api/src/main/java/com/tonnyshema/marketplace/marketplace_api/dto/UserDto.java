package com.tonnyshema.marketplace.marketplace_api.dto;

import com.tonnyshema.marketplace.marketplace_api.model.ApplicationStatus;

// DTO for response
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean enabled;
    private String applicationStatus;

    public UserDto(Long id, String name, String email, String role, boolean enabled, String applicationStatus) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.enabled = enabled;
        this.applicationStatus = applicationStatus;
    }

    // Getters and setters (or use Lombok @Data if you prefer)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public String getApplicationStatus() { return applicationStatus; }
    public void setApplicationStatus(String applicationStatus) { this.applicationStatus = applicationStatus; }
}
