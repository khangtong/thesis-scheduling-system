package com.example.back_end.rest;


import com.example.back_end.dto.ExportRequestDTO;
import com.example.back_end.service.ExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "http://localhost:3000")
public class ExportController {

    @Autowired
    private ExportService exportService;

    @PostMapping("/pdf")
    public ResponseEntity<byte[]> exportToPdf(@RequestBody ExportRequestDTO request) {
        try {
            ByteArrayOutputStream outputStream = exportService.exportToPdf(request.getData(), request.getHeaders(), request.getTitle());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", request.getFilename() + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/excel")
    public ResponseEntity<byte[]> exportToExcel(@RequestBody ExportRequestDTO request) {
        try {
            ByteArrayOutputStream outputStream = exportService.exportToExcel(request.getData(), request.getHeaders(), request.getTitle());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", request.getFilename() + ".xlsx");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
