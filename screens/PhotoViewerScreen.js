import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import styles from "../components/styles"; // Import stylů
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons"; // Import ikon
import { useTranslation } from "react-i18next"; // Použij useTranslation hook

export default function PhotoViewerScreen({ navigation }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [points, setPoints] = useState([]);
  const [returnPoint, setReturnPoint] = useState(null); // Přidáme návratový bod
  const [imageExists, setImageExists] = useState(true);

  useEffect(() => {
    const loadPoints = async () => {
      const storedPoints = await AsyncStorage.getItem("interestPoints");
      const storedReturnPoint = await AsyncStorage.getItem("returnPoint");

      if (storedPoints) {
        const parsedPoints = JSON.parse(storedPoints);
        setPoints(parsedPoints);
        console.log("Loaded points:", parsedPoints);
      }

      if (storedReturnPoint) {
        const parsedReturnPoint = JSON.parse(storedReturnPoint);
        setReturnPoint(parsedReturnPoint);
        console.log("Loaded return point:", parsedReturnPoint);
      }
    };
    loadPoints();
  }, []);

  useEffect(() => {
    const checkImage = async () => {
      const pointToCheck =
        currentIndex < points.length ? points[currentIndex] : returnPoint;

      if (pointToCheck && pointToCheck.image) {
        const fileInfo = await FileSystem.getInfoAsync(pointToCheck.image);
        console.log("Current image info:", fileInfo);
        if (!fileInfo.exists) {
          console.error("Image does not exist:", pointToCheck.image);
          setImageExists(false);
        } else {
          console.log(
            "Image exists and will be displayed:",
            pointToCheck.image
          );
          setImageExists(true);
        }
      }
    };
    checkImage();
  }, [currentIndex, points, returnPoint]);

  const handleNext = () => {
    if (currentIndex < points.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (currentIndex === points.length - 1 && returnPoint) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (currentIndex === 0 && returnPoint) {
      setCurrentIndex(points.length);
    } else {
      setCurrentIndex(points.length - 1);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      t("delete_point", "Delete Point"),
      t(
        "delete_point_confirmation",
        "Are you sure you want to delete this point and its photo?"
      ),
      [
        { text: t("cancel", "Cancel"), style: "cancel" },
        {
          text: t("yes", "Yes"),
          onPress: async () => {
            if (currentIndex < points.length) {
              const updatedPoints = [...points];
              const [removedPoint] = updatedPoints.splice(currentIndex, 1);
              if (removedPoint.image) {
                try {
                  await FileSystem.deleteAsync(removedPoint.image);
                  console.log("Image deleted:", removedPoint.image);
                } catch (error) {
                  console.error("Error deleting image:", error);
                }
              }
              setPoints(updatedPoints);
              await AsyncStorage.setItem(
                "interestPoints",
                JSON.stringify(updatedPoints)
              );
            } else if (currentIndex === points.length) {
              setReturnPoint(null);
              await AsyncStorage.removeItem("returnPoint");
            }

            if (currentIndex >= points.length) {
              setCurrentIndex(points.length - 1);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleToggleReturnPoint = async () => {
    const selectedPoint =
      currentIndex < points.length ? points[currentIndex] : returnPoint;

    if (selectedPoint.isReturnPoint) {
      // Pokud je bod návratovým bodem, přeměníme ho na běžný bod
      selectedPoint.isReturnPoint = false;
      setPoints((prevPoints) => [...prevPoints, selectedPoint]);
      setReturnPoint(null);
      await AsyncStorage.removeItem("returnPoint");
      await AsyncStorage.setItem("interestPoints", JSON.stringify(points));
    } else {
      // Pokud není návratový bod, nastavíme ho a zrušíme status z aktuálního return pointu
      if (returnPoint) {
        returnPoint.isReturnPoint = false;
        setPoints((prevPoints) => [...prevPoints, returnPoint]);
        await AsyncStorage.setItem("interestPoints", JSON.stringify(points));
      }

      selectedPoint.isReturnPoint = true;
      setReturnPoint(selectedPoint);
      setPoints((prevPoints) =>
        prevPoints.filter((point, index) => index !== currentIndex)
      );
      await AsyncStorage.setItem("returnPoint", JSON.stringify(selectedPoint));
      await AsyncStorage.setItem(
        "interestPoints",
        JSON.stringify(points.filter((_, index) => index !== currentIndex))
      );
    }
  };

  if (points.length === 0 && !returnPoint) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          {t("no_points_found", "No interest points found.")}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title={t("back", "Back")}
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    );
  }

  const currentPoint =
    currentIndex < points.length ? points[currentIndex] : returnPoint;

  const isToggleDisabled = currentPoint.isReturnPoint ? false : !!returnPoint; // Povolit přepínač jen pokud je to návratový bod nebo žádný návratový bod neexistuje.

  return (
    <View style={styles.container}>
      <View style={localStyles.navigationContainer}>
        <TouchableOpacity
          onPress={handlePrevious}
          style={localStyles.navButton}
        >
          <Ionicons name="chevron-back-circle" size={30} color="black" />
          <Text style={localStyles.navText}>{t("previous", "Previous")}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={localStyles.navButton}>
          <Text style={localStyles.navText}>{t("next", "Next")}</Text>
          <Ionicons name="chevron-forward-circle" size={30} color="black" />
        </TouchableOpacity>
      </View>
      {imageExists ? (
        <Image source={{ uri: currentPoint.image }} style={localStyles.image} />
      ) : (
        <Text>{t("no_image_available", "No image available")}</Text>
      )}
      <Text style={styles.text}>
        {t("description", "Description")}: {currentPoint.description}
      </Text>
      <Text style={styles.text}>
        {t("location", "Location")}: {currentPoint.location.latitude},{" "}
        {currentPoint.location.longitude}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title={t("delete_point", "Delete Point")}
          onPress={handleDelete}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title={t("back", "Back")} onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={
            currentPoint.isReturnPoint
              ? t("make_interest_point", "Make Interest Point")
              : t("make_return_point", "Make Return Point")
          }
          onPress={handleToggleReturnPoint}
          disabled={isToggleDisabled} // Přepínač je deaktivovaný, pokud už existuje návratový bod a aktuální bod není návratovým bodem
        />
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 20,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  navText: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: 10,
  },
});
