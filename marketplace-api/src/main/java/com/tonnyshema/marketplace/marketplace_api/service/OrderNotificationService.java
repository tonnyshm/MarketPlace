package com.tonnyshema.marketplace.marketplace_api.service;
import com.tonnyshema.marketplace.marketplace_api.model.Order;
import com.tonnyshema.marketplace.marketplace_api.repository.OrderRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderNotificationService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private JavaMailSender mailSender;

    @RabbitListener(queues = "orders.status.update.queue")
    @Transactional
    public void handleOrderStatusUpdate(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // The User entity will be loaded within the transaction
        String userEmail = order.getBuyer().getEmail();
        String subject = "Order Status Update";
        String message = String.format("Your order #%d status has been updated to: %s",
                order.getId(), order.getStatus());

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(userEmail);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        mailSender.send(mailMessage);
    }
}
