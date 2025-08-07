import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { supabase } from "../lib/supabase";

const { height } = Dimensions.get("window");

type Task = {
  id: number | string;
  title: string;
  due_date: string;
  status: string;
  priority: string;
};

function AnimatedButton({ label, onPress }: { label: string; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, friction: 4, tension: 30, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.animatedButton, { transform: [{ scale }] }]}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function TaskHistory() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletedTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("status", "completed")
      .order("due_date", { ascending: false });

    if (error) {
      console.error("Error fetching completed tasks:", error.message);
      setTasks([]);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#4338CA" />
      </Pressable>

      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <Ionicons name="checkmark-done-circle-outline" size={24} color="#4338CA" />
        </View>
        <Text style={styles.headerTitle}>Task History</Text>
      </View>

      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>Every completed task moves you closer to your goals! 🎯</Text>
      </View>

      <View style={styles.separator} />

      {/* Filter Buttons */}
      <View style={styles.buttonsContainer}>
        <AnimatedButton label="This Week" onPress={() => { /* Add filter logic here */ }} />
        <AnimatedButton label="Past 30 Days" onPress={() => { /* Add filter logic here */ }} />
      </View>

      {/* Completed Tasks List */}
      {loading ? (
        <ActivityIndicator size="large" color="#4338CA" style={{ marginTop: 20 }} />
      ) : tasks.length === 0 ? (
        <Text style={styles.noTasksText}>No completed tasks yet. Keep pushing!</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <Text style={styles.taskTitle}>✅ {item.title}</Text>
              <Text style={styles.taskDate}>Completed on: {item.due_date}</Text>
              <Text style={styles.taskPriority}>Priority: {item.priority}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF", // same as home page background
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    padding: 6,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  iconBadge: {
    backgroundColor: "#C7D2FE",
    padding: 8,
    borderRadius: 20,
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4338CA",
    letterSpacing: 1,
  },
  quoteBox: {
    height: height * 0.25,
    backgroundColor: "#C7D2FE",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4338CA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    color: "#4338CA",
  },
  separator: {
    height: 2,
    backgroundColor: "#4338CA",
    marginVertical: 20,
    borderRadius: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  animatedButton: {
    width: "48%",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#C7D2FE",
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4338CA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#4338CA",
    fontSize: 18,
    fontWeight: "600",
  },
  noTasksText: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    color: "#6B7280",
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    borderColor: "#A5B4FC",
    borderWidth: 1,
    shadowColor: "#4338CA",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4338CA",
    marginBottom: 6,
  },
  taskDate: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  taskPriority: {
    fontSize: 14,
    color: "#6B7280",
  },
});
