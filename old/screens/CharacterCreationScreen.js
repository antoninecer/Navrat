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
import AsyncStorage from "@react-native-async-storage/async-storage"; // Správný import
import Races from "../data/Races";
import CharacterClasses from "../data/CharacterClasses";
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
    setSelectedRace(race);
    setCharacterAttributes({
      ...characterAttributes,
      strength: race.strength,
      defense: race.defense,
      attack: race.attack,
      speed: race.speed,
      luck: race.luck,
      courage: race.courage,
    });
    setIsSelectingRace(false);
    setIsSelectingGender(true);
    setModalVisible(false);
  };
  const handleSelectGender = (gender) => {
    setSelectedGender(gender);
    const genderModifier =
      gender === "Female" ? { strength: -1, speed: 1 } : {};
    setCharacterAttributes({
      ...characterAttributes,
      strength: characterAttributes.strength + (genderModifier.strength || 0),
      speed: characterAttributes.speed + (genderModifier.speed || 0),
    });
    setIsSelectingGender(false);
    setIsSelectingClass(true);
    setModalVisible(false);
  };
  const handleSelectClass = (characterClass) => {
    setSelectedClass(characterClass);
    const classAttributes = CharacterClasses[characterClass];
    setCharacterAttributes({
      ...characterAttributes,
      strength: characterAttributes.strength + classAttributes.strength,
      defense: characterAttributes.defense + classAttributes.defense,
      attack: characterAttributes.attack + classAttributes.attack,
      speed: characterAttributes.speed + classAttributes.speed,
      mana: characterAttributes.mana + classAttributes.mana,
      health: characterAttributes.health + classAttributes.health,
    });
    setIsSelectingClass(false);
    setModalVisible(false);
  };
  const handleSaveCharacter = async () => {
    if (!selectedRace || !selectedGender || !selectedClass) {
      alert("Please select a race, gender, and class.");
      return;
    }
    const newCharacter = {
      name,
      race: selectedRace.name,
      gender: selectedGender,
      characterClass: selectedClass,
      ...characterAttributes,
    };
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
