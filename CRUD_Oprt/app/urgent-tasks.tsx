import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, } from 'react-native';
import { supabase } from '../lib/supabase';

// Define Task type matching your database row
type Task = {
  id: number | string;
  title: string;
  due_date: string;
  status: string;
  priority: string;
};

export default function UrgentTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchTasks = async () => {
  setLoading(true);
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('priority', 'high')
    .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching urgent tasks:', error.message);
      setTasks([]); // Clear tasks on error
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.heading}> Urgent Tasks 🚨</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" />
      ) : tasks.length === 0 ? (
        <Text style={styles.noTasks}>No high priority tasks found.</Text>
      ) : (
        tasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <Text style={styles.taskTitle}>⚠️ {task.title}</Text>
            <Text style={styles.taskDate}>Due: {task.due_date}</Text>
            <Text style={styles.taskStatus}>Status: {task.status}</Text>
          </View>
        ))
      )}

      <Pressable style={styles.addButton} onPress={() => router.push('/add-task')}>
        <Text style={styles.addButtonText}>➕ Add New Task</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2FF',
  },
  content: {
    padding: 24,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    marginTop:20,
    color: '#4338CA',
    marginBottom: 24,
    textAlign: 'center',
  },
  noTasks: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
  },
  taskCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderColor: '#C7D2FE',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 6,
  },
  taskDate: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  taskStatus: {
    fontSize: 14,
    color: '#4B5563',
  },
  addButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
