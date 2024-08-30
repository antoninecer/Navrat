import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import {
  standardWeapons,
  standardArmor,
  standardAccessories,
  standardPotions,
  standardScrolls,
  specialObjects,
} from "../data/standardItems";

export default function PlaceObjectScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("weapon");
  const [slot, setSlot] = useState(null);
  const [properties, setProperties] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const handlePlaceObject = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const newObject = {
        name,
        description,
        type,
        slot,
        properties,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      };
      const storedObjects = await AsyncStorage.getItem("placedObjects");
      const placedObjects = storedObjects ? JSON.parse(storedObjects) : [];
      placedObjects.push(newObject);
      await AsyncStorage.setItem(
        "placedObjects",
        JSON.stringify(placedObjects)
      );
      alert("Object placed successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error placing object:", error);
      alert("There was an error placing the object.");
    }
  };

  const objectTypes = [
    { label: "Weapon", value: "weapon" },
    { label: "Armor", value: "armor" },
    { label: "Accessory", value: "accessory" },
    { label: "Potion", value: "potion" },
    { label: "Scroll", value: "scroll" },
    { label: "Special", value: "special" },
  ];

  const getItemsByType = (selectedType) => {
    switch (selectedType) {
      case "weapon":
        return standardWeapons;
      case "armor":
        return standardArmor;
      case "accessory":
        return standardAccessories;
      case "potion":
        return standardPotions;
      case "scroll":
        return standardScrolls;
      case "special":
        return specialObjects;
      default:
        return [];
    }
  };

  const handleTypeChange = (selectedType) => {
    setType(selectedType);
    setProperties({});
    const items = getItemsByType(selectedType);
    if (items.length > 0) {
      const defaultItem = items[0];
      setName(defaultItem.name);
      setProperties(defaultItem.properties);
      setSlot(defaultItem.slot);
    }
  };

  const renderPropertiesInput = () => {
    switch (type) {
      case "weapon":
        return (
          <>
            <Text style={styles.label}>Weapon Type:</Text>
            <Picker
              selectedValue={name}
              onValueChange={(value) => {
                const selectedWeapon = standardWeapons.find(
                  (weapon) => weapon.name === value
                );
                setName(selectedWeapon.name);
                setProperties(selectedWeapon.properties);
                setSlot(selectedWeapon.slot);
              }}
            >
              {standardWeapons.map((weapon) => (
                <Picker.Item
                  key={weapon.name}
                  label={weapon.name}
                  value={weapon.name}
                />
              ))}
            </Picker>
            <Text style={styles.label}>Weight: {properties.weight}</Text>
            <Text style={styles.label}>
              Attack Points: {properties.attackPoints}
            </Text>
            <Text style={styles.label}>
              Defense Points: {properties.defensePoints || 0}
            </Text>
          </>
        );
      case "armor":
        return (
          <>
            <Text style={styles.label}>Armor Type:</Text>
            <Picker
              selectedValue={name}
              onValueChange={(value) => {
                const selectedArmor = standardArmor.find(
                  (armor) => armor.name === value
                );
                setName(selectedArmor.name);
                setProperties(selectedArmor.properties);
                setSlot(selectedArmor.slot);
              }}
            >
              {standardArmor.map((armor) => (
                <Picker.Item
                  key={armor.name}
                  label={armor.name}
                  value={armor.name}
                />
              ))}
            </Picker>
            <Text style={styles.label}>Weight: {properties.weight}</Text>
            <Text style={styles.label}>
              Defense Points: {properties.defensePoints}
            </Text>
          </>
        );
      // Similar case for accessories, potions, scrolls, etc.
      default:
        return null;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.label}>Object Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter object name"
        />
        <Text style={styles.label}>Object Description:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter object description"
          multiline
        />
        <Text style={styles.label}>Object Type:</Text>
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setModalVisible(true)}
        >
          <Text>{objectTypes.find((item) => item.value === type)?.label}</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.modalView}>
            {objectTypes.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.modalItem}
                onPress={() => {
                  handleTypeChange(item.value);
                  setModalVisible(false);
                }}
              >
                <Text>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
        {renderPropertiesInput()}
        <Button title="Place Object" onPress={handlePlaceObject} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
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
