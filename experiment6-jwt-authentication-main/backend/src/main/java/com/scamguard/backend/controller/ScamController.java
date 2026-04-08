package com.scamguard.backend.controller;

import com.scamguard.backend.model.DetectionResponse;
import com.scamguard.backend.service.OpenAiDetectionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ScamController {

    private final OpenAiDetectionService openAiDetectionService;

    public ScamController(OpenAiDetectionService openAiDetectionService) {
        this.openAiDetectionService = openAiDetectionService;
    }

    @PostMapping("/detect-scam")
    public DetectionResponse detectScam(@RequestBody Map<String, String> request) {
        String message = request.get("message");

        if (message == null || message.trim().isEmpty()) {
            return new DetectionResponse(
                    "Unknown",
                    "0%",
                    "safe",
                    "Please provide a message to analyze.",
                    "Paste a suspicious message and try again.",
                    List.of("No message content was provided")
            );
        }

        try {
            return openAiDetectionService.analyzeMessage(message);
        } catch (Exception e) {
            return fallbackDetection(message);
        }
    }

    private DetectionResponse fallbackDetection(String message) {
        String text = message.toLowerCase();

        if (text.contains("lottery") || text.contains("won") || text.contains("prize") || text.contains("claim now")) {
            return new DetectionResponse(
                    "Lottery / Reward Scam",
                    "95%",
                    "danger",
                    "Do not click any links or share personal details. This looks like a reward bait scam.",
                    "Ignore the message, block the sender, and never pay or share details to claim rewards.",
                    List.of(
                            "Promises prize or reward",
                            "Uses reward bait language",
                            "Encourages quick claim action"
                    )
            );
        } else if (text.contains("otp") || text.contains("bank") || text.contains("account blocked") || text.contains("verify account")) {
            return new DetectionResponse(
                    "Bank / OTP Scam",
                    "92%",
                    "danger",
                    "Never share OTP, PIN, or banking details. Contact your bank directly using the official app or website.",
                    "Do not click the link. Verify only through your bank’s official app or support.",
                    List.of(
                            "Contains banking language",
                            "Asks for verification or OTP",
                            "Uses urgency or account threat"
                    )
            );
        } else if (text.contains("job") || text.contains("registration fee") || text.contains("earn money")) {
            return new DetectionResponse(
                    "Fake Job Scam",
                    "88%",
                    "warning",
                    "Avoid paying fees for jobs. Verify the employer and offer before taking action.",
                    "Do not pay any registration amount. Research the recruiter and company independently.",
                    List.of(
                            "Mentions job or quick earning",
                            "Asks for fee or payment",
                            "Matches common fake job scam pattern"
                    )
            );
        } else if (text.contains("click") || text.contains("link") || text.contains("urgent")) {
            return new DetectionResponse(
                    "Phishing / Suspicious Message",
                    "80%",
                    "warning",
                    "Avoid opening links in urgent or suspicious messages. Verify the sender first.",
                    "Do not open unknown links. Confirm authenticity from an official source.",
                    List.of(
                            "Contains suspicious link language",
                            "Uses urgency wording",
                            "Encourages immediate action"
                    )
            );
        } else {
            return new DetectionResponse(
                    "Low Risk / No Strong Scam Signal",
                    "18%",
                    "safe",
                    "No major scam pattern detected, but still avoid sharing sensitive information unless fully verified.",
                    "Stay cautious and verify unusual requests before responding.",
                    List.of(
                            "No strong scam keywords detected",
                            "No clear request for sensitive information"
                    )
            );
        }
    }
}