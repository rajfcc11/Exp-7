import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { clearAuth, getUser } from "../../src/utils/authStorage";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await getUser();
      setUser(savedUser);
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await clearAuth();

    if (Platform.OS === "web") {
      window.alert("Logged out successfully.");
    } else {
      Alert.alert("Logout", "Logged out successfully.");
    }

    router.replace("/login");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Text>
        </View>

        <Text style={styles.name}>{user?.name || "User"}</Text>
        <Text style={styles.email}>{user?.email || "No email found"}</Text>
      </View>

      <Text style={styles.sectionTitle}>Safety Overview</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ScamGuard Status</Text>
        <Text style={styles.infoText}>Your account is active and protected.</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Privacy Promise</Text>
        <Text style={styles.infoText}>
          We aim to help users detect scams while keeping app usage simple and trustworthy.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Support</Text>
        <Text style={styles.infoText}>
          Need help? You can later connect a support email, FAQ, and privacy page here.
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
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
  profileCard: {
    backgroundColor: "#12233f",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#22395f",
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#4f86f7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },
  email: {
    color: "#cbd5e1",
    fontSize: 15,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#12233f",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#22395f",
  },
  infoTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  infoText: {
    color: "#d1d5db",
    lineHeight: 22,
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
    marginBottom: 30,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});