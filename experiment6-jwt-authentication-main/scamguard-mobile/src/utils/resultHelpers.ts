export function getSeverity(probability?: string) {
    const value = Number((probability || "0").replace("%", ""));
  
    if (value >= 85) return "danger";
    if (value >= 50) return "warning";
    return "safe";
  }
  
  export function getSeverityLabel(probability?: string) {
    const level = getSeverity(probability);
  
    if (level === "danger") return "Dangerous";
    if (level === "warning") return "Suspicious";
    return "Low Risk";
  }
  
  export function getReasons(riskType?: string, input?: string) {
    const reasons: string[] = [];
    const text = (input || "").toLowerCase();
    const type = (riskType || "").toLowerCase();
  
    if (type.includes("otp") || text.includes("otp")) {
      reasons.push("Requests sensitive verification details like OTP or banking info");
    }
  
    if (type.includes("bank") || text.includes("bank")) {
      reasons.push("Uses banking language to create urgency or fear");
    }
  
    if (type.includes("lottery") || type.includes("reward") || text.includes("won") || text.includes("prize")) {
      reasons.push("Promises rewards or prizes to attract quick action");
    }
  
    if (type.includes("job") || text.includes("registration fee") || text.includes("earn money")) {
      reasons.push("Shows fake earning or job-related scam patterns");
    }
  
    if (type.includes("phishing") || text.includes("click") || text.includes("link")) {
      reasons.push("Encourages clicking suspicious links or visiting risky sites");
    }
  
    if (text.includes("urgent") || text.includes("blocked") || text.includes("verify")) {
      reasons.push("Uses urgent wording to pressure immediate action");
    }
  
    if (reasons.length === 0) {
      reasons.push("No strong scam indicators were detected in the current input");
    }
  
    return reasons.slice(0, 3);
  }
  
  export function getRecommendedAction(probability?: string) {
    const level = getSeverity(probability);
  
    if (level === "danger") {
      return "Do not click any links, do not reply, and block or report the sender.";
    }
  
    if (level === "warning") {
      return "Verify the source independently before taking any action.";
    }
  
    return "Stay cautious and avoid sharing personal or financial details unless verified.";
  }