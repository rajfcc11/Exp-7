package com.scamguard.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "scam_reports")
public class ScamReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userEmail;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column
    private String numberOrLink;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String createdAt;

    public ScamReport() {
    }

    public ScamReport(String userEmail, String content, String numberOrLink, String category, String createdAt) {
        this.userEmail = userEmail;
        this.content = content;
        this.numberOrLink = numberOrLink;
        this.category = category;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getNumberOrLink() {
        return numberOrLink;
    }

    public void setNumberOrLink(String numberOrLink) {
        this.numberOrLink = numberOrLink;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}