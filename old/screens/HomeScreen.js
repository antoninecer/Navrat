import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, ImageBackground } from "react-native";
import styles from "../components/styles"; // Importování stylů
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function HomeScreen({ navigation }) {
  const [returnPointSet, setReturnPointSet] = useState(false);
  const [characterSummary, setCharacterSummary] = useState(null);
  useFocusEffect(
    React.useCallback(() => {
      checkReturnPoint();
      loadCharacterSummary();
    }, [])
  );
  const checkReturnPoint = async () => {
    try {
      const returnPoint = await AsyncStorage.getItem("returnPoint");
      setReturnPointSet(!!returnPoint);
    } catch (error) {
      console.error("Error reading return point from AsyncStorage:", error);
      setReturnPointSet(false);
    }
  };
  const loadCharacterSummary = async () => {
    try {
      const storedCharacter = await AsyncStorage.getItem("characters");
      if (storedCharacter) {
        const character = JSON.parse(storedCharacter)[0]; // Zobrazí se první postava
        setCharacterSummary({
          name: character.name,
          race: character.race,
          gender: character.gender || "", // Pokud není gender definován, nastaví se na prázdný řetězec
          characterClass: character.characterClass,
          level: character.level || 1,
        });
      }
    } catch (error) {
      console.error("Failed to load character summary", error);
    }
  };
  const setReturnPoint = async () => {
    showConfirmationDialog(
      "Set Return Point?",
      "Do you really want to set this location as your return point?",
      async () => {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permission Denied", "Access to location was denied.");
            return;
          }
          let currentLocation = await Location.getCurrentPositionAsync({});
          const returnPoint = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            title: "Return Point",
          };
          await AsyncStorage.setItem(
            "returnPoint",
            JSON.stringify(returnPoint)
          );
          console.log("Return point saved:", returnPoint);
          setReturnPointSet(true);
          Alert.alert("Saved", "Return point successfully saved!");
          navigation.navigate("Home");
        } catch (error) {
          console.error("Error setting return point:", error);
          Alert.alert("Error", "There was an error setting the return point.");
        }
      }
    );
  };
  const showConfirmationDialog = (title, message, onConfirm) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: onConfirm,
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <ImageBackground
      source={require("../assets/return.png")}
      style={styles.container}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: "#fff", fontSize: 28 }]}>
          Explore, Capture, and Never Get Lost Again
        </Text>
        <Text style={[styles.subtitle, { color: "#fff", fontSize: 20 }]}>
          Your personal map for mushroom hunting and other adventures
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Set Return Point"
          onPress={setReturnPoint}
          disabled={returnPointSet}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Record Interest Point"
          onPress={() => navigation.navigate("Interest Point")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Actions"
          onPress={() => navigation.navigate("Actions Menu")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="View Map"
          onPress={() => navigation.navigate("DynamicMap")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="View Photos"
          onPress={() => navigation.navigate("Photo Viewer")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Settings"
          onPress={() => navigation.navigate("Settings")}
        />
      </View>
      {/* Zobrazení souhrnu postavy */}
      {characterSummary && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: "#fff", fontSize: 18, textAlign: "center" }}>
            {characterSummary.name} {characterSummary.race}{" "}
            {characterSummary.gender ? characterSummary.gender.charAt(0) : ""}{" "}
            {characterSummary.characterClass} Lvl {characterSummary.level}
          </Text>
        </View>
      )}
    </ImageBackground>
  );
}
