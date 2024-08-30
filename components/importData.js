import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import JSZip from "jszip";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";
export const importData = async (setLoading) => {
  try {
    console.log("Starting import...");
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/zip",
    });
    console.log("DocumentPicker result:", result);
    if (result.canceled) {
      console.log("Import cancelled by user.");
      return;
    }
    if (!result.assets || result.assets.length === 0) {
      console.error("No file URI returned from DocumentPicker.");
      Alert.alert(
        "Error",
        "No file was selected or the operation was canceled."
      );
      return;
    }
    const fileUri = result.assets[0].uri;
    console.log("ZIP file selected:", fileUri);
    const zipContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("ZIP file read into base64.");
    const zip = await JSZip.loadAsync(zipContent, { base64: true });
    console.log("ZIP file loaded.");
    const pointsFile = zip.file("points.json");
    if (!pointsFile) {
      Alert.alert("Error", "No points.json file found in the ZIP.");
      console.log("No points.json found in ZIP.");
      return;
    }
    const pointsData = JSON.parse(await pointsFile.async("text"));
    console.log("points.json loaded:", pointsData);
    // Vyčištění starých dat
    await AsyncStorage.removeItem("interestPoints");
    await AsyncStorage.removeItem("inventory");
    await AsyncStorage.removeItem("placedObjects");
    console.log("Cleared old interest points, inventory, and placed objects.");
    const newPoints = [];
    let importedCount = 0;
    // Import bodů zájmu
    for (let point of pointsData.points) {
      if (
        point.latitude &&
        point.longitude &&
        !isNaN(point.latitude) &&
        !isNaN(point.longitude)
      ) {
        const formattedPoint = {
          description: point.description || "",
          image: point.image || null,
          timestamp: point.timestamp || new Date().toISOString(),
          location: {
            latitude: parseFloat(point.latitude),
            longitude: parseFloat(point.longitude),
          },
        };
        if (point.image) {
          const imageFile = zip.file(point.image.split("/").pop());
          if (imageFile) {
            try {
              console.log("Found image in ZIP:", point.image.split("/").pop());
              const imageData = await imageFile.async("base64");
              const imageUri = `${FileSystem.documentDirectory}${point.image
                .split("/")
                .pop()}`;
              console.log("Saving image to:", imageUri);
              await FileSystem.writeAsStringAsync(imageUri, imageData, {
                encoding: FileSystem.EncodingType.Base64,
              });
              formattedPoint.image = imageUri;
              console.log(`Saved image to: ${imageUri}`);
            } catch (error) {
              console.error(
                `Failed to write image: ${point.image.split("/").pop()}`,
                error
              );
              formattedPoint.image = null;
            }
          } else {
            console.log(
              `Image file not found in ZIP: ${point.image.split("/").pop()}`
            );
            formattedPoint.image = null;
          }
        }
        newPoints.push(formattedPoint);
        importedCount++;
        console.log(`Imported Point:`);
        console.log(`Description: ${formattedPoint.description}`);
        console.log(`Latitude: ${formattedPoint.location.latitude}`);
        console.log(`Longitude: ${formattedPoint.location.longitude}`);
        if (formattedPoint.image) {
          console.log(`Image File: ${formattedPoint.image.split("/").pop()}`);
        } else {
          console.log("No image associated with this point.");
        }
      } else {
        console.log("Skipping point with invalid coordinates:", point);
      }
    }
    await AsyncStorage.setItem("interestPoints", JSON.stringify(newPoints));
    console.log("New interest points saved.");
    // Import inventáře
    if (pointsData.inventory) {
      await AsyncStorage.setItem(
        "inventory",
        JSON.stringify(pointsData.inventory)
      );
      console.log("Inventory imported and saved.");
    } else {
      console.log("No inventory data found in points.json.");
    }
    // Import skrytých objektů
    if (pointsData.placedObjects) {
      await AsyncStorage.setItem(
        "placedObjects",
        JSON.stringify(pointsData.placedObjects)
      );
      console.log("Placed objects imported and saved.");
    } else {
      console.log("No placed objects data found in points.json.");
    }
    Alert.alert(
      "Import Completed",
      `${importedCount} points with valid coordinates and descriptions were successfully imported.`
    );
  } catch (error) {
    Alert.alert("Error", "An error occurred while importing data.");
    console.error("Import error:", error);
  } finally {
    setLoading(false);
  }
};
