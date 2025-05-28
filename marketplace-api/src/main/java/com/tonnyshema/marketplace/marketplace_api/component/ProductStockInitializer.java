//package com.tonnyshema.marketplace.marketplace_api.component;
//import com.tonnyshema.marketplace.marketplace_api.model.Product;
//import com.tonnyshema.marketplace.marketplace_api.repository.ProductRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Transactional;
//
//@Component
//public class ProductStockInitializer implements CommandLineRunner {
//
//    private final ProductRepository productRepository;
//
//    public ProductStockInitializer(ProductRepository productRepository) {
//        this.productRepository = productRepository;
//    }
//
//    @Override
//    @Transactional
//    public void run(String... args) {
//        int defaultStock = 10; // Set your desired default stock value here
//
//        var products = productRepository.findAll();
//        for (Product product : products) {
//            if (product.getStock() == null || product.getStock() == 0) {
//                product.setStock(defaultStock);
//            }
//        }
//        productRepository.saveAll(products);
//        System.out.println("Stock initialized for all products.");
//    }
//}
