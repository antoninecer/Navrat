import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { equipItem } from "../utils/equipItem"; // Ujisti se, že tento import směřuje na správný soubor
export default function InventoryScreen({ navigation, character }) {
  // Předpokládám, že character je předáván jako prop
  const [inventory, setInventory] = useState([]);
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const storedInventory = await AsyncStorage.getItem("inventory");
        setInventory(storedInventory ? JSON.parse(storedInventory) : []);
      } catch (error) {
        console.error("Error loading inventory:", error);
      }
    };
    loadInventory();
  }, []);
  const handleUseItem = (item) => {
    Alert.alert("Use Item", `You used ${item.name}`);
    // Zde můžete implementovat logiku pro použití předmětu
  };
  const handleRemoveItem = (item) => {
    Alert.alert(
      "Odstraň z inventáře",
      `Opravdu chcete odstranit ${item.name}?`,
      [
        { text: "Zrušit", style: "cancel" },
        {
          text: "Odstraň z inventáře",
          onPress: async () => {
            const newInventory = inventory.filter(
              (invItem) => invItem.name !== item.name
            );
            setInventory(newInventory);
            await AsyncStorage.setItem(
              "inventory",
              JSON.stringify(newInventory)
            );
            // Get the current location of the player
            const location = await Location.getCurrentPositionAsync({});
            // Add the object back to placedObjects at the current location
            const storedObjects = await AsyncStorage.getItem("placedObjects");
            const placedObjects = storedObjects
              ? JSON.parse(storedObjects)
              : [];
            const discardedObject = {
              ...item,
              location: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              },
            };
            placedObjects.push(discardedObject);
            await AsyncStorage.setItem(
              "placedObjects",
              JSON.stringify(placedObjects)
            );
            Alert.alert("Předmět odstraněn a vrácen zpět na mapu.");
          },
        },
      ]
    );
  };
  const handleEquipItem = (item) => {
    Alert.alert("Equip Item", `Opravdu chcete vybavit ${item.name}?`, [
      { text: "Zrušit", style: "cancel" },
      {
        text: "Vybavit",
        onPress: () => {
          equipItem(character, item); // Volání funkce pro vybavení předmětu
          Alert.alert(`${item.name} byl vybaven!`);
        },
      },
    ]);
  };
  const renderItem = ({ item }) => {
    let itemType = "";
    switch (item.type) {
      case "weapon":
        itemType = `W (Útok: +${item.properties.attackPoints})`;
        break;
      case "armor":
        itemType = `A (Obrana: +${item.properties.defensePoints})`;
        break;
      case "magicItem":
        itemType = `M (Efekt: +${item.properties.effectAmount})`;
        break;
      case "potion":
        itemType = `P (Efekt: +${item.properties.effectAmount} ${item.properties.effectType})`;
        break;
      case "scroll":
        itemType = `S (Kouzlo: ${item.properties.spellName})`;
        break;
      case "ring":
        itemType = `R (Efekt: +${item.properties.effectAmount})`;
        break;
      case "amulet":
        itemType = `N (Efekt: +${item.properties.effectAmount})`;
        break;
      default:
        itemType = "";
    }
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>
          {item.name} {itemType}
        </Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Použít" onPress={() => handleUseItem(item)} />
          <Button title="Vybavit" onPress={() => handleEquipItem(item)} />
          <Button
            title="Odstraň z inventáře"
            onPress={() => handleRemoveItem(item)}
          />
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={inventory}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Váš inventář je prázdný.</Text>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
});
