import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput, View } from "react-native";

export default function SignInScreen() {
    const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Heading>
            Sign In With Email
        </Heading>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#94a3b8"
          />

          <Button
            onPress={() => {
                console.log("Signing in with:", { email, password });
                router.push("/tabs/schedule-list");
            }}
          >
            <ButtonText>Sign In</ButtonText>
          </Button>

          <Button
            variant="link"
            onPress={() => {
                router.push("/sign-up");
            }}
          >
            <ButtonText>Need an account?</ButtonText>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  form: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 32,
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f8fafc",
    fontSize: 16,
    color: "#334155",
  },
  linkText: {
    textAlign: "center",
    color: "#3b82f6",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});