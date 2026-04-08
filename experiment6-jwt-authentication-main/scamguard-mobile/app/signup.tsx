import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import api from "../src/services/api";
import { saveAuth } from "../src/utils/authStorage";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    if (password.length < 6) return { label: "Weak", color: "#ef4444" };
    if (password.length < 10) return { label: "Medium", color: "#f59e0b" };
    return { label: "Strong", color: "#22c55e" };
  }, [password]);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Input required", "Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Password and confirm password must match.");
      return;
    }

    if (!acceptedTerms) {
      Alert.alert("Terms required", "Please accept the Terms of Use and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/signup", {
        name,
        email,
        password,
      });

      await saveAuth(res.data.token, {
        email: res.data.email,
        name: res.data.name,
      });

      Alert.alert("Success", "Signup successful.");
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("SIGNUP ERROR:", error?.response?.data || error.message);
      Alert.alert(
        "Signup failed",
        error?.response?.data?.error || "Could not create account."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    Alert.alert("Coming Soon", "Google sign-up will be integrated next.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.brand}>🛡 ScamGuard AI</Text>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Join ScamGuard AI and stay protected from scam messages, links, and fraud.
        </Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrap}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Create password"
            placeholderTextColor="#94a3b8"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.showHide}>{showPassword ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.strength, { color: passwordStrength.color }]}>
          Password Strength: {passwordStrength.label}
        </Text>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordWrap}>
          <TextInput
            style={styles.passwordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            placeholderTextColor="#94a3b8"
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Text style={styles.showHide}>
              {showConfirmPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]} />
          <Text style={styles.checkboxText}>
            I agree to the Terms of Use and Privacy Policy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Creating..." : "Create Account"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignup}>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#081735",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(18, 35, 63, 0.92)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  brand: {
    color: "#65c66e",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: "#cbd5e1",
    marginTop: 10,
    marginBottom: 22,
    textAlign: "center",
    lineHeight: 22,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#0f172a",
    color: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  passwordWrap: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1e293b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  passwordInput: {
    color: "#fff",
    flex: 1,
    paddingVertical: 16,
  },
  showHide: {
    color: "#93c5fd",
    fontWeight: "700",
    marginLeft: 12,
  },
  strength: {
    marginBottom: 16,
    fontWeight: "700",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#94a3b8",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#65c66e",
    borderColor: "#65c66e",
  },
  checkboxText: {
    color: "#cbd5e1",
    flex: 1,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  googleButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  link: {
    color: "#93c5fd",
    marginTop: 18,
    textAlign: "center",
    fontWeight: "600",
  },
});