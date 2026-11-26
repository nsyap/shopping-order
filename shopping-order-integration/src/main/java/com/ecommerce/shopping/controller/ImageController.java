package com.ecommerce.shopping.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.camel.ProducerTemplate;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = {
    "http://localhost:5500",
    "http://127.0.0.1:5500"           //Live Server
})
public class ImageController {

  private final ProducerTemplate producerTemplate;

  public ImageController(ProducerTemplate producerTemplate) {
    this.producerTemplate = producerTemplate;
  }

//  //TESTING
//  @GetMapping
//  public Object getEmployees() {
//
//    return producerTemplate.requestBody(
//        "direct:getEmployees",
//        "SELECT * FROM employees"
//    );
//  }

  // CREATE - Upload image
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Map<String, Object>> uploadImage(
      @RequestParam("file") MultipartFile file) {

    validateImage(file);

    try {
      Map<String, Object> params = new HashMap<>();
      params.put("fileName", file.getOriginalFilename());
      params.put("contentType", file.getContentType());
      params.put("imageData", file.getBytes());

      Long id = producerTemplate.requestBody(
          "direct:image-create",
          params,
          Long.class
      );

      return ResponseEntity.status(HttpStatus.CREATED)
          .body(Map.of(
              "id", id,
              "message", "Image uploaded successfully"
          ));

    } catch (IOException e) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Unable to read image", e);
    }
  }

  // READ - Retrieve image by ID
  @GetMapping("/{id}")
  public ResponseEntity<byte[]> getImage(@PathVariable Long id) {

    Map<String, Object> params = new HashMap<>();
    params.put("id", id);

    List<Map<String, Object>> rows = producerTemplate.requestBody(
        "direct:image-get",
        params,
        List.class
    );

    if (rows == null || rows.isEmpty()) {
      throw new ResponseStatusException(
          HttpStatus.NOT_FOUND, "Image not found");
    }

    Map<String, Object> image = rows.get(0);

    byte[] imageData = (byte[]) image.get("image_data");
    String contentType = (String) image.get("content_type");
    String fileName = (String) image.get("file_name");

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.parseMediaType(contentType));
    headers.setContentDisposition(
        ContentDisposition.inline()
            .filename(fileName)
            .build()
    );

    return new ResponseEntity<>(
        imageData,
        headers,
        HttpStatus.OK
    );
  }

  // UPDATE - Replace existing image
  @PutMapping(value = "/{id}",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Map<String, Object>> updateImage(
      @PathVariable Long id,
      @RequestParam("file") MultipartFile file) {

    validateImage(file);

    try {
      Map<String, Object> params = new HashMap<>();
      params.put("id", id);
      params.put("fileName", file.getOriginalFilename());
      params.put("contentType", file.getContentType());
      params.put("imageData", file.getBytes());

      Integer updated = producerTemplate.requestBody(
          "direct:image-update",
          params,
          Integer.class
      );

      if (updated == null || updated == 0) {
        throw new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Image not found");
      }

      return ResponseEntity.ok(
          Map.of("message", "Image updated successfully")
      );

    } catch (IOException e) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Unable to read image", e);
    }
  }


  // DELETE - Delete image
  @DeleteMapping("/{id}")
  public ResponseEntity<Map<String, Object>> deleteImage(
      @PathVariable Long id) {

    Map<String, Object> params = new HashMap<>();
    params.put("id", id);

    Integer deleted = producerTemplate.requestBody(
        "direct:image-delete",
        params,
        Integer.class
    );

    if (deleted == null || deleted == 0) {
      throw new ResponseStatusException(
          HttpStatus.NOT_FOUND, "Image not found");
    }

    return ResponseEntity.ok(
        Map.of("message", "Image deleted successfully")
    );
  }


  // Validate uploaded image
  private void validateImage(MultipartFile file) {

    if (file == null || file.isEmpty()) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Please select an image");
    }

    if (file.getContentType() == null
        || !file.getContentType().startsWith("image/")) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Only image files are allowed");
    }

    if (file.getOriginalFilename() == null
        || file.getOriginalFilename().isBlank()) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Invalid file name");
    }
  }

}
