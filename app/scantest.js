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
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { getAuth } from "firebase/auth";
import { auth } from "../firebase"; // Ensure the path is correct
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useNavigation } from "expo-router";
import { saveData } from "../components/savedata";

const App = () => {
  const [imageUri, setImageUri] = useState(null);
  const [detectedText, setDetectedText] = useState("");
  const [apiAnswer, setApiAnswer] = useState("");
  const [isEditableQuestion, setIsEditableQuestion] = useState(false);

  // Pick an image from gallery
  const pickImage = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Camera permission is required to use this feature.");
      return;
    }

    // Open the camera if permission is granted
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Allows the user to crop image within picker
      aspect: [4, 3], // Aspect ratio for cropping (optional)
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      // cropImage(result.assets[0].uri);
      callGoogleVision(result.assets[0].uri); // Call Google Vision API with the cropped image
    }
  };

  const callGoogleVision = async (imageUri2) => {
    try {
      const base64Image = await fileToBase64(imageUri2); // Await the conversion
      const body = JSON.stringify({
        requests: [
          {
            features: [{ type: "TEXT_DETECTION", maxResults: 5 }],
            image: {
              content: base64Image,
            },
          },
        ],
      });

      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=`, // Replace with API key
        {
          method: "POST",
          body: body,
          headers: { "Content-Type": "application/json" },
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${responseData.error?.message}`
        );
      }

      const text =
        responseData.responses[0].fullTextAnnotation?.text ||
        "No text detected.";
      setDetectedText(text); // Set the detected text
    } catch (error) {
      console.error("Error calling Google Vision API:", error);
      Alert.alert("Error", error.message || "An unknown error occurred.");
    }
  };

  const fileToBase64 = async (uri) => {
    try {
      const asset = await ImageManipulator.manipulateAsync(uri, [], {
        base64: true,
      });
      return asset.base64; // Return base64 directly
    } catch (error) {
      console.error("Error converting file to base64:", error);
      throw new Error("Failed to convert image to base64");
    }
  };

  const handleGeminiAPICall = async () => {
    const answer = await sendTextToGeminiAPI(detectedText);
    if (answer) {
      setApiAnswer(answer);
    }
  };

  // Assuming OCR text is stored in detectedText
  const sendTextToGeminiAPI = async (detectedText2) => {
    const user = getAuth().currentUser;
    let token = "";

    if (user) {
      token = await user.getIdToken(); // Use this token as accessToken in the API call
    }
    // console.log(token);

    const formattedText = `This is an exam question: ${detectedText2}. Please provide the correct answer option from the given four choices. There is no need to provide explanation, just give me the option letter of the correct answer`;
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: formattedText, // No need to stringify, send as string
            },
          ],
        },
      ],
    };
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // Correct use of template literal
          },
          body: JSON.stringify(requestBody), // Convert requestBody to JSON string
        }
      );

      const data = await response.json();
      console.log(data.candidates[0].content.parts[0].text);

      if (response.ok) {
        return data.candidates[0].content.parts[0].text; // Assuming the response contains the correct answer
      } else {
        console.error("Error in API response:", data);
        throw new Error("Failed to retrieve answer");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return null;
    }
  };

  const handleSave = async () => {
    if (!detectedText || !apiAnswer) {
      Alert.alert("Question text or correct answer is empty");
      return;
    }
    try {
      await saveData(detectedText, apiAnswer);
      Alert.alert("Data saved successfully!");
      setDetectedText("");
      setApiAnswer("");
    } catch (error) {
      Alert.alert("Error saving data:", error.message);
    }
  };

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "SCAN QUESTION",
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
      <View style={{ padding: 20 }}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <View style={styles.buttonContent}>
            <Ionicons
              name="camera"
              size={24}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>START SCAN</Text>
          </View>
        </TouchableOpacity>
        {imageUri && (
          <View style={styles.thumbnailContainer}>
            <Text style={styles.midTitle}>SCANNED TEST QUESTION</Text>
            <Image source={{ uri: imageUri }} style={styles.thumbnail} />
            <TextInput
              multiline
              editable={isEditableQuestion}
              numberOfLines={10}
              onChangeText={(text) => setDetectedText(text)}
              value={detectedText}
              style={styles.detectedText}
            />
            {detectedText ? (
              <View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setIsEditableQuestion((prev) => !prev)}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons
                      name="create"
                      size={24}
                      color="white"
                      style={styles.icon}
                    />
                    <Text style={styles.buttonText}>
                      {isEditableQuestion ? "Finish Editing" : "Edit Question"}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleGeminiAPICall}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons
                      name="download"
                      size={24}
                      color="white"
                      style={styles.icon}
                    />
                    <Text style={styles.buttonText}>GET CORRECT ANSWER</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
            {apiAnswer ? (
              <View style={styles.answerContainer}>
                <Text style={styles.answerText}>
                  CORRECT ANSWER: {apiAnswer}
                </Text>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                  <View style={styles.buttonContent}>
                    <Ionicons
                      name="save"
                      size={24}
                      color="white"
                      style={styles.icon}
                    />
                    <Text style={styles.buttonText}>SAVE TEST</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
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
    maxHeight: 400,
  },
});

export default App;
