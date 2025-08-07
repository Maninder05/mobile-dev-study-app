import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View, } from "react-native";

const { height } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();

  // Footer Navigation Button
  const FooterButton = ({
    icon,
    label,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
  }) => (
    <Pressable style={styles.footerButton} onPress={onPress}>
      <Ionicons name={icon} size={26} color="#4F46E5" />
      <Text style={styles.footerButtonText}>{label}</Text>
    </Pressable>
  );

  // Quick Action Card
  const FeatureCard = ({
    icon,
    label,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
  }) => (
    <Pressable style={styles.card} onPress={onPress}>
      <Ionicons name={icon} size={28} color="#4F46E5" />
      <Text style={styles.cardText}>{label}</Text>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={["#EEF2FF", "#F3F4F6", "#FFFFFF"]}
      style={styles.gradient}
    >
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Study Buddy 📚</Text>
        <Pressable onPress={() => router.push("/dashboard")}>
          <Ionicons name="person-circle-outline" size={36} color="#4F46E5" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Image */}
        <Image
          source={require("../assets/images/study-buddy.png")}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Quote */}
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>
            “Plan today, ace tomorrow.”
          </Text>
        </View>

        {/* Quick Navigation Cards */}
        <View style={styles.cardContainer}>
          <FeatureCard
            icon="speedometer-outline"
            label="Dashboard"
            onPress={() => router.push("/dashboard")}
          />
          <FeatureCard
            icon="calendar-outline"
            label="Calendar"
            onPress={() => router.push("/calendar")}
          />
          <FeatureCard
            icon="alert-circle-outline"
            label="Urgent Tasks"
            onPress={() => router.push("/urgent-tasks")}
          />
          <FeatureCard
            icon="alarm-outline"
            label="Upcoming Tasks"
            onPress={() => router.push("/upcoming-tasks")}
          />
          <FeatureCard
            icon="notifications-outline"
            label="Notifications"
            onPress={() => router.push("/notifications")}
          />
          <FeatureCard
            icon="settings-outline"
            label="Settings"
            onPress={() => router.push("/settings")}
          />
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <FooterButton
          icon="speedometer-outline"
          label="Dashboard"
          onPress={() => router.push("/dashboard")}
        />
        <FooterButton
          icon="calendar-outline"
          label="Calendar"
          onPress={() => router.push("/calendar")}
        />
        <FooterButton
          icon="alert-circle-outline"
          label="Urgent"
          onPress={() => router.push("/urgent-tasks")}
        />
        <FooterButton
          icon="notifications-outline"
          label="Notify"
          onPress={() => router.push("/notifications")}
        />
        <FooterButton
          icon="settings-outline"
          label="Settings"
          onPress={() => router.push("/settings")}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#E0E7FF",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  navbarTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4F46E5",
  },

  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  image: {
    width: "100%",
    height: height * 0.25,
    marginBottom: 15,
    borderRadius: 16,
  },

  quoteBox: {
    backgroundColor: "#E0E7FF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    color: "#4338CA",
  },

  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#FFF",
    paddingVertical: 20,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardText: {
    marginTop: 8,
    color: "#4F46E5",
    fontSize: 15,
    fontWeight: "600",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#EEF2FF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  footerButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  footerButtonText: {
    color: "#4F46E5",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
});

