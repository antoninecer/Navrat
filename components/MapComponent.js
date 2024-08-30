import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import WebView from "react-native-webview";
import * as Location from "expo-location";
export default function MapComponent({ points = [], returnPoint = null }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          console.log("Permission to access location was denied");
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        console.log("User location:", location);
        setLocation(location.coords);
        // Logování návratového bodu, pokud existuje
        if (returnPoint) {
          console.log(
            `Return Point (0): Lat: ${returnPoint.latitude}, Lon: ${returnPoint.longitude}`
          );
        } else {
          console.log("No Return Point set.");
        }
        // Logování bodů zájmu
        if (points.length > 0) {
          points.forEach((point, index) => {
            console.log(
              `Interest Point (${index + 1}): Lat: ${point.latitude}, Lon: ${
                point.longitude
              }`
            );
          });
        } else {
          console.log("No Interest Points available.");
        }
      } catch (error) {
        setErrorMsg("Error getting location");
        console.error("Error getting location:", error);
      }
    })();
  }, [points, returnPoint]);
  if (!location) {
    console.log("Location not yet available, loading...");
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading map...</Text>
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
        var map = L.map('map').setView([${location.latitude}, ${
    location.longitude
  }], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        var currentLocationIcon = L.icon({
          iconUrl: '../assets/greenpoint.png',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });
        var marker = L.marker([${location.latitude}, ${
    location.longitude
  }], {icon: currentLocationIcon}).addTo(map);
        marker.bindPopup("<b>You are here!</b>").openPopup();
        ${
          returnPoint
            ? `
            var returnPointIcon = L.icon({
              iconUrl: '../assets/redpoint.png',
              iconSize: [40, 40],
              iconAnchor: [20, 40],
            });
            var returnMarker = L.marker([${returnPoint.latitude}, ${returnPoint.longitude}], {icon: returnPointIcon}).addTo(map);
            returnMarker.bindPopup("<b>Return Point</b>").openPopup();
          `
            : ""
        }
        ${points
          .map(
            (point, index) => `
          var interestPointIcon = L.icon({
            iconUrl: '../assets/bluepoint.png',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          });
          var marker${index} = L.marker([${point.latitude}, ${
              point.longitude
            }], {icon: interestPointIcon}).addTo(map);
          marker${index}.bindPopup("<b>${
              point.title || `Point ${index + 1}`
            }</b><br>${point.description || ""}").openPopup();
        `
          )
          .join("")}
      </script>
    </body>
    </html>
  `;
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: leafletHtml }}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
