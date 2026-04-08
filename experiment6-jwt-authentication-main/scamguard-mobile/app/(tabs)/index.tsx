import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import api from "../../src/services/api";
import { clearAuth, getUser } from "../../src/utils/authStorage";

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const currentUser = await getUser();
      setUser(currentUser);

      if (!currentUser?.email) {
        setLoading(false);
        return;
      }

      const [historyRes, reportsRes] = await Promise.all([
        api.get(`/api/history?email=${encodeURIComponent(currentUser.email)}`),
        api.get(`/api/reports?email=${encodeURIComponent(currentUser.email)}`),
      ]);

      setHistory(historyRes.data || []);
      setReports(reportsRes.data || []);
    } catch (error: any) {
      console.log("DASHBOARD LOAD ERROR:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await clearAuth();

    if (Platform.OS === "web") {
      window.alert("Logged out successfully.");
    } else {
      Alert.alert("Logout", "Logged out successfully.");
    }

    router.replace("/login");
  };

  const totalScans = history.length;
  const riskyScans = history.filter(
    (item) =>
      item?.scamProbability &&
      parseInt(String(item.scamProbability).replace("%", "")) >= 50
  ).length;

  const linksChecked = history.filter((item) => item?.type === "url").length;
  const messagesChecked = history.filter((item) => item?.type === "message").length;

  const mostCommonScamType =
    history.length > 0
      ? Object.entries(
          history.reduce((acc: Record<string, number>, item: any) => {
            const type = item?.riskType || "Unknown";
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {})
        ).sort((a: any, b: any) => b[1] - a[1])[0][0]
      : "No data yet";

  const safetyScore = Math.max(0, 100 - riskyScans * 10);
  const recentActivity = history.slice(0, 3);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </Text>
          <Text style={styles.title}>🛡 ScamGuard AI</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Your personal scam protection dashboard
      </Text>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#65c66e" />
          <Text style={styles.loaderText}>Loading dashboard...</Text>
        </View>
      ) : (
        <>
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Weekly Safety Score</Text>
            <Text
              style={[
                styles.heroScore,
                {
                  color:
                    safetyScore >= 80
                      ? "#22c55e"
                      : safetyScore >= 50
                      ? "#f59e0b"
                      : "#ef4444",
                },
              ]}
            >
              {safetyScore}/100
            </Text>
            <Text style={styles.heroText}>
              {riskyScans === 0
                ? "Great job. No high-risk scans detected recently."
                : `You detected ${riskyScans} risky scan${
                    riskyScans > 1 ? "s" : ""
                  } recently. Stay cautious.`}
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{totalScans}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{linksChecked}</Text>
              <Text style={styles.statLabel}>Links Checked</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{messagesChecked}</Text>
              <Text style={styles.statLabel}>Messages Checked</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{reports.length}</Text>
              <Text style={styles.statLabel}>Reports Submitted</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { borderColor: "#65c66e" }]}
              onPress={() => router.push("/message-scan")}
            >
              <Text style={styles.actionEmoji}>📩</Text>
              <Text style={styles.actionTitle}>Scan Message</Text>
              <Text style={styles.actionSubtitle}>Check suspicious texts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { borderColor: "#4f86f7" }]}
              onPress={() => router.push("/url-scan")}
            >
              <Text style={styles.actionEmoji}>🔗</Text>
              <Text style={styles.actionTitle}>Scan URL</Text>
              <Text style={styles.actionSubtitle}>Check suspicious links</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { borderColor: "#f59e0b" }]}
              onPress={() => router.push("/history")}
            >
              <Text style={styles.actionEmoji}>🕘</Text>
              <Text style={styles.actionTitle}>History</Text>
              <Text style={styles.actionSubtitle}>View past scans</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { borderColor: "#ef4444" }]}
              onPress={() => router.push("/report-scam")}
            >
              <Text style={styles.actionEmoji}>🚨</Text>
              <Text style={styles.actionTitle}>Report Scam</Text>
              <Text style={styles.actionSubtitle}>Help protect others</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Most Common Risk Type</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoValue}>{mostCommonScamType}</Text>
            <Text style={styles.infoText}>
              This is the most frequent scam pattern in your recent scan activity.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.length === 0 ? (
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                No recent scans yet. Start by scanning a message or URL.
              </Text>
            </View>
          ) : (
            recentActivity.map((item, index) => (
              <View key={`${item.createdAt}-${index}`} style={styles.activityCard}>
                <Text style={styles.activityType}>
                  {item.type === "message" ? "MESSAGE SCAN" : "URL SCAN"}
                </Text>
                <Text style={styles.activityInput} numberOfLines={2}>
                  {item.input}
                </Text>
                <Text style={styles.activityRisk}>
                  {item.riskType} • {item.scamProbability}
                </Text>
              </View>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#081735",
    padding: 16,
    paddingBottom: 30,
  },
  headerRow: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    color: "#93c5fd",
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 16,
    marginTop: 6,
    marginBottom: 16,
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
  },
  loaderWrap: {
    marginTop: 40,
    alignItems: "center",
  },
  loaderText: {
    color: "#cbd5e1",
    marginTop: 10,
  },
  heroCard: {
    backgroundColor: "#13233f",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#22395f",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  heroScore: {
    fontSize: 36,
    fontWeight: "900",
    marginTop: 8,
  },
  heroText: {
    color: "#d1d5db",
    lineHeight: 22,
    marginTop: 10,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#12233f",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#22395f",
  },
  statNumber: {
    color: "#65c66e",
    fontSize: 24,
    fontWeight: "800",
  },
  statLabel: {
    color: "#cbd5e1",
    marginTop: 6,
    fontSize: 13,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 4,
  },
  actionGrid: {
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: "#12233f",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.2,
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: 10,
  },
  actionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  actionSubtitle: {
    color: "#cbd5e1",
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: "#12233f",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#22395f",
  },
  infoValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  infoText: {
    color: "#d1d5db",
    lineHeight: 22,
  },
  activityCard: {
    backgroundColor: "#12233f",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#22395f",
  },
  activityType: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 8,
  },
  activityInput: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  activityRisk: {
    color: "#f59e0b",
    fontSize: 13,
    fontWeight: "700",
  },
});