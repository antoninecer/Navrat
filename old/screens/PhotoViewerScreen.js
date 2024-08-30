import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import styles from "../components/styles"; // Import stylů
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons"; // Import ikon
export default function PhotoViewerScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [points, setPoints] = useState([]);
  const [imageExists, setImageExists] = useState(true);
  useEffect(() => {
    const loadPoints = async () => {
      const storedPoints = await AsyncStorage.getItem("interestPoints");
      if (storedPoints) {
        const parsedPoints = JSON.parse(storedPoints);
        setPoints(parsedPoints);
        console.log("Loaded points:", parsedPoints);
      }
    };
    loadPoints();
  }, []);
  useEffect(() => {
    const checkImage = async () => {
      if (
        points.length > 0 &&
        points[currentIndex] &&
        points[currentIndex].image
      ) {
        const fileInfo = await FileSystem.getInfoAsync(
          points[currentIndex].image
        );
        console.log("Current image info:", fileInfo);
        if (!fileInfo.exists) {
          console.error("Image does not exist:", points[currentIndex].image);
          setImageExists(false);
        } else {
          console.log(
            "Image exists and will be displayed:",
            points[currentIndex].image
          );
          setImageExists(true);
        }
      }
    };
    checkImage();
  }, [currentIndex, points]);
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % points.length);
  };
  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + points.length) % points.length
    );
  };
  const handleDelete = async () => {
    Alert.alert(
      "Delete Point",
      "Are you sure you want to delete this point and its photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            const updatedPoints = [...points];
            const [removedPoint] = updatedPoints.splice(currentIndex, 1);
            // Remove the image file from the file system if it exists
            if (removedPoint.image) {
              try {
                await FileSystem.deleteAsync(removedPoint.image);
                console.log("Image deleted:", removedPoint.image);
              } catch (error) {
                console.error("Error deleting image:", error);
              }
            }
            setPoints(updatedPoints);
            await AsyncStorage.setItem(
              "interestPoints",
              JSON.stringify(updatedPoints)
            );
            // If the last point was deleted, go back to the previous screen
            if (updatedPoints.length === 0) {
              navigation.goBack();
            } else if (currentIndex === updatedPoints.length) {
              setCurrentIndex(currentIndex - 1);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  if (points.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No interest points found.</Text>
        <View style={styles.buttonContainer}>
          <Button title="Back" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }
  const currentPoint = points[currentIndex];
  return (
    <View style={styles.container}>
      {/* Přidání šipek nad fotkou */}
      <View style={localStyles.navigationContainer}>
        <TouchableOpacity
          onPress={handlePrevious}
          style={localStyles.navButton}
        >
          <Ionicons name="chevron-back-circle" size={30} color="black" />
          <Text style={localStyles.navText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={localStyles.navButton}>
          <Text style={localStyles.navText}>Next</Text>
          <Ionicons name="chevron-forward-circle" size={30} color="black" />
        </TouchableOpacity>
      </View>
      {imageExists ? (
        <Image source={{ uri: currentPoint.image }} style={localStyles.image} />
      ) : (
        <Text>No image available</Text>
      )}
      <Text style={styles.text}>Description: {currentPoint.description}</Text>
      <Text style={styles.text}>
        Location: {currentPoint.location.latitude},{" "}
        {currentPoint.location.longitude}
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Delete Point" onPress={handleDelete} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="View on Map"
          onPress={() =>
            navigation.navigate("DynamicMap", {
              selectedPoint: currentPoint,
              zoom: 15,
            })
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Edit Point"
          onPress={() =>
            navigation.navigate("Edit Point", { point: currentPoint })
          }
        />
      </View>
    </View>
  );
}
// Lokální stylování pro šipky a obrázek
const localStyles = StyleSheet.create({
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Rozmístí šipky do krajů
    alignItems: "center",
    marginBottom: 10, // Přidání mezery mezi šipkami a fotkou
    width: "100%",
    paddingHorizontal: 20, // Odsazení od okrajů obrazovky
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  navText: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: 10,
  },
});
