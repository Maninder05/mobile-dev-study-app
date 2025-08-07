// components/Header.tsx
import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  title: string;
  showLogout?: boolean;
}

export default function Header({ title, showLogout = false }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/signin');
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {showLogout && <Button title="Logout" onPress={handleLogout} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f4f4f4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
