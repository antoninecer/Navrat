import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import WebView from "react-native-webview";
import * as Location from "expo-location";
export default function MapModule({
  points = [],
  returnPoint = null,
  onMarkerClick,
}) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const webViewRef = useRef(null);
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
        if (returnPoint) {
          console.log(
            `Return Point: Lat: ${returnPoint.latitude}, Lon: ${returnPoint.longitude}`
          );
        }
        if (points.length > 0) {
          points.forEach((point, index) => {
            console.log(
              `Interest Point (${index + 1}): Lat: ${
                point.location.latitude
              }, Lon: ${point.location.longitude}`
            );
          });
        }
      } catch (error) {
        setErrorMsg("Error getting location");
        console.error("Error getting location:", error);
      }
    })();
  }, [points, returnPoint]);
  if (!location) {
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
      var currentIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
      var selectedIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
      var interestIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
      var currentLocationMarker = L.marker([${location.latitude}, ${
    location.longitude
  }], {icon: currentIcon}).addTo(map);
      currentLocationMarker.bindPopup("<b>You are here!</b>").openPopup();
      var markers = [];
      ${points
        .map(
          (point, index) => `
        var marker${index} = L.marker([${point.location.latitude}, ${
            point.location.longitude
          }], {icon: interestIcon}).addTo(map);
        marker${index}.on('click', function() {
          markers.forEach(m => m.setIcon(interestIcon)); // Reset all markers to blue
          marker${index}.setIcon(selectedIcon); // Set clicked marker to yellow
          map.setView([${point.location.latitude}, ${
            point.location.longitude
          }], 13); // Center the map on the clicked marker
          window.ReactNativeWebView.postMessage(JSON.stringify({
            markerIndex: ${index},
            point: {
              latitude: ${point.location.latitude},
              longitude: ${point.location.longitude},
              description: "${point.description}",
              details: "${point.details || ""}",
              image: "${point.image || ""}"
            }
          }));
        });
        markers.push(marker${index});
      `
        )
        .join("")}
    </script>
  </body>
  </html>
`;
  return (
    <WebView
      ref={webViewRef}
      originWhitelist={["*"]}
      source={{ html: leafletHtml }}
      style={{ flex: 1 }}
      onMessage={(event) => {
        const { markerIndex, point } = JSON.parse(event.nativeEvent.data);
        if (onMarkerClick) {
          onMarkerClick(markerIndex, point);
        }
      }}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
