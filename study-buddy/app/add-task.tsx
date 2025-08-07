import { Picker } from '@react-native-picker/picker'; // Make sure this package is installed
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function AddTasks() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError('User not found. Please log in again.');
      return;
    }

    if (!title.trim() || !dueDate.trim()) {
      setError('Title and due date are required.');
      return;
    }

    // Normalize due date to YYYY-MM-DD
    let normalizedDueDate = '';
    try {
      const parsed = new Date(dueDate);
      if (isNaN(parsed.getTime())) throw new Error();
      normalizedDueDate = parsed.toISOString().split('T')[0];
    } catch {
      setError('Invalid due date format. Use YYYY-MM-DD.');
      return;
    }

    const { error: insertError } = await supabase.from('tasks').insert([
      {
        user_id: user.id,
        title: title.trim(),
        due_date: normalizedDueDate,
        status: status.trim() || 'pending',
        priority: priority.trim(),
      },
    ]);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    Alert.alert('Success', 'Task added successfully');
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>📝 Add New Task</Text>

        <TextInput
          placeholder="Title"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Due Date (YYYY-MM-DD)"
          style={styles.input}
          value={dueDate}
          onChangeText={setDueDate}
        />
        <TextInput
          placeholder="Status (e.g. pending, completed)"
          style={styles.input}
          value={status}
          onChangeText={setStatus}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Priority</Text>
          <Picker
            selectedValue={priority}
            onValueChange={(itemValue) => setPriority(itemValue)}
            style={styles.picker}
            dropdownIconColor="#4F46E5"
          >
            <Picker.Item label="High ⚠️" value="high" />
            <Picker.Item label="Medium ⏳" value="medium" />
            <Picker.Item label="Low 🧘‍♂️" value="low" />
          </Picker>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Task</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#EEF2FF',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4338CA',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    marginBottom: 20,
    overflow: 'hidden',
  },
  label: {
    paddingHorizontal: 18,
    paddingTop: 14,
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  picker: {
    height: 50,
    width: '100%',
    paddingHorizontal: 18,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 17,
  },
  error: {
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 14,
  },
});

