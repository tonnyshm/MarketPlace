package com.tonnyshema.marketplace.marketplace_api.service;

import com.tonnyshema.marketplace.marketplace_api.model.ApplicationStatus;
import com.tonnyshema.marketplace.marketplace_api.model.Role;
import com.tonnyshema.marketplace.marketplace_api.model.User;
import com.tonnyshema.marketplace.marketplace_api.model.VerificationToken;
import com.tonnyshema.marketplace.marketplace_api.repository.UserRepository;
import com.tonnyshema.marketplace.marketplace_api.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Value("${server.port}")
    private String serverPort;
    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs; // reuse for expiry length or define a new property

    @Autowired
    private VerificationTokenRepository tokenRepo;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Autowired
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    @Transactional
    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.SHOPPER);
        user.setEnabled(false);
        user.setApplicationStatus(ApplicationStatus.NONE);
        User saved = userRepository.save(user);

        // 1) generate & persist token
        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusHours(24);
        VerificationToken vToken = new VerificationToken(token, saved, expiry);
        tokenRepo.save(vToken);

        // 2) send verification email
        String link = "http://localhost:8082/api/auth/verify?token=" + token;
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(saved.getEmail());
        msg.setSubject("Please verify your email");
        msg.setText("Click to verify: " + link);
        mailSender.send(msg);

        return saved;
    }


    private void sendVerificationEmail(User user) {
        String token = UUID.randomUUID().toString();
        // TODO: Persist token and build real verification endpoint
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(user.getEmail());
        msg.setSubject("Please verify your email");
        msg.setText("Click to verify: http://localhost:" + serverPort +
                "/api/auth/verify?token=" + token);

        mailSender.send(msg);
    }

    public List<User> listAll() {
        return userRepository.findAll();
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public void verifyUser(String token) {
        VerificationToken v = tokenRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        if (v.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }
        User user = v.getUser();
        user.setEnabled(true);
        userRepository.save(user);
        tokenRepo.delete(v);
    }


    @Transactional
    public User updateProfile(Long id, User update) {
        User existing = getById(id);
        existing.setName(update.getName());
        // email/password updates can be added here
        return userRepository.save(existing);
    }

    @Transactional
    public User applySeller(Long id) {
        User user = getById(id);
        user.setApplicationStatus(ApplicationStatus.PENDING);
        return userRepository.save(user);
    }

    @Transactional
    public User approveSeller(Long id) {
        User user = getById(id);
        user.setApplicationStatus(ApplicationStatus.APPROVED);
        user.setRole(Role.SELLER);
        user.setEnabled(true);
        // notify user
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(user.getEmail());
        msg.setSubject("Seller Approved");
        msg.setText("Your seller application is approved. You can now create a store.");
        mailSender.send(msg);
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    public User rejectSeller(Long id) {
        User user = getById(id);
        user.setApplicationStatus(ApplicationStatus.REJECTED);
        return userRepository.save(user);
    }

    public List<User> findPendingSellers() {
        return userRepository.findByApplicationStatus(ApplicationStatus.PENDING);
    }
}
