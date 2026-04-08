package com.scamguard.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "scan_records")
public class ScanRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String input;

    @Column(nullable = false)
    private String riskType;

    @Column(nullable = false)
    private String scamProbability;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String safetyAdvice;

    @Column(nullable = false)
    private String createdAt;

    public ScanRecord() {
    }

    public ScanRecord(String userEmail, String type, String input, String riskType,
                      String scamProbability, String safetyAdvice, String createdAt) {
        this.userEmail = userEmail;
        this.type = type;
        this.input = input;
        this.riskType = riskType;
        this.scamProbability = scamProbability;
        this.safetyAdvice = safetyAdvice;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getRiskType() {
        return riskType;
    }

    public void setRiskType(String riskType) {
        this.riskType = riskType;
    }

    public String getScamProbability() {
        return scamProbability;
    }

    public void setScamProbability(String scamProbability) {
        this.scamProbability = scamProbability;
    }

    public String getSafetyAdvice() {
        return safetyAdvice;
    }

    public void setSafetyAdvice(String safetyAdvice) {
        this.safetyAdvice = safetyAdvice;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}