import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from "react-native";
import colors from "../constants/colors";
import PrimaryButton from "../components/PrimaryButton";
import ResultCard from "../components/ResultCard";
import api from "../services/api";

export default function MessageScanScreen() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  const handleScan = async () => {
    if (!message.trim()) {
      Alert.alert("Input required", "Please enter a suspicious message.");
      return;
    }

    try {
      const response = await api.post("/api/detect-scam", { message });
      setResult(response.data);
    } catch (error) {
      Alert.alert("Error", "Could not connect to server.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Check Suspicious Message</Text>

      <TextInput
        placeholder="Paste SMS, WhatsApp, or email text..."
        placeholderTextColor="#94a3b8"
        multiline
        value={message}
        onChangeText={setMessage}
        style={styles.input}
      />

      <PrimaryButton title="Detect Scam" onPress={handleScan} />

      {result && (
        <ResultCard
          title="Detection Result"
          probability={result.scamProbability}
          type={result.type}
          advice="Do not click suspicious links or share OTP/payment details."
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  heading: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    marginTop: 20,
  },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    minHeight: 160,
    borderRadius: 14,
    padding: 16,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: colors.border,
  },
});