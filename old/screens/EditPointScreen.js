import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function EditPointScreen({ route, navigation }) {
  const { point } = route.params;
  const [description, setDescription] = useState(point.description || "");
  const [detailedDescription, setDetailedDescription] = useState(
    point.detailedDescription || ""
  );
  const [latitude, setLatitude] = useState(
    point.location.latitude?.toString() || ""
  );
  const [longitude, setLongitude] = useState(
    point.location.longitude?.toString() || ""
  );
  const handleSave = async () => {
    try {
      const storedPoints = await AsyncStorage.getItem("interestPoints");
      let points = storedPoints ? JSON.parse(storedPoints) : [];
      const index = points.findIndex((p) => p.title === point.title);
      if (index !== -1) {
        points[index].description = description;
        points[index].detailedDescription = detailedDescription;
        points[index].location.latitude = parseFloat(latitude);
        points[index].location.longitude = parseFloat(longitude);
        await AsyncStorage.setItem("interestPoints", JSON.stringify(points));
        Alert.alert("Success", "Point updated successfully.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error saving point:", error);
      Alert.alert("Error", "There was an error updating the point.");
    }
  };
  const movePoint = (direction) => {
    const distance = 0.0001; // Přibližně 11 metrů
    switch (direction) {
      case "north":
        setLatitude((parseFloat(latitude) + distance).toString());
        break;
      case "south":
        setLatitude((parseFloat(latitude) - distance).toString());
        break;
      case "east":
        setLongitude((parseFloat(longitude) + distance).toString());
        break;
      case "west":
        setLongitude((parseFloat(longitude) - distance).toString());
        break;
      default:
        break;
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />
        <Text style={styles.label}>Detailed Description:</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={detailedDescription}
          onChangeText={setDetailedDescription}
          multiline
        />
        <Text style={styles.label}>
          Latitude: {latitude || "Not available"}
        </Text>
        <Text style={styles.label}>
          Longitude: {longitude || "Not available"}
        </Text>
        <View style={styles.buttonContainer}>
          <Button title="Move North" onPress={() => movePoint("north")} />
          <Button title="Move South" onPress={() => movePoint("south")} />
          <Button title="Move East" onPress={() => movePoint("east")} />
          <Button title="Move West" onPress={() => movePoint("west")} />
        </View>
        {point.image && (
          <Image source={{ uri: point.image }} style={styles.image} />
        )}
        <Button title="Save" onPress={handleSave} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    padding: 16,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 16,
    alignSelf: "center",
  },
});
