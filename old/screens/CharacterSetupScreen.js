import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Races from "../data/Races";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Character from "../models/Character";
export default function CharacterSetupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [characterClass, setCharacterClass] = useState("Warrior");
  const [selectedRace, setSelectedRace] = useState("Human");
  const [raceModalVisible, setRaceModalVisible] = useState(false); // Samostatný stav pro modální okno rasy
  const [classModalVisible, setClassModalVisible] = useState(false); // Samostatný stav pro modální okno povolání
  const characterClasses = ["Warrior", "Mage", "Rogue"];
  const raceNames = Object.keys(Races);
  const handleSaveCharacter = async () => {
    const newCharacter = new Character(
      name,
      selectedRace,
      characterClass,
      [], // Natural talents
      [], // Abilities
      [] // Inventory
    );
    try {
      const storedCharacters = await AsyncStorage.getItem("characters");
      const characters = storedCharacters ? JSON.parse(storedCharacters) : [];
      characters.push(newCharacter);
      await AsyncStorage.setItem("characters", JSON.stringify(characters));
      alert("Character created successfully!");
      navigation.navigate("CharacterSelection");
    } catch (error) {
      console.error("Failed to save character", error);
      alert("There was an error saving the character.");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Character Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter character name"
      />
      <Text style={styles.label}>Race:</Text>
      <TouchableOpacity
        style={styles.picker}
        onPress={() => setRaceModalVisible(true)} // Zobrazení modálního okna rasy
      >
        <Text>{selectedRace}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={raceModalVisible}
        onRequestClose={() => setRaceModalVisible(!raceModalVisible)}
      >
        <View style={styles.modalView}>
          {raceNames.map((race) => (
            <TouchableOpacity
              key={race}
              style={styles.modalItem}
              onPress={() => {
                setSelectedRace(race);
                setRaceModalVisible(false);
              }}
            >
              <Text>{race}</Text>
            </TouchableOpacity>
          ))}
          <Button title="Cancel" onPress={() => setRaceModalVisible(false)} />
        </View>
      </Modal>
      <Text style={styles.label}>Character Class:</Text>
      <TouchableOpacity
        style={styles.picker}
        onPress={() => setClassModalVisible(true)} // Zobrazení modálního okna povolání
      >
        <Text>{characterClass}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={classModalVisible}
        onRequestClose={() => setClassModalVisible(!classModalVisible)}
      >
        <View style={styles.modalView}>
          {characterClasses.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.modalItem}
              onPress={() => {
                setCharacterClass(item);
                setClassModalVisible(false);
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
          <Button title="Cancel" onPress={() => setClassModalVisible(false)} />
        </View>
      </Modal>
      <Button title="Save Character" onPress={handleSaveCharacter} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  picker: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
    textAlign: "center",
  },
});
