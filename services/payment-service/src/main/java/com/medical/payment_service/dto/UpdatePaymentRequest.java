package com.medical.payment_service.dto;

import com.medical.payment_service.entity.PaymentMethod;
import com.medical.payment_service.entity.PaymentStatus;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePaymentRequest {

    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
    private BigDecimal amount;

    private PaymentMethod paymentMethod;

}