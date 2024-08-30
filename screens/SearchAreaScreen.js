import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Character from "../models/Character";
import Book from "../models/Book"; // Import knihy
import { standardItems } from "../data/standardItems";

function SearchAreaScreen({ navigation }) {
  const [foundObjects, setFoundObjects] = useState([]);
  const [character, setCharacter] = useState(null);

  // Funkce na výpočet vzdálenosti mezi dvěma body (v metrech)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Poloměr Země v metrech
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon1 - lon2) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const searchArea = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access location was denied");
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        const storedObjects = await AsyncStorage.getItem("placedObjects");
        const placedObjects = storedObjects ? JSON.parse(storedObjects) : [];
        const nearbyObjects = placedObjects.filter(
          (obj) =>
            getDistance(
              obj.location.latitude,
              obj.location.longitude,
              location.coords.latitude,
              location.coords.longitude
            ) <= 10 // Hledání v okruhu 10 metrů
        );
        setFoundObjects(nearbyObjects);

        const storedCharacters = await AsyncStorage.getItem("characters");
        if (storedCharacters) {
          const characters = JSON.parse(storedCharacters);
          const activeCharacter = characters.find((char) => char.isActive);
          if (activeCharacter) {
            setCharacter(
              new Character(
                activeCharacter.name,
                activeCharacter.race,
                activeCharacter.characterClass
              )
            );
            console.log("Active character loaded:", activeCharacter);
          } else {
            Alert.alert(
              "No active character",
              "Please select or create a character."
            );
            navigation.goBack();
          }
        } else {
          Alert.alert(
            "No characters found",
            "Please create a character first."
          );
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error searching area or loading character:", error);
      }
    };
    searchArea();
  }, []);

  const handleActionButtonPress = async (object) => {
    try {
      if (!character) {
        console.log("Character not found in handleActionButtonPress");
        throw new Error(
          "No character found. Please select or create a character."
        );
      }

      if (object.slot === "special") {
        if (object.type === "dungeon") {
          navigation.navigate("DungeonScreen", { dungeon: object });
        } else if (object.type === "inscription") {
          const book = new Book();
          const storedEntries = await AsyncStorage.getItem("bookEntries");
          const entries = storedEntries ? JSON.parse(storedEntries) : [];
          book.entries = entries;

          // Kontrola, zda již zápis existuje
          const existingEntry = book.entries.find(
            (entry) => entry.name === object.name
          );

          if (!existingEntry) {
            book.addEntry(object);
            await AsyncStorage.setItem(
              "bookEntries",
              JSON.stringify(book.getEntries())
            );
            console.log("New inscription added to the book:", object);
          } else {
            console.log("Inscription already exists in the book:", object);
          }
        }
        return;
      }

      // Přidání předmětu do inventáře bez kontroly na duplicity
      character.inventory.push(object);
      console.log("Added item to inventory:", object);

      // Uložit aktualizovaný charakter do AsyncStorage
      await AsyncStorage.setItem("activeCharacter", JSON.stringify(character));

      // Odstranění předmětu z mapy
      const storedObjects = await AsyncStorage.getItem("placedObjects");
      let placedObjects = storedObjects ? JSON.parse(storedObjects) : [];
      placedObjects = placedObjects.filter(
        (obj) =>
          !(
            obj.name === object.name &&
            obj.location.latitude === object.location.latitude &&
            obj.location.longitude === object.location.longitude
          )
      );
      await AsyncStorage.setItem(
        "placedObjects",
        JSON.stringify(placedObjects)
      );
      setFoundObjects(placedObjects);
      console.log("Item removed from map:", object);
    } catch (error) {
      console.error("Error handling action button press:", error);
      Alert.alert("There was an error processing the action.");
    }
  };

  const getActionButtonTitle = (object) => {
    if (object.slot === "special") {
      if (object.type === "dungeon") {
        return "Enter Dungeon";
      } else if (object.type === "inscription") {
        return "Add to Book";
      }
    }
    return "Save to Inventory";
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {character && (
          <View style={styles.characterContainer}>
            <Text style={styles.characterName}>
              Active Character: {character.name}
            </Text>
            <Text>Class: {character.characterClass}</Text>
            <Text>Level: {character.level}</Text>
          </View>
        )}
        {foundObjects.length > 0 ? (
          <ScrollView>
            {foundObjects.map((object, index) => (
              <View key={index} style={styles.objectContainer}>
                <Text style={styles.label}>You found:</Text>
                <Text style={styles.objectName}>{object.name}</Text>
                <Text style={styles.objectDescription}>
                  {object.description}
                </Text>
                <Button
                  title={getActionButtonTitle(object)}
                  onPress={() => handleActionButtonPress(object)}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.label}>Nothing found in the area.</Text>
        )}
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  characterContainer: {
    marginBottom: 20,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
  },
  characterName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  objectContainer: {
    marginBottom: 20,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  objectName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  objectDescription: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default SearchAreaScreen;
