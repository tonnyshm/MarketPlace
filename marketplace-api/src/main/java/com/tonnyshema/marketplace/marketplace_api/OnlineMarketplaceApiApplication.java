package com.tonnyshema.marketplace.marketplace_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@OpenAPIDefinition(
		info = @Info(
				title       = "Online Marketplace API",
				version     = "1.0.0",       // <— your API’s version
				description = "User, Store, Product, Order & Review endpoints"
		)
)
@EnableConfigurationProperties(MailProperties.class)
public class OnlineMarketplaceApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(OnlineMarketplaceApiApplication.class, args);
	}

}
