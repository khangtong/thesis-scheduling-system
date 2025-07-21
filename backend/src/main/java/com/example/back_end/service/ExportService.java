package com.example.back_end.service;

import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class ExportService {

    public ByteArrayOutputStream exportToPdf(List<Map<String, Object>> data, List<String> headers, String title) throws Exception {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, outputStream);

        document.open();

        // Add title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
        Paragraph titleParagraph = new Paragraph(title != null ? title : "Data Export", titleFont);
        titleParagraph.setAlignment(Element.ALIGN_CENTER);
        titleParagraph.setSpacingAfter(20);
        document.add(titleParagraph);

        // Add export date
        Font dateFont = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.GRAY);
        Paragraph dateParagraph = new Paragraph("Generated on: " +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), dateFont);
        dateParagraph.setAlignment(Element.ALIGN_RIGHT);
        dateParagraph.setSpacingAfter(20);
        document.add(dateParagraph);

        if (data != null && !data.isEmpty() && headers != null && !headers.isEmpty()) {
            // Create table
            PdfPTable table = new PdfPTable(headers.size());
            table.setWidthPercentage(100);

            // Add headers
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.WHITE);
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setBackgroundColor(BaseColor.DARK_GRAY);
                cell.setPadding(8);
                table.addCell(cell);
            }

            // Add data rows
            Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.BLACK);
            for (Map<String, Object> row : data) {
                for (String header : headers) {
                    Object value = row.get(header);
                    PdfPCell cell = new PdfPCell(new Phrase(value != null ? value.toString() : "", cellFont));
                    cell.setPadding(5);
                    table.addCell(cell);
                }
            }

            document.add(table);
        } else {
            document.add(new Paragraph("No data available"));
        }

        document.close();
        return outputStream;
    }

    public ByteArrayOutputStream exportToExcel(List<Map<String, Object>> data, List<String> headers, String title) throws Exception {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet(title != null ? title : "Data Export");
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        // Create title row
        Row titleRow = sheet.createRow(0);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue(title != null ? title : "Data Export");

        CellStyle titleStyle = workbook.createCellStyle();
        org.apache.poi.ss.usermodel.Font titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 16);
        titleStyle.setFont(titleFont);
        titleCell.setCellStyle(titleStyle);

        // Create date row
        Row dateRow = sheet.createRow(1);
        Cell dateCell = dateRow.createCell(0);
        dateCell.setCellValue("Được tạo vào ngày: " +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")));

        int currentRow = 3; // Start data from row 3

        if (headers != null && !headers.isEmpty()) {
            // Create header row
            Row headerRow = sheet.createRow(currentRow++);
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            for (int i = 0; i < headers.size(); i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers.get(i));
                cell.setCellStyle(headerStyle);
            }

            // Add data rows
            if (data != null) {
                for (Map<String, Object> row : data) {
                    Row dataRow = sheet.createRow(currentRow++);
                    for (int i = 0; i < headers.size(); i++) {
                        Cell cell = dataRow.createCell(i);
                        Object value = row.get(headers.get(i));
                        if (value != null) {
                            if (value instanceof Number) {
                                cell.setCellValue(((Number) value).doubleValue());
                            } else {
                                cell.setCellValue(value.toString());
                            }
                        }
                    }
                }
            }

            // Auto-size columns
            for (int i = 0; i < headers.size(); i++) {
                sheet.autoSizeColumn(i);
            }
        }

        workbook.write(outputStream);
        workbook.close();
        return outputStream;
    }
}
