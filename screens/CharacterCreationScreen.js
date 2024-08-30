import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Races } from "../data/Races"; // Opravený import ras
import CharacterClasses from "../data/CharacterClasses"; // Import tříd
import CharacterAttributes from "../data/CharacterAttributes"; // Import atributů
import Character from "../models/Character"; // Import modelu postavy

const CharacterCreationScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSelectingRace, setIsSelectingRace] = useState(true);
  const [isSelectingGender, setIsSelectingGender] = useState(false);
  const [isSelectingClass, setIsSelectingClass] = useState(false);
  const [characterAttributes, setCharacterAttributes] = useState({
    strength: 0,
    defense: 0,
    attack: 0,
    speed: 0,
    luck: 0,
    courage: 0,
    mana: 50,
    health: 100,
    level: 1, // Nastavujeme počáteční úroveň postavy
  });

  const handleSelectRace = (race) => {
    if (!race) {
      console.error("Invalid race selected.");
      return;
    }
    setSelectedRace(race);
    setCharacterAttributes({
      strength: race.attributeModifiers.strength || 0,
      defense: race.attributeModifiers.defense || 0,
      attack: race.attributeModifiers.attack || 0,
      speed: race.attributeModifiers.speed || 0,
      luck: race.attributeModifiers.luck || 0,
      courage: race.attributeModifiers.courage || 0,
      magic: race.attributeModifiers.magic || 0,
      mana: 50, // Resetovat mana na základní hodnotu
      health: 100, // Resetovat zdraví na základní hodnotu
      level: 1,
    });
    setIsSelectingRace(false);
    setIsSelectingGender(true);
    setModalVisible(false);
  };

  const handleSelectGender = (gender) => {
    setSelectedGender(gender);
    const genderModifier = CharacterAttributes.genderModifiers[gender] || {};

    // Resetuj hodnoty atributů na základní hodnoty podle vybrané rasy
    const baseAttributes = { ...selectedRace.attributeModifiers };

    // Přičti modifikátory pohlaví
    setCharacterAttributes((prevAttributes) => ({
      strength: baseAttributes.strength + (genderModifier.strength || 0),
      defense: baseAttributes.defense + (genderModifier.defense || 0),
      attack: baseAttributes.attack + (genderModifier.attack || 0),
      speed: baseAttributes.speed + (genderModifier.speed || 0),
      luck: baseAttributes.luck + (genderModifier.luck || 0),
      courage: baseAttributes.courage + (genderModifier.courage || 0),
      magic: baseAttributes.magic + (genderModifier.magic || 0),
      mana: prevAttributes.mana, // Udržet aktuální hodnoty many
      health: prevAttributes.health, // Udržet aktuální hodnoty zdraví
      level: prevAttributes.level,
    }));

    setIsSelectingGender(false);
    setIsSelectingClass(true);
    setModalVisible(false);
  };

  const handleSelectClass = (characterClass) => {
    setSelectedClass(characterClass);
    const classAttributes = CharacterClasses[characterClass];

    // Resetuj hodnoty atributů na základní hodnoty podle vybrané rasy a pohlaví
    const baseAttributes = {
      strength: characterAttributes.strength - (classAttributes.strength || 0),
      defense: characterAttributes.defense - (classAttributes.defense || 0),
      attack: characterAttributes.attack - (classAttributes.attack || 0),
      speed: characterAttributes.speed - (classAttributes.speed || 0),
      luck: characterAttributes.luck - (classAttributes.luck || 0),
      courage: characterAttributes.courage - (classAttributes.courage || 0),
      magic: characterAttributes.magic - (classAttributes.magic || 0),
      mana: characterAttributes.mana,
      health: characterAttributes.health,
      level: characterAttributes.level,
    };

    // Přičti modifikátory povolání
    setCharacterAttributes({
      ...baseAttributes,
      strength: baseAttributes.strength + (classAttributes.strength || 0),
      defense: baseAttributes.defense + (classAttributes.defense || 0),
      attack: baseAttributes.attack + (classAttributes.attack || 0),
      speed: baseAttributes.speed + (classAttributes.speed || 0),
      luck: baseAttributes.luck + (classAttributes.luck || 0),
      courage: baseAttributes.courage + (classAttributes.courage || 0),
      magic: baseAttributes.magic + (classAttributes.magic || 0),
      mana: baseAttributes.mana,
      health: baseAttributes.health,
      level: baseAttributes.level,
    });

    setIsSelectingClass(false);
    setModalVisible(false);
  };

  const handleSaveCharacter = async () => {
    if (!selectedRace || !selectedGender || !selectedClass) {
      alert("Please select a race, gender, and class.");
      return;
    }

    const newCharacter = new Character(
      name,
      selectedRace.name, // Přenese jméno rasy
      selectedClass,
      selectedGender,
      [], // naturalTalents
      [], // abilities
      [] // inventory
    );

    try {
      const storedCharacters = await AsyncStorage.getItem("characters");
      const characters = storedCharacters ? JSON.parse(storedCharacters) : [];
      characters.push(newCharacter);
      await AsyncStorage.setItem("characters", JSON.stringify(characters));
      navigation.navigate("CharacterSelection");
    } catch (error) {
      console.error("Failed to save character", error);
      alert("There was an error saving the character.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.label}>Character Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter character name"
        />
        <View style={styles.buttonSpacing}>
          <Button
            title="Select Race"
            onPress={() => {
              setIsSelectingRace(true);
              setModalVisible(true);
            }}
          />
        </View>
        {selectedRace && (
          <>
            <View style={styles.detailsContainer}>
              <Text>Selected Race: {selectedRace.name}</Text>
              <Text>Description: {selectedRace.description}</Text>
              <Text>Strength: {characterAttributes.strength}</Text>
              <Text>Defense: {characterAttributes.defense}</Text>
              <Text>Attack: {characterAttributes.attack}</Text>
              <Text>Speed: {characterAttributes.speed}</Text>
              <Text>Luck: {characterAttributes.luck}</Text>
              <Text>Courage: {characterAttributes.courage}</Text>
              <Text>Health: {characterAttributes.health}</Text>
              <Text>Mana: {characterAttributes.mana}</Text>
            </View>
            <View style={styles.buttonSpacing}>
              <Button
                title="Select Gender"
                onPress={() => {
                  setIsSelectingGender(true);
                  setModalVisible(true);
                }}
              />
            </View>
          </>
        )}
        {selectedGender && (
          <>
            <View style={styles.detailsContainer}>
              <Text>Selected Gender: {selectedGender}</Text>
            </View>
            <View style={styles.buttonSpacing}>
              <Button
                title="Select Class"
                onPress={() => {
                  setIsSelectingClass(true);
                  setModalVisible(true);
                }}
              />
            </View>
          </>
        )}
        {selectedClass && (
          <View style={styles.detailsContainer}>
            <Text>Selected Class: {selectedClass}</Text>
          </View>
        )}
        <View style={styles.buttonSpacing}>
          <Button title="Save Character" onPress={handleSaveCharacter} />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            {isSelectingRace
              ? Object.values(Races).map((race) => (
                  <TouchableOpacity
                    key={race.name}
                    style={styles.modalItem}
                    onPress={() => handleSelectRace(race)}
                  >
                    <Text>{race.name}</Text>
                  </TouchableOpacity>
                ))
              : isSelectingGender
              ? ["Male", "Female"].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={styles.modalItem}
                    onPress={() => handleSelectGender(gender)}
                  >
                    <Text>{gender}</Text>
                  </TouchableOpacity>
                ))
              : Object.keys(CharacterClasses).map((characterClass) => (
                  <TouchableOpacity
                    key={characterClass}
                    style={styles.modalItem}
                    onPress={() => handleSelectClass(characterClass)}
                  >
                    <Text>{characterClass}</Text>
                  </TouchableOpacity>
                ))}
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

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
  detailsContainer: {
    marginTop: 16,
  },
  buttonSpacing: {
    marginVertical: 10,
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

export default CharacterCreationScreen;
