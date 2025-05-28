package com.tonnyshema.marketplace.marketplace_api.dto;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CardPaymentDto {
    private String cardNumber;
    private String cardHolder;
    private String expiryMonth;
    private String expiryYear;
    private String cvv;
    private BigDecimal amount;
}

