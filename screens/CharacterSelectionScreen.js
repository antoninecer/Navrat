import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const CharacterSelectionScreen = ({ navigation }) => {
  const [characters, setCharacters] = useState([]);
  const [activeCharacter, setActiveCharacter] = useState(null);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadCharacters();
    });
    return unsubscribe;
  }, [navigation]);
  const loadCharacters = async () => {
    try {
      const storedCharacters = await AsyncStorage.getItem("characters");
      if (storedCharacters) {
        const parsedCharacters = JSON.parse(storedCharacters);
        setCharacters(parsedCharacters);
        const activeChar = parsedCharacters.find((char) => char.isActive);
        setActiveCharacter(activeChar);
      }
    } catch (error) {
      console.error("Failed to load characters", error);
    }
  };
  const selectCharacter = async (character) => {
    // Označení vybrané postavy jako aktivní
    const updatedCharacters = characters.map((char) => ({
      ...char,
      isActive: char.name === character.name,
    }));
    setCharacters(updatedCharacters);
    await AsyncStorage.setItem("characters", JSON.stringify(updatedCharacters));
    setActiveCharacter(character);
    console.log("Selected character:", character);
    navigation.navigate("CharacterDetail", { character }); // Předání vybrané postavy do CharacterDetailScreen
  };
  const createCharacter = () => {
    // Přesměrování na obrazovku pro vytvoření postavy
    navigation.navigate("CharacterCreation");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Character</Text>
      {characters.length > 0 ? (
        <FlatList
          data={characters}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.characterItem,
                item.isActive && styles.activeCharacterItem,
              ]}
              onPress={() => selectCharacter(item)}
            >
              <Text>
                {item.name} - {item.characterClass}{" "}
                {item.isActive ? "(Active)" : ""}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noCharacterContainer}>
          <Text style={styles.noCharacterText}>No characters found.</Text>
          <Button title="Create Character" onPress={createCharacter} />
        </View>
      )}
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};
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
  characterItem: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
  },
  activeCharacterItem: {
    backgroundColor: "#d0f0c0", // Zelenější barva pro označení aktivní postavy
  },
  noCharacterContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noCharacterText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
export default CharacterSelectionScreen;
