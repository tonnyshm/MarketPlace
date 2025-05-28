package com.tonnyshema.marketplace.marketplace_api.component;

import com.tonnyshema.marketplace.marketplace_api.config.RabbitMQConfig;
import com.tonnyshema.marketplace.marketplace_api.model.Order;
import com.tonnyshema.marketplace.marketplace_api.model.OrderStatus;
import com.tonnyshema.marketplace.marketplace_api.service.OrderService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OrderListener {

    private final OrderService orderService;

    @Autowired
    public OrderListener(OrderService orderService) {
        this.orderService = orderService;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE)
    public void handleNewOrder(Order order) {
        // 1) move to PROCESSING
        orderService.updateStatus(order.getId(), OrderStatus.PROCESSING.name());

        // 2) simulate async work
        try {
            Thread.sleep(2000);
        } catch (InterruptedException ignored) {}

        // 3) mark as COMPLETED
        orderService.updateStatus(order.getId(), OrderStatus.COMPLETED.name());
    }
}
