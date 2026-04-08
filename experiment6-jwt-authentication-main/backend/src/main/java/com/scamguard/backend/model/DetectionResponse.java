package com.scamguard.backend.model;

import java.util.List;

public class DetectionResponse {

    private String riskType;
    private String scamProbability;
    private String severity;
    private String safetyAdvice;
    private String recommendedAction;
    private List<String> reasons;

    public DetectionResponse() {
    }

    public DetectionResponse(String riskType, String scamProbability, String severity,
                             String safetyAdvice, String recommendedAction, List<String> reasons) {
        this.riskType = riskType;
        this.scamProbability = scamProbability;
        this.severity = severity;
        this.safetyAdvice = safetyAdvice;
        this.recommendedAction = recommendedAction;
        this.reasons = reasons;
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

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getSafetyAdvice() {
        return safetyAdvice;
    }

    public void setSafetyAdvice(String safetyAdvice) {
        this.safetyAdvice = safetyAdvice;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }
}