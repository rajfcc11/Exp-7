import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "scamguard_scan_history";

export async function saveScan(item: {
  type: "message" | "url";
  input: string;
  riskType: string;
  scamProbability: string;
  safetyAdvice: string;
  createdAt?: string;
}) {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const history = existing ? JSON.parse(existing) : [];

    const newItem = {
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
    };

    history.unshift(newItem);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.log("saveScan error:", error);
  }
}

export async function getScanHistory() {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.log("getScanHistory error:", error);
    return [];
  }
}

export async function clearScanHistory() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.log("clearScanHistory error:", error);
  }
}