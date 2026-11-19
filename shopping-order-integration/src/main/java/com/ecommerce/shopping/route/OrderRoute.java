package com.ecommerce.shopping.route;

import org.apache.camel.builder.RouteBuilder;
import org.springframework.stereotype.Component;

@Component
public class OrderRoute extends RouteBuilder {

  @Override
  public void configure() {

    from("direct:order")
        .log("Received shopping order: ${body}")
        .setBody(simple("Order processed successfully: ${body}"));

  }
}