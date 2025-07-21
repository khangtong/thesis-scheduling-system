package com.example.back_end.dto;

import java.util.List;
import java.util.Map;

public class ExportRequestDTO {
    private List<Map<String, Object>> data;
    private List<String> headers;
    private String title;
    private String filename;

    public ExportRequestDTO() {
    }

    public ExportRequestDTO(List<Map<String, Object>> data, List<String> headers, String title, String filename) {
        this.data = data;
        this.headers = headers;
        this.title = title;
        this.filename = filename;
    }

    public List<Map<String, Object>> getData() {
        return data;
    }

    public void setData(List<Map<String, Object>> data) {
        this.data = data;
    }

    public List<String> getHeaders() {
        return headers;
    }

    public void setHeaders(List<String> headers) {
        this.headers = headers;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }
}
