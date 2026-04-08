package com.scamguard.backend.controller;

import com.scamguard.backend.model.ScanRecord;
import com.scamguard.backend.model.ScamReport;
import com.scamguard.backend.repository.ScanRecordRepository;
import com.scamguard.backend.repository.ScamReportRepository;
import jakarta.transaction.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserDataController {

    private final ScanRecordRepository scanRecordRepository;
    private final ScamReportRepository scamReportRepository;

    public UserDataController(ScanRecordRepository scanRecordRepository,
                              ScamReportRepository scamReportRepository) {
        this.scanRecordRepository = scanRecordRepository;
        this.scamReportRepository = scamReportRepository;
    }

    @PostMapping("/save-scan")
    public ScanRecord saveScan(@RequestBody ScanRecord scanRecord) {
        if (scanRecord.getCreatedAt() == null || scanRecord.getCreatedAt().isEmpty()) {
            scanRecord.setCreatedAt(LocalDateTime.now().toString());
        }
        return scanRecordRepository.save(scanRecord);
    }

    @GetMapping("/history")
    public List<ScanRecord> getHistory(@RequestParam String email) {
        return scanRecordRepository.findByUserEmailIgnoreCaseOrderByIdDesc(email);
    }

    @Transactional
    @DeleteMapping("/history")
    public Map<String, Object> clearHistory(@RequestParam String email) {
        List<ScanRecord> records = scanRecordRepository.findByUserEmailIgnoreCase(email);
        int deletedCount = records.size();

        if (!records.isEmpty()) {
            scanRecordRepository.deleteAll(records);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "History cleared successfully");
        response.put("deletedCount", deletedCount);
        response.put("email", email);
        return response;
    }

    @PostMapping("/report-scam")
    public ScamReport reportScam(@RequestBody ScamReport scamReport) {
        if (scamReport.getCreatedAt() == null || scamReport.getCreatedAt().isEmpty()) {
            scamReport.setCreatedAt(LocalDateTime.now().toString());
        }
        return scamReportRepository.save(scamReport);
    }

    @GetMapping("/reports")
    public List<ScamReport> getReports(@RequestParam String email) {
        return scamReportRepository.findByUserEmailIgnoreCaseOrderByIdDesc(email);
    }
}