import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { supabase } from '../lib/supabase';

type Task = {
  id: string;
  title: string;
  due_date: string;
  status: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });
    if (!error && data) setTasks(data);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const renderItem = ({ item }: { item: Task }) => (
    <Pressable
      style={styles.taskCard}
      onPress={() =>
        router.push({
          pathname: '/view-tasks',
          params: { id: item.id },
        })
      }
    >
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskMeta}>
        {item.due_date} •{' '}
        <Text
          style={[
            styles.statusBadge,
            item.status === 'completed' ? styles.statusCompleted : styles.statusPending,
          ]}
        >
          {item.status}
        </Text>
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Your Tasks</Text>
        <Pressable onPress={() => router.push('/add-task')}>
          <Ionicons name="add-circle" size={44} color="#4F46E5" />
        </Pressable>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Tap + to add one!</Text>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4338CA',
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  taskMeta: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
  },
  statusBadge: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusPending: {
    color: '#D97706',
  },
  statusCompleted: {
    color: '#10B981',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 100,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

