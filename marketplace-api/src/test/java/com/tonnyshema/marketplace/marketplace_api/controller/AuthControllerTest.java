package com.tonnyshema.marketplace.marketplace_api.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tonnyshema.marketplace.marketplace_api.config.JwtUtil;
import com.tonnyshema.marketplace.marketplace_api.controller.AuthController;
import com.tonnyshema.marketplace.marketplace_api.dto.UserDto;
import com.tonnyshema.marketplace.marketplace_api.model.ApplicationStatus;
import com.tonnyshema.marketplace.marketplace_api.model.Role;
import com.tonnyshema.marketplace.marketplace_api.model.User;
import com.tonnyshema.marketplace.marketplace_api.repository.UserRepository;
import com.tonnyshema.marketplace.marketplace_api.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock private UserService userService;
    @Mock private AuthenticationManager authManager;
    @Mock private JwtUtil jwtUtil;
    @Mock private UserRepository userRepository;
    @InjectMocks private AuthController controller;

    private ObjectMapper mapper;
    private User user;

    @BeforeEach
    void setUp() {
        mapper = new ObjectMapper();
        user = new User();
        user.setId(5L);
        user.setName("Alice");
        user.setEmail("alice@example.com");
        user.setRole(Role.SHOPPER);
        user.setEnabled(true);
        user.setApplicationStatus(ApplicationStatus.NONE);
    }

    @Test
    void register_returnsSuccessMessage() {
        when(userService.register(any(User.class))).thenReturn(user);

        ResponseEntity<?> resp = controller.register(user);
        assertEquals(200, resp.getStatusCodeValue());
        Map<?,?> body = (Map<?,?>) resp.getBody();
        assertEquals("Registration successful, please verify your email", body.get("message"));
        verify(userService).register(user);
    }

    @Test
    void login_returnsToken() {
        String email = "bob@example.com";
        String password = "pass";
        var creds = Map.of("email", email, "password", password);

        Authentication auth = mock(Authentication.class);
        UserDetails ud = mock(UserDetails.class);
        when(authManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(ud);
        when(ud.getUsername()).thenReturn(email);
        when(jwtUtil.generateToken(email)).thenReturn("jwt-token");

        ResponseEntity<?> resp = controller.login(creds);
        assertEquals(200, resp.getStatusCodeValue());
        Map<?,?> body = (Map<?,?>) resp.getBody();
        assertEquals("jwt-token", body.get("token"));
        assertEquals("Bearer", body.get("type"));

        verify(authManager).authenticate(any());
        verify(jwtUtil).generateToken(email);
    }

    @Test
    void getCurrentUser_returnsUserDto() {
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn(user.getEmail());
        SecurityContextHolder.getContext().setAuthentication(auth);
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        UserDto dto = controller.getCurrentUser();
        assertEquals(user.getId(), dto.getId());
        assertEquals(user.getName(), dto.getName());
        assertEquals(user.getEmail(), dto.getEmail());
        assertEquals(user.getRole().name(), dto.getRole());
        assertEquals(user.isEnabled(), dto.isEnabled());
        assertEquals(user.getApplicationStatus().name(), dto.getApplicationStatus());
    }

    @Test
    void getCurrentUser_userNotFound_throws() {
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("noone@example.com");
        SecurityContextHolder.getContext().setAuthentication(auth);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> controller.getCurrentUser());
        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void verify_returnsSuccessMessage() {
        doNothing().when(userService).verifyUser("tok");
        ResponseEntity<?> resp = controller.verify("tok");
        assertEquals(200, resp.getStatusCodeValue());
        Map<?,?> body = (Map<?,?>) resp.getBody();
        assertEquals("Email verified! You can now log in.", body.get("message"));
        verify(userService).verifyUser("tok");
    }
}

