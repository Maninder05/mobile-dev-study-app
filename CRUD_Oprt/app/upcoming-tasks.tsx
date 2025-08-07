import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';

// Task type same as before
type Task = {
  id: number | string;
  title: string;
  due_date: string;
  status: string;
  priority: string;
};

export default function UpcomingTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('priority', 'medium')
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching upcoming tasks:', error.message);
      setTasks([]);
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
      <Text style={styles.heading}>⏳ Upcoming Tasks</Text>

      <Text style={styles.description}>
        Here are your medium priority tasks. Stay on track and keep progressing steadily!
      </Text>

      <Pressable
        style={styles.switchButton}
        onPress={() => router.push('/urgent-tasks')}
      >
        <Text style={styles.switchButtonText}>🚨 View Urgent Tasks</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator size="large" color="#4338CA" style={{ marginTop: 40 }} />
      ) : tasks.length === 0 ? (
        <Text style={styles.noTasks}>No medium priority tasks found. Relax or add some!</Text>
      ) : (
        tasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <Text style={styles.taskTitle}>🔹 {task.title}</Text>
            <Text style={styles.taskDate}>Due Date: {task.due_date}</Text>
            <Text style={styles.taskStatus}>Status: {task.status}</Text>
          </View>
        ))
      )}

      <Pressable style={styles.addButton} onPress={() => router.push('/task-history')}>
        <Text style={styles.addButtonText}>📜 Task History</Text>
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
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4338CA',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  switchButton: {
    backgroundColor: '#4338CA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 24,
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  switchButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  noTasks: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
  taskCard: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 14,
    marginBottom: 18,
    borderColor: '#C7D2FE',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4338CA',
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
    paddingVertical: 16,
    paddingHorizontal: 26,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 30,
    alignSelf: 'center',
    width: '60%',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 17,
  },
});
