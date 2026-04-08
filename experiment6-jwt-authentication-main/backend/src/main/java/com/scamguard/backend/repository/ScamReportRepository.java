package com.scamguard.backend.repository;

import com.scamguard.backend.model.ScamReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScamReportRepository extends JpaRepository<ScamReport, Long> {
    List<ScamReport> findByUserEmailIgnoreCaseOrderByIdDesc(String userEmail);
}