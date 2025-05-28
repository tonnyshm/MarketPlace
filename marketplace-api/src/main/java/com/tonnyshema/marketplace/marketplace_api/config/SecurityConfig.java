package com.tonnyshema.marketplace.marketplace_api.config;

import com.tonnyshema.marketplace.marketplace_api.component.JwtAuthenticationFilter;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Map;
import java.util.Properties;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtAuthenticationFilter jwtFilter) throws Exception {
        http
                .cors(Customizer.withDefaults()) // ✅ enables corsConfigurationSource bean
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // 👈 explicitly apply here
                // disable CSRF since we’re stateless
                .csrf(csfr -> csfr.disable())

                // stateless session: no HTTP session
                .sessionManagement(sm -> sm
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // authorization rules
                .authorizeHttpRequests(auth -> auth
                        // public endpoints
                        .requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // admin-only
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // seller+admin
                        .requestMatchers("/api/store/**", "/api/product/**").hasAnyRole("SELLER", "ADMIN","SHOPPER")
                        .requestMatchers("/api/stores/**","/api/categories/**").permitAll()
                        // shopper and above
                        .requestMatchers("/api/order/**", "/api/review/**",
                                "/api/products/**")
                        .hasAnyRole("SHOPPER", "SELLER", "ADMIN")

                        // everything else requires authentication
                        .anyRequest().authenticated()
                )

                // add our JWT filter before the username/password filter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "https://yourdomain.com"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }



    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public JavaMailSender javaMailSender(MailProperties props) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        // Basic host/port/user/password wiring
        sender.setHost(props.getHost());
        sender.setPort(props.getPort());
        sender.setUsername(props.getUsername());
        sender.setPassword(props.getPassword());

        // Convert the Map<String,String> to java.util.Properties
        Properties javaMailProps = new Properties();
        for (Map.Entry<String, String> entry : props.getProperties().entrySet()) {
            javaMailProps.put(entry.getKey(), entry.getValue());
        }
        sender.setJavaMailProperties(javaMailProps);

        return sender;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
