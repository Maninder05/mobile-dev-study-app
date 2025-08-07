import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { supabase } from "../lib/supabase";

// Define a minimal DateObject type (since react-native-calendars doesn't export one)
type DateObject = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

// Configure calendar locale
LocaleConfig.locales["en"] = {
  monthNames: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ],
  monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  dayNames: [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  today: "Today"
};
LocaleConfig.defaultLocale = "en";

export default function CalendarScreen() {
  const [selected, setSelected] = useState<string>(new Date().toISOString().split("T")[0]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

  // Fetch tasks from Supabase and mark dates
  const fetchTasks = async () => {
    const { data, error } = await supabase.from("tasks").select("*");
    if (!error && data) {
      setTasks(data);

      const marks: { [key: string]: any } = {};
      data.forEach((task) => {
        if (task.due_date) {
          // If date already marked, add another dot
          if (marks[task.due_date]) {
            if (marks[task.due_date].dots) {
              marks[task.due_date].dots.push({ key: task.id.toString(), color: "#4F46E5" });
            } else {
              marks[task.due_date].dots = [{ key: task.id.toString(), color: "#4F46E5" }];
            }
          } else {
            marks[task.due_date] = {
              marked: true,
              dots: [{ key: task.id.toString(), color: "#4F46E5" }],
              selected: task.due_date === selected,
              selectedColor: "#4F46E5",
            };
          }
        }
      });

      // Ensure selected date shows as selected
      marks[selected] = {
        ...(marks[selected] || {}),
        selected: true,
        selectedColor: "#4F46E5",
      };

      setMarkedDates(marks);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    // Update marked dates when selected changes
    const updated = { ...markedDates };
    Object.keys(updated).forEach((date) => {
      updated[date].selected = date === selected;
      updated[date].selectedColor = date === selected ? "#4F46E5" : undefined;
    });
    setMarkedDates(updated);
  }, [selected]);

  const tasksForSelectedDate = tasks.filter((task) => task.due_date === selected);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📅 Your Task Calendar</Text>

      <Calendar
        onDayPress={(day: DateObject) => setSelected(day.dateString)}
        markedDates={markedDates}
        markingType="multi-dot"
        theme={{
          backgroundColor: "#fff",
          calendarBackground: "#fff",
          textSectionTitleColor: "#4F46E5",
          selectedDayBackgroundColor: "#4F46E5",
          selectedDayTextColor: "#fff",
          todayTextColor: "#4F46E5",
          dayTextColor: "#000",
          textDisabledColor: "#d9e1e8",
          dotColor: "#4F46E5",
          arrowColor: "#4F46E5",
          monthTextColor: "#4F46E5",
          indicatorColor: "#4F46E5",
          textDayFontWeight: "600",
          textMonthFontWeight: "700",
          textDayHeaderFontWeight: "600",
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 14,
        }}
        style={styles.calendar}
      />

      <Text style={styles.taskHeader}>Tasks on {selected}</Text>
      {tasksForSelectedDate.length === 0 ? (
        <Text style={styles.noTask}>No tasks for this day.</Text>
      ) : (
        <FlatList
          data={tasksForSelectedDate}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskStatus}>{item.status}</Text>
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
    backgroundColor: "#EEF2FF",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4F46E5",
    textAlign: "center",
    marginBottom: 30,
  },
  calendar: {
    borderRadius: 16,
    elevation: 6,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  taskHeader: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: "600",
    color: "#4F46E5",
    marginBottom: 8,
  },
  noTask: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
    marginTop: 10,
  },
  taskItem: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  taskStatus: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
});


