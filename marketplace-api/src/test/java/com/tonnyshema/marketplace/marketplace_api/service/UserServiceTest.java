package com.tonnyshema.marketplace.marketplace_api.service;
import com.tonnyshema.marketplace.marketplace_api.model.*;
import com.tonnyshema.marketplace.marketplace_api.repository.UserRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.VerificationTokenRepository;
import com.tonnyshema.marketplace.marketplace_api.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private VerificationTokenRepository tokenRepo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JavaMailSender mailSender;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

//    @Test
//    void register_successfulRegistration_sendsEmailAndSavesToken() {
//        User user = new User();
//        user.setEmail("test@example.com");
//        user.setPassword("plainpass");
//        user.setName("John Doe");
//
//        when(userRepository.existsByEmail(user.getEmail())).thenReturn(false);
//        when(passwordEncoder.encode("plainpass")).thenReturn("hashedpass");
//        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
//            User u = invocation.getArgument(0);
//            u.setId(1L);
//            return u;
//        });
//
//        User result = userService.register(user);
//
//        assertEquals("hashedpass", result.getPassword());
//        assertEquals(Role.SHOPPER, result.getRole());
//        assertFalse(result.isEnabled());
//        assertEquals(ApplicationStatus.NONE, result.getApplicationStatus());
//
//        verify(userRepository).save(any(User.class));
//        verify(tokenRepo).save(any(VerificationToken.class));
//        verify(mailSender).send(any(SimpleMailMessage.class));
//    }

    @Test
    void register_existingEmail_throwsException() {
        User user = new User();
        user.setEmail("test@example.com");

        when(userRepository.existsByEmail(user.getEmail())).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.register(user));
        assertEquals("Email already in use", ex.getMessage());
    }

    @Test
    void getById_found_returnsUser() {
        User user = new User();
        user.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User result = userService.getById(1L);
        assertEquals(1L, result.getId());
    }

    @Test
    void getById_notFound_throwsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.getById(1L));
        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void applySeller_setsStatusToPending() {
        User user = new User();
        user.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.applySeller(1L);

        assertEquals(ApplicationStatus.PENDING, result.getApplicationStatus());
        verify(userRepository).save(user);
    }

    @Test
    void deleteUser_whenUserExists_deletesUser() {
        when(userRepository.existsById(1L)).thenReturn(true);

        userService.deleteUser(1L);

        verify(userRepository).deleteById(1L);
    }

    @Test
    void deleteUser_whenUserDoesNotExist_throwsException() {
        when(userRepository.existsById(1L)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.deleteUser(1L));
        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void findPendingSellers_returnsList() {
        List<User> mockUsers = List.of(new User(1L), new User(2L));
        when(userRepository.findByApplicationStatus(ApplicationStatus.PENDING)).thenReturn(mockUsers);

        List<User> result = userService.findPendingSellers();
        assertEquals(2, result.size());
    }
}


