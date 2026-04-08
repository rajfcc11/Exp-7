import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from "react-native";
import colors from "../constants/colors";
import PrimaryButton from "../components/PrimaryButton";
import ResultCard from "../components/ResultCard";
import api from "../services/api";

export default function UrlScanScreen() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  const handleScan = async () => {
    if (!url.trim()) {
      Alert.alert("Input required", "Please enter a suspicious URL.");
      return;
    }

    try {
      const response = await api.post("/api/detect-url", { url });
      setResult(response.data);
    } catch (error) {
      Alert.alert("Error", "Could not connect to server.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Check Suspicious URL</Text>

      <TextInput
        placeholder="Paste suspicious link..."
        placeholderTextColor="#94a3b8"
        value={url}
        onChangeText={setUrl}
        style={styles.input}
      />

      <PrimaryButton title="Scan URL" onPress={handleScan} color={colors.secondary} />

      {result && (
        <ResultCard
          title="URL Analysis"
          probability={result.risk}
          type={result.type}
          advice="Avoid opening links marked suspicious or dangerous."
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
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
});