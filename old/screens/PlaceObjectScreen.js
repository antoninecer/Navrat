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
import { Picker } from "@react-native-picker/picker"; // Import Pickeru
export default function PlaceObjectScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("weapon"); // Default type is weapon
  const [slot, setSlot] = useState("body"); // Default slot for armor is body
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
        slot, // Slot specification added here
        properties, // Specific properties of the object
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
    { label: "Magic Item", value: "magicItem" },
    { label: "Potion", value: "potion" },
    { label: "Food", value: "food" },
    { label: "Scroll", value: "scroll" },
    { label: "Sign", value: "sign" },
    { label: "Dungeon", value: "dungeon" }, // Place of battle
  ];
  const armorSlots = [
    { label: "Head", value: "head" },
    { label: "Neck", value: "neck" },
    { label: "Body", value: "body" },
    { label: "Legs", value: "legs" },
    { label: "Feet", value: "feet" },
    { label: "Left Hand", value: "leftHand" },
    { label: "Right Hand", value: "rightHand" },
  ];
  const handleTypeChange = (selectedType) => {
    setType(selectedType);
    setProperties({});
    if (selectedType === "armor") {
      setSlot("body"); // Default to body slot for armor
    } else {
      setSlot(null);
    }
  };
  const handlePropertyChange = (property, value) => {
    setProperties((prevProperties) => ({
      ...prevProperties,
      [property]: value,
    }));
  };
  const renderPropertiesInput = () => {
    switch (type) {
      case "weapon":
        return (
          <>
            <Text style={styles.label}>One-Handed/Two-Handed:</Text>
            <Picker
              selectedValue={properties.handType}
              onValueChange={(value) => handlePropertyChange("handType", value)}
            >
              <Picker.Item label="One-Handed" value="oneHanded" />
              <Picker.Item label="Two-Handed" value="twoHanded" />
            </Picker>
            <Text style={styles.label}>Attack Points:</Text>
            <Picker
              selectedValue={properties.attackPoints}
              onValueChange={(value) =>
                handlePropertyChange("attackPoints", value)
              }
            >
              {[...Array(21).keys()].map((val) => (
                <Picker.Item key={val} label={`${val}`} value={val} />
              ))}
            </Picker>
            <Text style={styles.label}>Weight:</Text>
            <Picker
              selectedValue={properties.weight}
              onValueChange={(value) => handlePropertyChange("weight", value)}
            >
              {[...Array(51).keys()].map((val) => (
                <Picker.Item key={val} label={`${val}`} value={val} />
              ))}
            </Picker>
          </>
        );
      case "armor":
        return (
          <>
            <Text style={styles.label}>Defense Points:</Text>
            <Picker
              selectedValue={properties.defensePoints}
              onValueChange={(value) =>
                handlePropertyChange("defensePoints", value)
              }
            >
              {[...Array(21).keys()].map((val) => (
                <Picker.Item key={val} label={`${val}`} value={val} />
              ))}
            </Picker>
            <Text style={styles.label}>Weight:</Text>
            <Picker
              selectedValue={properties.weight}
              onValueChange={(value) => handlePropertyChange("weight", value)}
            >
              {[...Array(51).keys()].map((val) => (
                <Picker.Item key={val} label={`${val}`} value={val} />
              ))}
            </Picker>
            <Text style={styles.label}>Select Armor Slot:</Text>
            <Picker
              selectedValue={slot}
              onValueChange={(value) => setSlot(value)}
            >
              {armorSlots.map((slot) => (
                <Picker.Item
                  key={slot.value}
                  label={slot.label}
                  value={slot.value}
                />
              ))}
            </Picker>
          </>
        );
      case "potion":
        return (
          <>
            <Text style={styles.label}>Potion Effect:</Text>
            <Picker
              selectedValue={properties.effectType}
              onValueChange={(value) =>
                handlePropertyChange("effectType", value)
              }
            >
              <Picker.Item label="Health" value="health" />
              <Picker.Item label="Mana" value="mana" />
              <Picker.Item label="Luck" value="luck" />
              <Picker.Item label="Attack" value="attack" />
              <Picker.Item label="Defense" value="defense" />
              <Picker.Item label="Speed" value="speed" />
            </Picker>
            <Text style={styles.label}>Effect Amount:</Text>
            <Picker
              selectedValue={properties.effectAmount}
              onValueChange={(value) =>
                handlePropertyChange("effectAmount", value)
              }
            >
              {[...Array(71).keys()].map((val) => (
                <Picker.Item
                  key={val - 20}
                  label={`${val - 20}`}
                  value={val - 20}
                />
              ))}
            </Picker>
            <Text style={styles.label}>Duration (in minutes):</Text>
            <Picker
              selectedValue={properties.duration}
              onValueChange={(value) => handlePropertyChange("duration", value)}
            >
              {[...Array(61).keys()].map((val) => (
                <Picker.Item key={val} label={`${val}`} value={val} />
              ))}
            </Picker>
          </>
        );
      case "dungeon":
        return (
          <>
            <Text style={styles.label}>Dungeon Difficulty:</Text>
            <Picker
              selectedValue={properties.difficulty}
              onValueChange={(value) =>
                handlePropertyChange("difficulty", value)
              }
            >
              <Picker.Item label="Easy" value="easy" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="Hard" value="hard" />
            </Picker>
          </>
        );
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
