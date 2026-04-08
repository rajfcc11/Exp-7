import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import colors from "../constants/colors";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛡 ScamGuard AI</Text>
      <Text style={styles.subtitle}>Your AI safety assistant</Text>

      <PrimaryButton
        title="Scan Suspicious Message"
        onPress={() => navigation.navigate("MessageScan")}
      />

      <PrimaryButton
        title="Scan Suspicious URL"
        onPress={() => navigation.navigate("UrlScan")}
        color={colors.secondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: colors.subtext,
    textAlign: "center",
    fontSize: 16,
    marginBottom: 30,
  },
});