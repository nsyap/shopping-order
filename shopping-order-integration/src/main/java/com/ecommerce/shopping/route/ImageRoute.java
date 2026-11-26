package com.ecommerce.shopping.route;

import org.apache.camel.builder.RouteBuilder;
import org.springframework.stereotype.Component;

@Component
public class ImageRoute extends RouteBuilder {

  @Override
  public void configure() {

//    //TESTING
//    from("direct:getEmployees")
//        .to("jdbc:dataSource")
//        .log("Image records: ${body}");

    // CREATE IMAGE
    from("direct:image-create")
        .routeId("create-image")
        .to("sql:INSERT INTO image_file "
            + "(file_name, content_type, image_data) "
            + "VALUES (:#fileName, :#contentType, :#imageData) "
            + "RETURNING id"
            + "?dataSource=#dataSource&outputType=SelectOne");

    // READ IMAGE
    from("direct:image-get")
        .routeId("get-image")
        .to("sql:SELECT id, file_name, content_type, "
            + "image_data, created_at "
            + "FROM image_file WHERE id = :#id"
            + "?dataSource=#dataSource");

    // UPDATE IMAGE
    from("direct:image-update")
        .routeId("update-image")
        .to("sql:UPDATE image_file SET "
            + "file_name = :#fileName, "
            + "content_type = :#contentType, "
            + "image_data = :#imageData "
            + "WHERE id = :#id"
            + "?dataSource=#dataSource")
        .setBody(header("CamelSqlUpdateCount"));

    // DELETE IMAGE
    from("direct:image-delete")
        .routeId("delete-image")
        .to("sql:DELETE FROM image_file WHERE id = :#id"
            + "?dataSource=#dataSource")
        .setBody(header("CamelSqlUpdateCount"));

  }
}