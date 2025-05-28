//package com.tonnyshema.marketplace.marketplace_api.errorHandler;
//
//
//import java.util.Map;
//import java.util.stream.Collectors;
//import javax.validation.ConstraintViolation;
//import org.springframework.http.HttpStatus;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.ResponseStatus;
//import org.springframework.web.method.annotation.HandlerMethodValidationException;
//
//@ControllerAdvice
//public class ValidationErrorHandler {
//
//    @ExceptionHandler(HandlerMethodValidationException.class)
//    @ResponseStatus(HttpStatus.BAD_REQUEST)
//    public Map<String, String> onValidationException(HandlerMethodValidationException ex) {
//        return ex.getConstraintViolations()
//                .stream()
//                .collect(Collectors.toMap(
//                        cv -> cv.getPropertyPath().toString(),
//                        ConstraintViolation::getMessage
//                ));
//    }
//}
//
//
