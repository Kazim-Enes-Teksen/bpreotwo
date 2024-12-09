import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase"; // Ensure the path is correct
import { TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router, Stack, useNavigation } from "expo-router";

const App = () => {
  const [rememberMe, setRememberMe] = useState(false);

  const [personName, setPersonName] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        // Alert.alert("Success", "Logged in successfully");
        router.replace("/menu");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Update the user's profile with the full name
        await updateProfile(user, {
          displayName: personName,
        });
        // Alert.alert("Success", "Registered successfully");
      }
      setEmail("");
      setPassword("");
      router.replace("./menu", { relativeToDirectory: true });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Please enter your email address.");
      return;
    }
    try {
      await sendPasswordResetEmail(email);
      Alert.alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              <Text style={styles.logoT}>T</Text>
              <Text style={styles.logoValida}>valida</Text>
            </Text>
          </View>

          <Text style={styles.subtitle}>
            {isLogin
              ? "LOGIN TO VALIDATE YOUR TESTS"
              : "REGISTER TO CREATE AN ACCOUNT"}
          </Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={24}
                color="#A0AEC0"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {isLogin ? null : (
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person"
                  size={24}
                  color="#A0AEC0"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={personName}
                  onChangeText={setPersonName}
                  keyboardType="text"
                  autoCapitalize="none"
                />
              </View>
            )}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color="#A0AEC0"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            {isLogin ? (
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}
                  >
                    {rememberMe && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>Remember Me</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePasswordReset()}>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <TouchableOpacity style={styles.loginButton} onPress={handleAuth}>
              <Text style={styles.loginButtonText}>
                {isLogin ? "Login" : "Register"}
              </Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                {isLogin
                  ? "Don't have an account? "
                  : "Already Have an account ? "}
              </Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.signupLink}>
                  {isLogin ? " Create an account" : " Login"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomLeftDecoration} />
        <View style={styles.bottomRightDecoration} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  logoT: {
    color: "#E53E3E",
  },
  logoValida: {
    color: "#48BB78",
  },
  subtitle: {
    color: "#FC8181",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  midTitle: {
    color: "#FC8181",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    marginBottom: 16,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 10,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#A0AEC0",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4299E1",
    borderColor: "#4299E1",
  },
  checkboxLabel: {
    color: "#4A5568",
    fontSize: 14,
  },
  forgotPassword: {
    color: "#4299E1",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#E53E3E",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#4A5568",
    fontSize: 14,
  },
  signupLink: {
    color: "#4299E1",
    fontSize: 14,
  },
  bottomLeftDecoration: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "25%",
    height: 80,
    backgroundColor: "#E53E3E",
    borderTopRightRadius: 80,
  },
  bottomRightDecoration: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "25%",
    height: 80,
    backgroundColor: "#E53E3E",
    borderTopLeftRadius: 80,
  },
  button: {
    backgroundColor: "#E53E3E",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  detectedText: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default App;
