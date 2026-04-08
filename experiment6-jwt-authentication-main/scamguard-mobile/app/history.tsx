import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useFocusEffect } from "expo-router";
import api from "../src/services/api";
import { getUser } from "../src/utils/authStorage";

type HistoryItem = {
  id?: number;
  userEmail?: string;
  type: "message" | "url" | string;
  input: string;
  riskType: string;
  scamProbability: string;
  safetyAdvice: string;
  createdAt: string;
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    try {
      setLoading(true);

      const user = await getUser();
      console.log("LOAD HISTORY USER:", user);

      if (!user?.email) {
        setHistory([]);
        return;
      }

      const res = await api.get(
        `/api/history?email=${encodeURIComponent(user.email)}`
      );

      console.log("LOAD HISTORY RESPONSE:", res.data);
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (error: any) {
      console.log("HISTORY LOAD ERROR FULL:", error);
      console.log("HISTORY LOAD ERROR RESPONSE:", error?.response?.data);
      console.log("HISTORY LOAD ERROR MESSAGE:", error?.message);

      if (Platform.OS === "web") {
        window.alert("Could not load history.");
      } else {
        Alert.alert("Error", "Could not load history.");
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const clearHistoryNow = async () => {
    try {
      const user = await getUser();
      console.log("CLEAR HISTORY USER:", user);

      if (!user?.email) {
        if (Platform.OS === "web") {
          window.alert("No logged-in user found.");
        } else {
          Alert.alert("Error", "No logged-in user found.");
        }
        return;
      }

      const url = `/api/history?email=${encodeURIComponent(user.email)}`;
      console.log("DELETE URL:", `${api.defaults.baseURL}${url}`);

      const res = await api.request({
        url,
        method: "DELETE",
      });

      console.log("CLEAR HISTORY RESPONSE:", res.data);

      await loadHistory();

      if (Platform.OS === "web") {
        window.alert("History cleared successfully.");
      } else {
        Alert.alert("Done", "History cleared successfully.");
      }
    } catch (error: any) {
      console.log("CLEAR HISTORY ERROR FULL:", error);
      console.log("CLEAR HISTORY ERROR RESPONSE:", error?.response?.data);
      console.log("CLEAR HISTORY ERROR STATUS:", error?.response?.status);
      console.log("CLEAR HISTORY ERROR MESSAGE:", error?.message);

      if (Platform.OS === "web") {
        window.alert("Could not clear history.");
      } else {
        Alert.alert("Error", "Could not clear history.");
      }
    }
  };

  const handleClear = () => {
    if (history.length === 0) {
      if (Platform.OS === "web") {
        window.alert("There is nothing to clear.");
      } else {
        Alert.alert("No History", "There is nothing to clear.");
      }
      return;
    }

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to clear your scan history?"
      );
      if (confirmed) {
        clearHistoryNow();
      }
      return;
    }

    Alert.alert(
      "Clear History",
      "Are you sure you want to clear your scan history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearHistoryNow,
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🕘 Your Scan History</Text>

        <TouchableOpacity
          style={[styles.clearBtn, history.length === 0 && styles.clearBtnDisabled]}
          onPress={handleClear}
          disabled={history.length === 0}
        >
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Loading...</Text>
          <Text style={styles.emptyText}>Fetching your scan history.</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No scan history found</Text>
          <Text style={styles.emptyText}>
            Your message and URL scans will appear here.
          </Text>
        </View>
      ) : (
        history.map((item, index) => (
          <View key={`${item.createdAt}-${index}`} style={styles.card}>
            <Text style={styles.badge}>
              {item.type === "message" ? "MESSAGE SCAN" : "URL SCAN"}
            </Text>

            <Text style={styles.input}>{item.input}</Text>

            <Text style={styles.label}>Risk Type</Text>
            <Text style={styles.value}>{item.riskType}</Text>

            <Text style={styles.label}>Scam Probability</Text>
            <Text style={styles.probability}>{item.scamProbability}</Text>

            <Text style={styles.label}>Advice</Text>
            <Text style={styles.advice}>{item.safetyAdvice}</Text>

            <Text style={styles.time}>
              {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#081735",
    padding: 16,
  },
  headerRow: {
    marginTop: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  clearBtn: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  clearBtnDisabled: {
    opacity: 0.5,
  },
  clearBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  emptyCard: {
    backgroundColor: "#12233f",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#22395f",
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    color: "#cbd5e1",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#12233f",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#22395f",
  },
  badge: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "700",
  },
  input: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  label: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 8,
    fontWeight: "700",
  },
  value: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  probability: {
    color: "#ff6b6b",
    fontSize: 17,
    fontWeight: "700",
  },
  advice: {
    color: "#e5e7eb",
    fontSize: 14,
    marginTop: 4,
    lineHeight: 21,
  },
  time: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 14,
  },
});