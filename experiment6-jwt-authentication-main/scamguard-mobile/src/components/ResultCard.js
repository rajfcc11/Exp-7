import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../constants/colors";

export default function ResultCard({ title, probability, type, advice }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {probability ? <Text style={styles.text}>Scam Probability: {probability}</Text> : null}
      {type ? <Text style={styles.text}>Type: {type}</Text> : null}
      {advice ? <Text style={styles.advice}>Advice: {advice}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  text: {
    color: colors.subtext,
    fontSize: 15,
    marginBottom: 6,
  },
  advice: {
    color: "#f8fafc",
    fontSize: 14,
    marginTop: 8,
  },
});