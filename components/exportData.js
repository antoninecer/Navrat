import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";
import { Alert } from "react-native";

export const exportData = async (setLoading) => {
  try {
    setLoading(true);
    console.log("Starting export...");

    // Načtení dat z AsyncStorage
    const returnPoint = await AsyncStorage.getItem("returnPoint");
    const storedPoints = await AsyncStorage.getItem("interestPoints");
    const storedInventory = await AsyncStorage.getItem("inventory");
    const storedObjects = await AsyncStorage.getItem("placedObjects");
    const selectedMode = await AsyncStorage.getItem("selectedMode");

    let allPoints = [];
    let totalDistance = 0;

    // Přidání návratového bodu do exportovaných dat
    if (returnPoint) {
      allPoints.push({ ...JSON.parse(returnPoint), title: "Return Point" });
    }

    // Přidání bodů zájmu do exportovaných dat
    if (storedPoints) {
      const uniquePoints = new Set(); // Vytvoření množiny pro kontrolu duplicit
      JSON.parse(storedPoints).forEach((point, index) => {
        const imageName = point.image ? point.image.split("/").pop() : null;
        const pointId = `${point.location.latitude},${point.location.longitude}`;
        if (!uniquePoints.has(pointId)) {
          // Kontrola, zda již bod nebyl přidán
          allPoints.push({
            ...point.location,
            title: `Interest Point ${index + 1}`,
            description: point.description,
            detailedDescription: point.detailedDescription, // Přidání detailního popisu
            image: point.image
              ? `${FileSystem.documentDirectory}${imageName}`
              : null,
            timestamp: point.timestamp,
          });
          uniquePoints.add(pointId); // Přidání ID bodu do množiny
        }
      });
    }

    console.log("Fetched points data.");

    // Výpočet celkové vzdálenosti mezi body
    for (let i = 0; i < allPoints.length - 1; i++) {
      const startPoint = allPoints[i];
      const endPoint = allPoints[i + 1];
      const distance = calculateDistance(
        startPoint.latitude,
        startPoint.longitude,
        endPoint.latitude,
        endPoint.longitude
      );
      totalDistance += distance;
    }

    // Příprava exportovaných dat
    const exportData = {
      points: allPoints,
      totalDistance: totalDistance.toFixed(2),
      inventory: storedInventory ? JSON.parse(storedInventory) : [],
      placedObjects: storedObjects ? JSON.parse(storedObjects) : [],
      selectedMode: selectedMode || "Herní režim",
    };

    // Vytvoření ZIP archivu
    const zip = new JSZip();
    zip.file("points.json", JSON.stringify(exportData, null, 2));
    console.log("Packed points.json.");

    // Přidání obrázků do ZIP archivu
    for (let point of allPoints) {
      if (point.image) {
        const imageUri = point.image;
        try {
          const fileInfo = await FileSystem.getInfoAsync(imageUri);
          if (fileInfo.exists) {
            const imageContent = await FileSystem.readAsStringAsync(imageUri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            zip.file(imageUri.split("/").pop(), imageContent, {
              base64: true,
            });
            console.log(`Packed image: ${imageUri.split("/").pop()}`);
          } else {
            console.log(`Image file not found: ${imageUri}`);
          }
        } catch (error) {
          console.error(`Failed to add image: ${imageUri}`, error);
        }
      }
    }

    // Vytvoření názvu souboru s časovým razítkem
    const date = new Date();
    const fileName = `VentureOut_${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}_${date
      .getHours()
      .toString()
      .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}.zip`;

    // Vytvoření ZIP souboru s pevným názvem
    const zipContent = await zip.generateAsync({ type: "base64" });
    const zipUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(zipUri, zipContent, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log(`ZIP file created: ${fileName}`);

    // Sdílení ZIP souboru
    await Sharing.shareAsync(zipUri);
    console.log("Sharing ZIP file completed.");
    Alert.alert("Úspěch", "Data byla úspěšně exportována!");
  } catch (error) {
    Alert.alert("Chyba", "Došlo k chybě při exportu dat.");
    console.error("Export error:", error);
  } finally {
    setLoading(false);
  }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon1 - lon2);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
