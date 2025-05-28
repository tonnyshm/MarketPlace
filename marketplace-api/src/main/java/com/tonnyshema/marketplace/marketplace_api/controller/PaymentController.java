package com.tonnyshema.marketplace.marketplace_api.controller;

import com.tonnyshema.marketplace.marketplace_api.dto.CardPaymentDto;
import com.tonnyshema.marketplace.marketplace_api.dto.MobileMoneyPaymentDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @PostMapping("/card")
    public ResponseEntity<Map<String, Object>> payByCard(@RequestBody CardPaymentDto dto) {
        // simulate success
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "method", "card",
                "transactionId", UUID.randomUUID().toString()
        ));
    }

    @PostMapping("/mobile-money")
    public ResponseEntity<Map<String, Object>> payByMobileMoney(@RequestBody MobileMoneyPaymentDto dto) {
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "method", "mobile-money",
                "transactionId", UUID.randomUUID().toString()
        ));
    }
}

