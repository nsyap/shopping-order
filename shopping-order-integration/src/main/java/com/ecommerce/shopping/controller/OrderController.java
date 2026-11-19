package com.ecommerce.shopping.controller;

import org.apache.camel.ProducerTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
    "http://localhost:5500",
    "http://127.0.0.1:5500"           //Live Server
})
public class OrderController {

  private final ProducerTemplate producerTemplate;

  public OrderController(ProducerTemplate producerTemplate) {
    this.producerTemplate = producerTemplate;
  }

  @PostMapping("/orders")
  public String createOrder(@RequestBody String order) {

    // sends the order from
    // Spring Boot Controller to Apache Camel.
    return producerTemplate.requestBody(
        "direct:order",
        order,
        String.class
    );
  }
}
