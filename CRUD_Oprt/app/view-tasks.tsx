import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function ViewTask() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.from('tasks').select('*').eq('id', id).single().then(({ data }) => {
      setTask(data);
      setTitle(data.title);
      setDueDate(data.due_date);
      setStatus(data.status);
    });
  }, [id]);

  const handleUpdate = async () => {
    const { error } = await supabase.from('tasks').update({ title, due_date: dueDate, status }).eq('id', id);
    if (!error) router.back();
    else setError(error.message);
  };

  const handleDelete = async () => {
    await supabase.from('tasks').delete().eq('id', id);
    router.back();
  };

  if (!task) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Task</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} value={dueDate} onChangeText={setDueDate} />
      <TextInput style={styles.input} value={status} onChangeText={setStatus} />
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
      </Pressable>
      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete Task</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF2FF', padding: 20 },
  heading: { fontSize: 22, fontWeight: '600', color: '#4338CA', marginBottom: 16 },
  input: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 12, borderColor: '#CBD5E0', borderWidth: 1 },
  button: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: '600' },
  deleteButton: { marginTop: 12, alignItems: 'center' },
  deleteText: { color: '#DC2626', fontWeight: '600' },
  error: { color: '#DC2626', marginBottom: 8 },
});
