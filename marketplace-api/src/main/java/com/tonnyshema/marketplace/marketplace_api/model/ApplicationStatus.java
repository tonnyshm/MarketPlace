package com.tonnyshema.marketplace.marketplace_api.model;

public enum ApplicationStatus {
    NONE,       // no seller application
    PENDING,    // applied, awaiting admin
    APPROVED,   // admin approved
    REJECTED    // admin rejected
}
