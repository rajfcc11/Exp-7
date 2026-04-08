import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import api from "../src/services/api";
import { getUser } from "../src/utils/authStorage";

const categories = [
  "Bank / OTP Scam",
  "UPI Fraud",
  "Lottery Scam",
  "Fake Job Scam",
  "Phishing Link",
  "Other",
];

export default function ReportScamScreen() {
  const [content, setContent] = useState("");
  const [numberOrLink, setNumberOrLink] = useState("");
  const [category, setCategory] = useState("Other");
  const [loading, setLoading] = useState(false);

  const showMessage = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !numberOrLink.trim()) {
      showMessage(
        "Input required",
        "Please enter scam content or a suspicious number/link."
      );
      return;
    }

    try {
      setLoading(true);

      const user = await getUser();

      await api.post("/api/report-scam", {
        userEmail: user?.email || "",
        content,
        numberOrLink,
        category,
      });

      showMessage(
        "Report Submitted",
        "Thank you. Your scam report has been submitted successfully."
      );

      setContent("");
      setNumberOrLink("");
      setCategory("Other");
    } catch (error: any) {
      console.log("REPORT API ERROR:", error?.response?.data || error.message);
      showMessage("Error", "Could not submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🚨 Report Scam</Text>
      <Text style={styles.subtitle}>
        Help protect others by reporting scam messages, suspicious links, or fraud numbers.
      </Text>

      <Text style={styles.label}>Scam Message / Content</Text>
      <TextInput
        style={styles.textArea}
        multiline
        value={content}
        onChangeText={setContent}
        placeholder="Paste scam message, email text, or fraud content..."
        placeholderTextColor="#94a3b8"
      />

      <Text style={styles.label}>Suspicious Number or URL</Text>
      <TextInput
        style={styles.input}
        value={numberOrLink}
        onChangeText={setNumberOrLink}
        placeholder="Enter phone number or suspicious URL..."
        placeholderTextColor="#94a3b8"
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryWrap}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setCategory(item)}
            style={[
              styles.categoryChip,
              category === item && styles.categoryChipActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                category === item && styles.categoryTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>
          {loading ? "Submitting..." : "Submit Report"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#081735",
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    color: "#cbd5e1",
    marginBottom: 18,
    lineHeight: 22,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
  },
  textArea: {
    backgroundColor: "#1e2b44",
    color: "#fff",
    minHeight: 120,
    borderRadius: 14,
    padding: 16,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#334155",
  },
  input: {
    backgroundColor: "#1e2b44",
    color: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  categoryChip: {
    backgroundColor: "#1e2b44",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  categoryChipActive: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },
  categoryText: {
    color: "#cbd5e1",
    fontSize: 13,
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  submitBtn: {
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});