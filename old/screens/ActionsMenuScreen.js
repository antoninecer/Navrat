import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import styles from "../components/styles";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function ActionsMenuScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [characterExists, setCharacterExists] = useState(false);
  useEffect(() => {
    const checkCharacter = async () => {
      try {
        const storedCharacters = await AsyncStorage.getItem("characters");
        console.log("Stored characters:", storedCharacters);
        if (storedCharacters) {
          const characters = JSON.parse(storedCharacters);
          const activeCharacter = characters.find((char) => char.isActive);
          setCharacterExists(!!activeCharacter);
          console.log("Active character exists:", !!activeCharacter);
        } else {
          setCharacterExists(false);
        }
      } catch (error) {
        console.error("Error checking character:", error);
      }
    };
    const updateLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    };
    checkCharacter();
    const intervalId = setInterval(updateLocation, 2000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actions</Text>
      {location ? (
        <Text style={styles.coords}>
          Latitude: {location.latitude.toFixed(6)}
          {"\n"}
          Longitude: {location.longitude.toFixed(6)}
        </Text>
      ) : (
        <Text style={styles.coords}>Loading GPS coordinates...</Text>
      )}
      <View style={styles.buttonContainer}>
        <Button
          title="Place Object"
          onPress={() => navigation.navigate("Place Object")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Search Area"
          onPress={() => navigation.navigate("Search Area")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="View Inventory"
          onPress={() => navigation.navigate("Inventory")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="View Tasks"
          onPress={() => navigation.navigate("Tasks")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={characterExists ? "Select Character" : "Create Character"}
          onPress={() => navigation.navigate("CharacterSelection")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}
