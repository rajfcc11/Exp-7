package com.scamguard.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scamguard.backend.model.DetectionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class OpenAiDetectionService {

    @Value("${OPENAI_API_KEY:}")
    private String openAiApiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public OpenAiDetectionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    public DetectionResponse analyzeMessage(String message) throws Exception {
        if (openAiApiKey == null || openAiApiKey.isBlank()) {
            throw new IllegalStateException("OPENAI_API_KEY is missing");
        }

        String systemPrompt = """
                You are an anti-scam AI for a mobile safety app.
                Analyze the given message and return ONLY valid JSON with these exact keys:
                riskType, scamProbability, severity, safetyAdvice, recommendedAction, reasons

                Rules:
                - scamProbability must be a string like "92%"
                - severity must be one of: safe, warning, danger
                - reasons must be an array of short strings
                - safetyAdvice should be short and practical
                - recommendedAction should be a direct next step
                - Do not include markdown
                - Do not include extra text outside JSON
                """;

        Map<String, Object> payload = Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", "Analyze this suspicious message: " + message)
                ),
                "temperature", 0.2
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                "https://api.openai.com/v1/chat/completions",
                HttpMethod.POST,
                entity,
                String.class
        );

        JsonNode root = objectMapper.readTree(response.getBody());
        String content = root.path("choices").get(0).path("message").path("content").asText();

        return objectMapper.readValue(content, DetectionResponse.class);
    }
}