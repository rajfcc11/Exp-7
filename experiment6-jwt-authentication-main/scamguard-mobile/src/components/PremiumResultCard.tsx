import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";

type ScanResult = {
  riskType: string;
  scamProbability: string;
  severity?: string;
  safetyAdvice: string;
  recommendedAction?: string;
  reasons?: string[];
};

type Props = {
  result: ScanResult;
  onReport: () => void;
};

export default function PremiumResultCard({ result, onReport }: Props) {
  const getColor = () => {
    if (result?.severity === "danger") return "#ef4444";
    if (result?.severity === "warning") return "#f59e0b";
    return "#22c55e";
  };

  const handleCopyAdvice = () => {
    const text = `Risk Type: ${result.riskType}
Scam Probability: ${result.scamProbability}
Advice: ${result.safetyAdvice}`;

    if (Platform.OS === "web") {
      window.alert(text);
    } else {
      Alert.alert("Advice", text);
    }
  };

  return (
    <View style={[styles.card, { borderColor: getColor() }]}>
      <Text style={[styles.riskType, { color: getColor() }]}>
        {result.riskType}
      </Text>

      <Text style={styles.probability}>
        {result.scamProbability} SCAM RISK
      </Text>

      {result.reasons?.length ? (
        <>
          <Text style={styles.heading}>Why this was flagged:</Text>
          {result.reasons.map((reason: string, index: number) => (
            <Text key={index} style={styles.reason}>
              • {reason}
            </Text>
          ))}
        </>
      ) : null}

      <Text style={styles.heading}>What to do now:</Text>
      <Text style={styles.advice}>{result.safetyAdvice}</Text>

      {result.recommendedAction && (
        <>
          <Text style={styles.heading}>Recommended Action:</Text>
          <Text style={styles.action}>{result.recommendedAction}</Text>
        </>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleCopyAdvice}
        >
          <Text style={styles.secondaryButtonText}>Copy Advice</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={onReport}>
          <Text style={styles.primaryButtonText}>Report Scam</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderWidth: 2,
  },
  riskType: {
    fontSize: 20,
    fontWeight: "800",
  },
  probability: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    marginVertical: 10,
  },
  heading: {
    color: "#cbd5e1",
    marginTop: 10,
    fontWeight: "700",
  },
  reason: {
    color: "#94a3b8",
    marginTop: 3,
  },
  advice: {
    color: "#22c55e",
    marginTop: 6,
  },
  action: {
    color: "#e5e7eb",
    marginTop: 6,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 18,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});