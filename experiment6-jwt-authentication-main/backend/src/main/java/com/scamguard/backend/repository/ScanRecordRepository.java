package com.scamguard.backend.repository;

import com.scamguard.backend.model.ScanRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScanRecordRepository extends JpaRepository<ScanRecord, Long> {
    List<ScanRecord> findByUserEmailIgnoreCaseOrderByIdDesc(String userEmail);
    List<ScanRecord> findByUserEmailIgnoreCase(String userEmail);
}