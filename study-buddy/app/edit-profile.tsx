import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, } from "react-native";

export default function EditProfile() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email: string) =>
    /^\S+@\S+\.\S+$/.test(email.trim());

  const onSave = () => {
    setError("");
    if (!name.trim()) {
      setError("Please enter your preferred name.");
      return;
    }
    if (email && !isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    Alert.alert(
      "Profile Updated",
      `Name: ${name.trim()}\nEmail: ${email.trim() || "No change"}`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>✏️ Edit Profile</Text>

        <TextInput
          placeholder="Preferred Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          keyboardType="default"
          returnKeyType="done"
          autoComplete="name"
        />

        <TextInput
          placeholder="New Email (optional)"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="done"
          autoComplete="email"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.buttonRow}>
          <Pressable style={[styles.button, styles.saveButton]} onPress={onSave}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </Pressable>

          <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.buttonTextCancel}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF",
  },
  contentContainer: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#4338CA",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    marginBottom: 20,
    shadowColor: "#4338CA",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  error: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 0.48,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#4338CA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 6,
  },
  saveButton: {
    backgroundColor: "#4F46E5",
  },
  cancelButton: {
    backgroundColor: "#E0E7FF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  buttonTextCancel: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 18,
  },
});
