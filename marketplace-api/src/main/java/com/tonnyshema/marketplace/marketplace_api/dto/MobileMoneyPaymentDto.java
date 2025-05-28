package com.tonnyshema.marketplace.marketplace_api.dto;


import lombok.Data;
import java.math.BigDecimal;

@Data
public class MobileMoneyPaymentDto {
    private String phoneNumber;
    private String provider; // e.g. “M-Pesa”
    private BigDecimal amount;
}

