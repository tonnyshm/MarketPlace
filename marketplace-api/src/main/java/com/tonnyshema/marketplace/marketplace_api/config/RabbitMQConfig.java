package com.tonnyshema.marketplace.marketplace_api.config;


import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQConfig {
    public static final String EXCHANGE = "orders.exchange";
    public static final String QUEUE = "orders.queue";
    public static final String ROUTING = "orders.routingkey";

    // Add these for status update notifications
    public static final String STATUS_UPDATE_QUEUE = "orders.status.update.queue";
    public static final String STATUS_UPDATE_ROUTING = "orders.status.update";

    @Bean
    public Queue ordersQueue() {
        return new Queue(QUEUE, true);
    }

    @Bean
    public Queue orderStatusUpdateQueue() {
        return new Queue(STATUS_UPDATE_QUEUE, true);
    }

    @Bean
    public DirectExchange ordersExchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean
    public Binding binding(Queue ordersQueue, DirectExchange ordersExchange) {
        return BindingBuilder
                .bind(ordersQueue)
                .to(ordersExchange)
                .with(ROUTING);
    }

    @Bean
    public Binding statusUpdateBinding(Queue orderStatusUpdateQueue, DirectExchange ordersExchange) {
        return BindingBuilder
                .bind(orderStatusUpdateQueue)
                .to(ordersExchange)
                .with(STATUS_UPDATE_ROUTING);
    }

    // Use JSON serialization for messages
    @Bean
    public Jackson2JsonMessageConverter jacksonConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // Make RabbitTemplate use JSON converter
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory cf,
                                         Jackson2JsonMessageConverter conv) {
        RabbitTemplate rt = new RabbitTemplate(cf);
        rt.setMessageConverter(conv);
        return rt;
    }
}

