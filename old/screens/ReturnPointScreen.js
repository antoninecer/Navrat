import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function ReturnPointScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  useEffect(() => {
    loadReturnPoint();
  }, []);
  const getLocation = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      setLocation(newLocation);
      await AsyncStorage.setItem("returnPoint", JSON.stringify(newLocation));
      setLoading(false);
    } catch (error) {
      console.error("Error getting location:", error);
      setErrorMsg("Error getting location");
      setLoading(false);
    }
  };
  const loadReturnPoint = async () => {
    try {
      const savedLocation = await AsyncStorage.getItem("returnPoint");
      if (savedLocation) {
        setLocation(JSON.parse(savedLocation));
      }
    } catch (error) {
      console.error("Error loading return point:", error);
      setErrorMsg("Error loading return point");
    }
  };
  if (loading || !location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{loading ? "Setting return point..." : "Loading map..."}</Text>
        {errorMsg ? <Text>{errorMsg}</Text> : null}
      </View>
    );
  }
  const leafletHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <style>
        #map {
          width: 100%;
          height: 100vh;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      <script>
        var map = L.map('map').setView([${location.latitude}, ${location.longitude}], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        var marker = L.marker([${location.latitude}, ${location.longitude}]).addTo(map);
        marker.bindPopup("<b>Return Point</b><br>This is your return point.").openPopup();
      </script>
    </body>
    </html>
  `;
  return (
    <View style={styles.container}>
      <Button title="Set Return Point" onPress={getLocation} />
      <View style={styles.mapContainer}>
        <WebView
          originWhitelist={["*"]}
          source={{ html: leafletHtml }}
          style={styles.map}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginVertical: 10,
    fontSize: 16,
  },
  mapContainer: {
    width: "100%",
    height: "80%",
    marginTop: 10,
  },
  map: {
    flex: 1,
  },
});
