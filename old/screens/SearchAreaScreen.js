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
export default function SearchAreaScreen({ navigation }) {
  const [foundObjects, setFoundObjects] = useState([]);
  const [character, setCharacter] = useState(null); // Přidáme state pro charakter
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
            ) <= 5
        );
        if (nearbyObjects.length > 0) {
          setFoundObjects(nearbyObjects);
        } else {
          setFoundObjects([]);
        }
        // Použití stejné logiky pro nalezení aktivní postavy
        const storedCharacters = await AsyncStorage.getItem("characters");
        if (storedCharacters) {
          const characters = JSON.parse(storedCharacters);
          const activeCharacter = characters.find((char) => char.isActive);
          if (activeCharacter) {
            setCharacter(activeCharacter); // Uložení aktivní postavy do stavu
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
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radius of the Earth in meters
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
  const handleSaveToInventory = async (object) => {
    try {
      if (!character) {
        console.log("Character not found in handleSaveToInventory");
        throw new Error(
          "No character found. Please select or create a character."
        );
      }
      const storedInventory = await AsyncStorage.getItem("inventory");
      const inventory = storedInventory ? JSON.parse(storedInventory) : [];
      // Ujistěte se, že character.inventory existuje a je inicializován
      if (!character.inventory) {
        character.inventory = {};
      }
      // Ujistěte se, že podvlastnost 'hands' existuje a je inicializována
      if (!character.inventory.hands) {
        character.inventory.hands = [null, null];
      }
      const currentWeapon = character.inventory.hands[0]; // Assuming main hand
      const currentArmor = character.inventory.body;
      let shouldOfferSwap = false;
      if (
        object.type === "weapon" &&
        (!currentWeapon ||
          object.properties.attackPoints >
            currentWeapon.properties.attackPoints)
      ) {
        shouldOfferSwap = true;
      } else if (
        object.type === "armor" &&
        (!currentArmor ||
          object.properties.defensePoints >
            currentArmor.properties.defensePoints)
      ) {
        shouldOfferSwap = true;
      }
      if (shouldOfferSwap) {
        Alert.alert(
          "New item found!",
          `Hmm, this ${object.name} seems better than my current equipment. Should I equip it?`,
          [
            { text: "No, keep current equipment", style: "cancel" },
            {
              text: "Yes, equip it",
              onPress: async () => {
                // Move current item to general inventory
                if (object.type === "weapon" && currentWeapon) {
                  currentWeapon.equipped = false;
                  inventory.push(currentWeapon);
                } else if (object.type === "armor" && currentArmor) {
                  currentArmor.equipped = false;
                  inventory.push(currentArmor);
                }
                // Equip new item
                object.equipped = true;
                inventory.push(object);
                character.inventory.hands[0] = object; // Example of equipping a weapon
                await AsyncStorage.setItem(
                  "inventory",
                  JSON.stringify(inventory)
                );
                await AsyncStorage.setItem(
                  "activeCharacter",
                  JSON.stringify(character)
                );
                // Remove the object from placedObjects in AsyncStorage
                const storedObjects = await AsyncStorage.getItem(
                  "placedObjects"
                );
                let placedObjects = storedObjects
                  ? JSON.parse(storedObjects)
                  : [];
                // Filter out the object that has been picked up
                placedObjects = placedObjects.filter(
                  (obj) =>
                    obj.name !== object.name ||
                    obj.location.latitude !== object.location.latitude ||
                    obj.location.longitude !== object.location.longitude
                );
                // Update placedObjects in AsyncStorage
                await AsyncStorage.setItem(
                  "placedObjects",
                  JSON.stringify(placedObjects)
                );
                // Update the state to remove the object from the UI
                setFoundObjects(placedObjects);
                alert(
                  `${object.name} equipped, saved to inventory, and removed from the map!`
                );
              },
            },
          ]
        );
      } else {
        // Standard inventory save logic
        inventory.push(object);
        await AsyncStorage.setItem("inventory", JSON.stringify(inventory));
        // Remove the object from placedObjects in AsyncStorage
        const storedObjects = await AsyncStorage.getItem("placedObjects");
        let placedObjects = storedObjects ? JSON.parse(storedObjects) : [];
        // Filter out the object that has been picked up
        placedObjects = placedObjects.filter(
          (obj) =>
            obj.name !== object.name ||
            obj.location.latitude !== obj.location.latitude ||
            obj.location.longitude !== obj.location.longitude
        );
        // Update placedObjects in AsyncStorage
        await AsyncStorage.setItem(
          "placedObjects",
          JSON.stringify(placedObjects)
        );
        // Update the state to remove the object from the UI
        setFoundObjects(placedObjects);
        alert(`${object.name} saved to inventory and removed from the map!`);
      }
    } catch (error) {
      console.error("Error saving to inventory:", error);
      alert("There was an error saving the object to your inventory.");
    }
  };
  const handleEnterDungeon = (dungeon) => {
    navigation.navigate("DungeonScreen", { dungeon });
  };
  const handleUnlockObject = async (lockObject) => {
    try {
      const storedInventory = await AsyncStorage.getItem("inventory");
      const inventory = storedInventory ? JSON.parse(storedInventory) : [];
      const hasKey = inventory.some(
        (item) => item.type === "key" && item.unlocks === lockObject.name
      );
      if (hasKey) {
        alert(`${lockObject.name} unlocked!`);
        // Implement your unlock logic here
      } else {
        alert(`You need a key to unlock ${lockObject.name}.`);
      }
    } catch (error) {
      console.error("Error unlocking object:", error);
      alert("There was an error unlocking the object.");
    }
  };
  const handleSaveToBook = async (object) => {
    try {
      const storedEntries = await AsyncStorage.getItem("bookEntries");
      const bookEntries = storedEntries ? JSON.parse(storedEntries) : [];
      bookEntries.push(object);
      await AsyncStorage.setItem("bookEntries", JSON.stringify(bookEntries));
      alert(`${object.name} saved to your book!`);
    } catch (error) {
      console.error("Error saving to book:", error);
      alert("There was an error saving the object to your book.");
    }
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
                {object.type === "dungeon" ? (
                  <Button
                    title="Enter Dungeon"
                    onPress={() => handleEnterDungeon(object)}
                  />
                ) : object.type === "lock" ? (
                  <Button
                    title="Unlock"
                    onPress={() => handleUnlockObject(object)}
                  />
                ) : object.type === "sign" ? (
                  <Button
                    title="Save to Book"
                    onPress={() => handleSaveToBook(object)}
                  />
                ) : (
                  <Button
                    title="Save to Inventory"
                    onPress={() => handleSaveToInventory(object)}
                  />
                )}
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
