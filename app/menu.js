import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // Ensure the path is correct
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router, Stack, useNavigation } from "expo-router";

const Menu = () => {
  const [user, setUser] = useState(getAuth().currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe; // Cleanup the subscription
  }, []);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => null,
      title: "HOME",
      headerRight: () => (
        <Button
          title="Exit"
          onPress={() => {
            auth.signOut();
            router.replace("./", { relativeToDirectory: true });
        }}
          color="red"
        />
      ),
    });
  }, [navigation]);
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push("./scantest", { relativeToDirectory: true })
          }
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="camera"
              size={24}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>SCAN QUESTION</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push("./storedtests", { relativeToDirectory: true })
          }
        >
          <View style={styles.buttonContent}>
            <Ionicons name="list" size={24} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>PREVIOUS QUESTIONS</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Alert.alert("HERE WILL BE PURCHASING GATEWAY")}
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="star"
              size={24}
              color="yellow"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>GET PREMIUM </Text>
            <Ionicons
              name="star"
              size={24}
              color="yellow"
              style={styles.icon}
            />
          </View>
        </TouchableOpacity>
      </View>
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

export default Menu;
