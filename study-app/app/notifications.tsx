import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Platform, Pressable, StyleSheet, Switch, Text, View, } from "react-native";

const initialNotifications = [
  { id: "1", title: "Daily Reminder" },
  { id: "2", title: "Task Deadline Alert" },
  { id: "3", title: "Weekly Summary" },
  { id: "4", title: "Motivational Quote" },
  { id: "5", title: "System Update" },
];

export default function Notifications() {
  const [enabled, setEnabled] = useState<{ [key: string]: boolean }>({});
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();

  // Initialize all switches to false on mount
  useEffect(() => {
    const initialState: { [key: string]: boolean } = {};
    initialNotifications.forEach((n) => {
      initialState[n.id] = false;
    });
    setEnabled(initialState);
  }, []);

  const toggleSwitch = (id: string) => {
    setEnabled((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      setHasChanges(true);
      return newState;
    });
  };

  const onSave = () => {
    Alert.alert(
      "Success",
      "Notification preferences saved successfully!",
      [{ text: "OK", onPress: () => setHasChanges(false) }]
    );
  };

  const onCancel = () => {
    Alert.alert(
      "Cancelled",
      "Changes discarded. Returning to Home.",
      [
        {
          text: "OK",
          onPress: () => router.push("/"), // navigate home
          style: "cancel",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔔 Notifications</Text>

      <FlatList
        data={initialNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationText}>{item.title}</Text>
            <Switch
              value={enabled[item.id] || false}
              onValueChange={() => toggleSwitch(item.id)}
              trackColor={{ false: "#D1D5DB", true: "#A5B4FC" }} // light gray and light purple
              thumbColor={
                enabled[item.id]
                  ? Platform.OS === "android"
                    ? "#4338CA"
                    : "#4338CA"
                  : Platform.OS === "android"
                  ? "#F3F4F6"
                  : "#f4f3f4"
              }
              ios_backgroundColor="#D1D5DB"
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <Pressable
          style={[
            styles.actionButton,
            styles.saveButton,
            !hasChanges && styles.disabledButton,
          ]}
          disabled={!hasChanges}
          onPress={onSave}
          android_ripple={{ color: "#312E81" }}
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.saveText,
                !hasChanges && { color: "#C7D2FE" },
                pressed && { opacity: 0.7 },
              ]}
            >
              Save Changes
            </Text>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.cancelButton,
            pressed && { opacity: 0.7 },
          ]}
          onPress={onCancel}
          android_ripple={{ color: "#E0E7FF" }}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF", // light purple background like your other pages
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#4338CA", // deeper purple heading
    marginBottom: 30,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 40,
  },
  notificationItem: {
    backgroundColor: "#FFFFFF", // white card background for contrast
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#4338CA",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  notificationText: {
    fontSize: 18,
    color: "#4338CA",
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  actionButton: {
    flex: 0.48,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#4F46E5", // your main purple button color
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#4F46E5",
  },
  disabledButton: {
    backgroundColor: "#A8B1F2", // lighter disabled purple
  },
  saveText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 17,
  },
  cancelText: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 17,
  },
});
