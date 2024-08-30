import React, { useState } from "react";
import * as FileSystem from "expo-file-system";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function InterestPointScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Permission to access location was denied"
      );
      return;
    }
    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage(manipResult.uri);
    } else {
      Alert.alert(
        "No Image",
        "No image was selected or the operation was canceled."
      );
    }
  };
  const saveInterestPoint = async () => {
    if (!location) {
      Alert.alert("Missing Location", "Please set a location before saving.");
      return;
    }
    if (!image) {
      Alert.alert("Missing Image", "Please take a photo before saving.");
      return;
    }
    if (!description) {
      Alert.alert(
        "Missing Description",
        "Please enter a description before saving."
      );
      return;
    }
    try {
      const imageName = image.split("/").pop();
      const imagePath = `${FileSystem.documentDirectory}${imageName}`;
      await FileSystem.copyAsync({
        from: image,
        to: imagePath,
      });
      const interestPoint = {
        location,
        image: imagePath,
        description,
        detailedDescription, // Přidání detailního popisu
        timestamp: new Date().toISOString(),
      };
      const storedPoints = await AsyncStorage.getItem("interestPoints");
      const points = storedPoints ? JSON.parse(storedPoints) : [];
      points.push(interestPoint);
      await AsyncStorage.setItem("interestPoints", JSON.stringify(points));
      Alert.alert("Saved", "Interest point saved successfully!");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error saving interest point:", error);
      Alert.alert(
        "Error",
        "An error occurred while saving the interest point."
      );
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Button title="Set Location" onPress={getLocation} />
        {location && (
          <Text style={styles.text}>
            Location: {location.latitude}, {location.longitude}
          </Text>
        )}
        <Button title="Take a Photo" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TextInput
          style={styles.input}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Enter detailed description"
          value={detailedDescription}
          onChangeText={setDetailedDescription}
          multiline
        />
        <Button title="Save Interest Point" onPress={saveInterestPoint} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  scrollContainer: {
    alignItems: "center",
    padding: 16,
  },
  text: {
    marginVertical: 10,
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});
