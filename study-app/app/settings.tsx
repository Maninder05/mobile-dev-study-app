import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View, } from "react-native";
import { supabase } from "../lib/supabase"; // adjust path if needed

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [cacheCleared, setCacheCleared] = useState(false);
  const router = useRouter();

  // Mock study progress (replace with your real logic)
  const studyProgress = 72; // percent

  const clearCache = () => {
    // Clear any stored cache/data here if you have
    setCacheCleared(true);
    Alert.alert("Cache Cleared", "Whoooo! Cache cleared successfully.");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", "Failed to log out: " + error.message);
    } else {
      router.replace("/signin"); // navigate to sign-in page
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Ionicons name="person-circle-outline" size={90} color="#4338CA" />
        <Text style={styles.profileName}>Maninder K.</Text>
        <Text style={styles.profileSubtitle}>Keep up the great work! 📚</Text>
      </View>

      {/* Edit Profile Button */}
      <Pressable style={styles.profileButton}onPress={() => router.push("/edit-profile")}>
        <Text style={styles.profileButtonText}>Edit Profile</Text>
      </Pressable>

      {/* Settings Toggles */}
      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Dark Mode</Text>
        <Switch
          trackColor={{ false: "#CBD5E1", true: "#A5B4FC" }}
          thumbColor={darkMode ? "#4338CA" : "#F3F4F6"}
          value={darkMode}
          onValueChange={() => setDarkMode((prev) => !prev)}
        />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Notifications</Text>
        <Switch
          trackColor={{ false: "#CBD5E1", true: "#A5B4FC" }}
          thumbColor={notificationsEnabled ? "#4338CA" : "#F3F4F6"}
          value={notificationsEnabled}
          onValueChange={() => setNotificationsEnabled((prev) => !prev)}
        />
      </View>

      {/* Study Progress Section */}
      <View style={styles.progressSection}>
        <Text style={styles.progressTitle}>📈 Study Progress</Text>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${studyProgress}%` },
            ]}
          />
        </View>
        <Text style={styles.progressPercent}>{studyProgress}% completed</Text>
      </View>

      {/* Action Buttons */}
      <View style={{ marginTop: 40 }}>
        <Pressable style={[styles.actionButton, styles.clearCache]} onPress={clearCache}>
          <Text style={styles.actionButtonText}>Clear Cache</Text>
        </Pressable>

        <Pressable style={[styles.actionButton, styles.logout]} onPress={handleLogout}>
          <Text style={styles.actionButtonText}>Log Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF", // matching your home/bg color
    paddingHorizontal: 25,
    paddingTop: 60,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 35,
  },
  profileName: {
    marginTop: 14,
    fontSize: 30,
    fontWeight: "800",
    color: "#4338CA",
  },
  profileSubtitle: {
    marginTop: 6,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  profileButton: {
    backgroundColor: "#C7D2FE",
    paddingVertical: 15,
    borderRadius: 14,
    marginBottom: 30,
    alignItems: "center",
    shadowColor: "#4338CA",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  profileButtonText: {
    fontSize: 19,
    color: "#4338CA",
    fontWeight: "700",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 16,
    marginBottom: 22,
    shadowColor: "#4338CA",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 6,
  },
  optionText: {
    fontSize: 18,
    color: "#4338CA",
    fontWeight: "700",
  },
  progressSection: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 18,
    marginBottom: 30,
    shadowColor: "#4338CA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    elevation: 7,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#4F46E5",
    marginBottom: 14,
  },
  progressBarBackground: {
    height: 18,
    width: "100%",
    backgroundColor: "#E0E7FF",
    borderRadius: 14,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 14,
  },
  progressPercent: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#4338CA",
    textAlign: "right",
  },
  actionButton: {
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 18,
    alignItems: "center",
    shadowColor: "#4338CA",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  clearCache: {
    backgroundColor: "#818CF8",
  },
  logout: {
    backgroundColor: "#4338CA",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
  },
});
