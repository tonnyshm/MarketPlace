package com.tonnyshema.marketplace.marketplace_api.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.security.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.context.annotation.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.Instant;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI openApi() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        )
                )
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }

//    @Bean
//    CommandLineRunner testMail(JavaMailSender mailSender) {
//        return args -> {
//            SimpleMailMessage msg = new SimpleMailMessage();
//            msg.setTo("test@example.com");
//            msg.setSubject("PING");
//            msg.setText("Ping at " + Instant.now());
//            mailSender.send(msg);
//            System.out.println("Test email sent!");
//        };
//    }
//
//    @Bean
//    CommandLineRunner verifyMailBinding(MailProperties props) {
//        return args -> {
//            System.out.println("###################################################################################");
//            System.out.printf("MailProperties: host=%s, port=%d%n",
//                    props.getHost(), props.getPort());
//            System.out.println("###################################################################################");
//        };
//    }


}

