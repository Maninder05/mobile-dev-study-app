import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const handleSignIn = async () => {
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setError('Please enter your email');
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!trimmedPassword) {
      setError('Please enter your password');
      return;
    }

    try {
      // Sign in user
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!data.session) {
        setError('Please confirm your email before signing in.');
        return;
      }

      const user = data.user;

      // Retrieve names from AsyncStorage (set during signup)
      const firstName = (await AsyncStorage.getItem('firstName')) || '';
      const lastName = (await AsyncStorage.getItem('lastName')) || '';

      // Check if user details already exist
      const { data: existingUser, error: fetchError } = await supabase
        .from('user_details')
        .select('uuid')
        .eq('uuid', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // Unexpected error
        setError(fetchError.message);
        return;
      }

      if (!existingUser) {
        // Insert user details with first and last name from AsyncStorage
        const { error: insertError } = await supabase.from('user_details').insert([
          {
            uuid: user.id,
            first_name: firstName,
            last_name: lastName,
            email: user.email,
          },
        ]);

        if (insertError) {
          setError(insertError.message);
          return;
        }
      }

      // Clear AsyncStorage after insertion
      await AsyncStorage.removeItem('firstName');
      await AsyncStorage.removeItem('lastName');

      // Navigate to home screen
      router.replace('/home');
    } catch (err) {
      setError('Unexpected error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Log in to continue planning your study goals 📚</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.button}>
        <Button title="Sign In" onPress={handleSignIn} color="#4F46E5" />
      </View>

      <View style={styles.signup}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <Button title="Go to Sign Up" onPress={() => router.push('/signup' as any)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4338CA',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    borderColor: '#CBD5E0',
    borderWidth: 1,
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
  },
  error: {
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 8,
  },
  signup: {
    alignItems: 'center',
  },
  signupText: {
    marginBottom: 8,
    color: '#374151',
  },
});





