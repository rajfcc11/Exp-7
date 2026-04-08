import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";

const items = [
  {
    title: "OTP and Bank Fraud",
    body:
      "Never share OTP, PIN, CVV, or banking passwords. Real banks do not ask for these over SMS, call, or chat.",
  },
  {
    title: "Fake UPI Payment Scams",
    body:
      "Be careful when someone asks you to scan a QR code to receive money. In most cases, scanning a QR code initiates a payment from your side.",
  },
  {
    title: "Lottery and Reward Scams",
    body:
      "Messages claiming you won money, prizes, or gifts are usually bait. Do not click the link or pay any processing fee.",
  },
  {
    title: "Fake Job Offers",
    body:
      "Avoid jobs that ask for registration fees, training fees, or urgent payment before joining. Verify the employer independently.",
  },
  {
    title: "Phishing Links",
    body:
      "Do not trust links with strange domains, misspelled brand names, or urgent login requests. Always type the official website yourself.",
  },
  {
    title: "Fake KYC / SIM Block Scams",
    body:
      "Scammers often threaten SIM blocking or KYC suspension to create panic. Do not share Aadhaar, OTP, or personal documents without verification.",
  },
];

export default function LearnScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎓 Learn Common Scams</Text>
      <Text style={styles.subtitle}>
        Understand how common scams work so you can avoid them confidently.
      </Text>

      {items.map((item) => (
        <View key={item.title} style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardBody}>{item.body}</Text>
        </View>
      ))}
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
  card: {
    backgroundColor: "#1e2b44",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardBody: {
    color: "#d1d5db",
    lineHeight: 22,
  },
});