import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Switch,
  Alert,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import GpsAccuracyComponent from "../components/GpsAccuracyComponent";
import { useTranslation } from "react-i18next";

export default function InterestPointScreen({ navigation }) {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [isReturnPoint, setIsReturnPoint] = useState(false);
  const [existingReturnPoint, setExistingReturnPoint] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const checkExistingReturnPoint = async () => {
      const storedPoints = await AsyncStorage.getItem("interestPoints");
      const storedReturnPoint = await AsyncStorage.getItem("returnPoint");

      let nextTitleNumber = 1;

      if (storedPoints) {
        const points = JSON.parse(storedPoints);
        const maxTitle = points.reduce(
          (max, point) => Math.max(max, parseInt(point.title)),
          0
        );
        nextTitleNumber = maxTitle + 1;
      }

      if (storedReturnPoint) {
        const returnPoint = JSON.parse(storedReturnPoint);
        setExistingReturnPoint(true);
        nextTitleNumber = Math.max(
          nextTitleNumber,
          parseInt(returnPoint.title) + 1
        );
      }

      setTitle(nextTitleNumber.toString());
    };

    checkExistingReturnPoint();
  }, []);

  const handleLocationDetermined = (coords) => {
    setLocation(coords);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImage(manipResult.uri);
    } else {
      Alert.alert(
        t("no_image_selected", "No Image"),
        t(
          "image_selection_cancelled",
          "No image was selected or the operation was canceled."
        )
      );
    }
  };

  const saveInterestPoint = async () => {
    if (!location) {
      Alert.alert(
        t("missing_location", "Missing Location"),
        t("set_location_before_saving", "Please set a location before saving.")
      );
      return;
    }
    if (!image) {
      Alert.alert(
        t("missing_image", "Missing Image"),
        t("take_photo_before_saving", "Please take a photo before saving.")
      );
      return;
    }
    if (!description) {
      Alert.alert(
        t("missing_description", "Missing Description"),
        t(
          "enter_description_before_saving",
          "Please enter a description before saving."
        )
      );
      return;
    }

    try {
      const imageName = image.split("/").pop();
      const imagePath = `${FileSystem.documentDirectory}${imageName}`;
      await FileSystem.copyAsync({
        from: image,
        to: imagePath,
      });

      const interestPoint = {
        title,
        location,
        image: imagePath,
        description,
        detailedDescription,
        isReturnPoint,
        timestamp: new Date().toISOString(),
      };

      const storedPoints = await AsyncStorage.getItem("interestPoints");
      let points = storedPoints ? JSON.parse(storedPoints) : [];

      if (isReturnPoint) {
        await AsyncStorage.setItem(
          "returnPoint",
          JSON.stringify(interestPoint)
        );
        points = points.map((point) => ({
          ...point,
          isReturnPoint: false,
        }));
      }

      points.push(interestPoint);
      await AsyncStorage.setItem("interestPoints", JSON.stringify(points));

      Alert.alert(
        t("saved", "Saved"),
        t("point_saved_successfully", "Point saved successfully!")
      );
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error saving interest point:", error);
      Alert.alert(
        t("error", "Error"),
        t("error_saving_point", "An error occurred while saving the point.")
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <GpsAccuracyComponent onLocationDetermined={handleLocationDetermined} />
        {location && (
          <Text style={styles.text}>
            {t("location", "Location")}: {location.latitude},{" "}
            {location.longitude}
          </Text>
        )}
        {existingReturnPoint ? (
          <Text>
            {t("return_point_exists", "Return Point already exists.")}{" "}
            {t(
              "delete_existing_return_point",
              "To set a new one, delete the existing one first."
            )}
          </Text>
        ) : (
          <View style={styles.switchContainer}>
            <Text>{t("set_as_return_point", "Set as Return Point")}</Text>
            <Switch
              value={isReturnPoint}
              onValueChange={setIsReturnPoint}
              disabled={existingReturnPoint}
            />
          </View>
        )}
        <Button title={t("take_photo", "Take a Photo")} onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TextInput
          style={styles.input}
          placeholder={t("enter_description", "Enter description")}
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder={t(
            "enter_detailed_description",
            "Enter detailed description"
          )}
          value={detailedDescription}
          onChangeText={setDetailedDescription}
          multiline
        />
        <View style={styles.buttonContainer}>
          <Button
            title={t("save_point", "Save Point")}
            onPress={saveInterestPoint}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  scrollContainer: {
    alignItems: "center",
    padding: 16,
  },
  text: {
    marginVertical: 10,
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  buttonContainer: {
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
});
