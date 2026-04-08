import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#081735" },
        headerTintColor: "#fff",
        contentStyle: { backgroundColor: "#081735" },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
      <Stack.Screen name="forgot-password" options={{ title: "Forgot Password" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="message-scan" options={{ title: "Message Scan" }} />
      <Stack.Screen name="url-scan" options={{ title: "URL Scan" }} />
      <Stack.Screen name="history" options={{ title: "History" }} />
      <Stack.Screen name="report-scam" options={{ title: "Report Scam" }} />
      <Stack.Screen name="learn" options={{ title: "Learn Scams" }} />
    </Stack>
  );
}
