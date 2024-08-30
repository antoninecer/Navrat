import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function CharacterSettingsScreen({ navigation }) {
  const [name, setName] = useState("");
  const [characterClass, setCharacterClass] = useState("Warrior");
  const [characterList, setCharacterList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    loadCharacters();
  }, []);
  const loadCharacters = async () => {
    try {
      const storedCharacters = await AsyncStorage.getItem("characters");
      if (storedCharacters) {
        setCharacterList(JSON.parse(storedCharacters));
      }
    } catch (error) {
      console.error("Failed to load characters", error);
    }
  };
  const saveCharacter = async () => {
    try {
      const newCharacter = { name, characterClass };
      const updatedCharacterList = [...characterList, newCharacter];
      setCharacterList(updatedCharacterList);
      await AsyncStorage.setItem(
        "characters",
        JSON.stringify(updatedCharacterList)
      );
      Alert.alert("Success", "Character saved!");
    } catch (error) {
      console.error("Failed to save character", error);
      Alert.alert("Error", "Failed to save character");
    }
  };
  const deleteCharacter = async (index) => {
    try {
      const updatedCharacterList = characterList.filter((_, i) => i !== index);
      setCharacterList(updatedCharacterList);
      await AsyncStorage.setItem(
        "characters",
        JSON.stringify(updatedCharacterList)
      );
      Alert.alert("Success", "Character deleted!");
    } catch (error) {
      console.error("Failed to delete character", error);
      Alert.alert("Error", "Failed to delete character");
    }
  };
  const characterClasses = ["Warrior", "Mage", "Rogue"]; // Přidat další třídy podle potřeby
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Character Settings</Text>
      <TextInput
        style={styles.input}
        placeholder="Character Name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Class</Text>
      <TouchableOpacity
        style={styles.picker}
        onPress={() => setModalVisible(true)}
      >
        <Text>{characterClass}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          {characterClasses.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.modalItem}
              onPress={() => {
                setCharacterClass(item);
                setModalVisible(false);
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
      <Button title="Save Character" onPress={saveCharacter} />
      {characterList.length > 0 && (
        <View style={styles.characterList}>
          <Text style={styles.label}>Your Characters:</Text>
          {characterList.map((character, index) => (
            <View key={index} style={styles.characterItem}>
              <Text>
                {character.name} - {character.characterClass}
              </Text>
              <Button title="Delete" onPress={() => deleteCharacter(index)} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
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
  characterList: {
    marginTop: 20,
  },
  characterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});
