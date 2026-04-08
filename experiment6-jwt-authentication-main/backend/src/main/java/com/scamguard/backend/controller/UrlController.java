package com.scamguard.backend.controller;

import com.scamguard.backend.model.DetectionResponse;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UrlController {

    @PostMapping("/detect-url")
    public DetectionResponse detectUrl(@RequestBody Map<String, String> request) {
        String url = request.get("url");

        if (url == null || url.trim().isEmpty()) {
            url = "";
        }

        String text = url.toLowerCase().trim();
        List<String> reasons = new ArrayList<>();

        boolean hasShortener =
                text.contains("bit.ly") || text.contains("tinyurl") || text.contains("goo.gl")
                        || text.contains("t.co") || text.contains("rb.gy") || text.contains("shorturl");

        boolean hasLoginWords =
                text.contains("login") || text.contains("verify") || text.contains("update")
                        || text.contains("secure") || text.contains("signin") || text.contains("auth")
                        || text.contains("confirm");

        boolean hasRewardWords =
                text.contains("claim") || text.contains("reward") || text.contains("gift")
                        || text.contains("free-money") || text.contains("lottery")
                        || text.contains("prize") || text.contains("bonus") || text.contains("won");

        boolean hasBankWords =
                text.contains("bank") || text.contains("upi") || text.contains("kyc")
                        || text.contains("account") || text.contains("wallet")
                        || text.contains("payment") || text.contains("otp");

        boolean hasSuspiciousDomain =
                text.contains(".xyz") || text.contains(".ru") || text.contains(".tk")
                        || text.contains(".click") || text.contains(".top")
                        || text.contains(".gq") || text.contains(".ml");

        boolean hasAtSymbol = text.contains("@");
        boolean noHttps = text.startsWith("http://");
        boolean suspiciousHyphen = text.contains("-");
        boolean hasIpAddress = text.matches(".*\\b\\d{1,3}(\\.\\d{1,3}){3}\\b.*");

        boolean looksLikeGoogleButFake =
                text.contains("google") && !text.contains("google.com");

        boolean looksLikeBankButFake =
                text.contains("bank") && !text.contains(".bank") && !text.contains("official");

        boolean looksLikePaytmFake =
                text.contains("paytm") && !text.contains("paytm.com");

        boolean looksLikePhonePeFake =
                text.contains("phonepe") && !text.contains("phonepe.com");

        boolean looksLikeGPayFake =
                (text.contains("gpay") || text.contains("googlepay")) && !text.contains("pay.google.com");

        if (hasShortener) reasons.add("Uses a shortened URL");
        if (hasLoginWords) reasons.add("Contains login or verification wording");
        if (hasRewardWords) reasons.add("Uses reward or claim bait words");
        if (hasBankWords) reasons.add("Contains banking or account-related wording");
        if (hasSuspiciousDomain) reasons.add("Uses a commonly abused suspicious domain");
        if (hasAtSymbol) reasons.add("Contains @ symbol which may hide the real destination");
        if (noHttps) reasons.add("Does not use secure HTTPS");
        if (suspiciousHyphen) reasons.add("Uses suspicious hyphen-based domain styling");
        if (hasIpAddress) reasons.add("Uses direct IP-based URL instead of a trusted domain");
        if (looksLikeGoogleButFake) reasons.add("May imitate a trusted brand like Google");
        if (looksLikeBankButFake) reasons.add("Looks like a fake bank-style domain");
        if (looksLikePaytmFake) reasons.add("May imitate Paytm");
        if (looksLikePhonePeFake) reasons.add("May imitate PhonePe");
        if (looksLikeGPayFake) reasons.add("May imitate Google Pay");

        int score = 0;

        if (hasShortener) score += 20;
        if (hasLoginWords) score += 15;
        if (hasRewardWords) score += 25;
        if (hasBankWords) score += 20;
        if (hasSuspiciousDomain) score += 25;
        if (hasAtSymbol) score += 20;
        if (noHttps) score += 10;
        if (suspiciousHyphen) score += 10;
        if (hasIpAddress) score += 20;
        if (looksLikeGoogleButFake) score += 15;
        if (looksLikeBankButFake) score += 15;
        if (looksLikePaytmFake) score += 15;
        if (looksLikePhonePeFake) score += 15;
        if (looksLikeGPayFake) score += 15;

        if (score >= 60) {
            return new DetectionResponse(
                    "Phishing / Dangerous URL",
                    Math.min(score, 95) + "%",
                    "danger",
                    "Do not open this link. It may be a phishing or scam website.",
                    "Avoid clicking it, block the sender, and verify through an official source.",
                    reasons.isEmpty() ? List.of("Multiple risky URL patterns detected") : reasons
            );
        } else if (score >= 30) {
            return new DetectionResponse(
                    "Suspicious URL",
                    score + "%",
                    "warning",
                    "Be careful with this link. Verify the source before opening it.",
                    "Open only if you fully trust the sender and destination.",
                    reasons.isEmpty() ? List.of("Some suspicious URL patterns detected") : reasons
            );
        } else {
            return new DetectionResponse(
                    "Safe / No Strong Risk Signal",
                    "12%",
                    "safe",
                    "No major scam pattern detected, but still verify unknown links before opening.",
                    "Proceed carefully and check the destination domain.",
                    List.of("No strong suspicious URL patterns detected")
            );
        }
    }
}