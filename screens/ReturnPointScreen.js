import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants"; // Importing Constants to get API key

export default function ReturnPointScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [points, setPoints] = useState([]);
  const [selectedPointData, setSelectedPointData] = useState(null);
  const [distanceToSelected, setDistanceToSelected] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const googleMapsApiKey = Constants.manifest.extra.googleMapsApiKeyAndroid; // Get API key from app.config.js

  useEffect(() => {
    const getLocationAndPoints = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission denied",
            "Permission to access location was denied"
          );
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);

        const storedPoints = await AsyncStorage.getItem("interestPoints");
        const storedReturnPoint = await AsyncStorage.getItem("returnPoint");

        let allPoints = [];
        if (storedPoints) {
          const parsedPoints = JSON.parse(storedPoints);
          allPoints = parsedPoints;
        }

        if (storedReturnPoint) {
          const parsedReturnPoint = JSON.parse(storedReturnPoint);
          allPoints.push(parsedReturnPoint);
        }

        setPoints(allPoints);
      } catch (error) {
        Alert.alert("Error", "Error getting location or loading points");
        console.error("Error getting location or loading points: ", error);
      }
    };

    getLocationAndPoints();
  }, []);

  const handleMarkerClick = (index, point) => {
    setSelectedPointData(point);
    setCurrentIndex(index);

    if (location) {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        point.location.latitude,
        point.location.longitude
      );
      setDistanceToSelected(distance);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon1 - lon2) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handlePreviousPoint = () => {
    if (points.length > 0) {
      const prevIndex = (currentIndex - 1 + points.length) % points.length;
      handleMarkerClick(prevIndex, points[prevIndex]);
    }
  };

  const handleNextPoint = () => {
    if (points.length > 0) {
      const nextIndex = (currentIndex + 1) % points.length;
      handleMarkerClick(nextIndex, points[nextIndex]);
    }
  };

  const handleNavigate = () => {
    if (selectedPointData) {
      navigation.navigate("KompasScreen", { point: selectedPointData });
    }
  };

  const handleCancel = () => {
    setSelectedPointData(null);
    setDistanceToSelected(null);
  };

  const renderMarkers = () => {
    return points.map((point, index) => {
      const pinColor = point.isReturnPoint ? "red" : "blue";

      return (
        <Marker
          key={index}
          coordinate={{
            latitude: point.location.latitude,
            longitude: point.location.longitude,
          }}
          title={point.description}
          onPress={() => handleMarkerClick(index, point)}
          pinColor={pinColor}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
        >
          {renderMarkers()}
        </MapView>
      )}

      {selectedPointData && (
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            {selectedPointData.image && (
              <Image
                source={{ uri: selectedPointData.image }}
                style={styles.image}
              />
            )}
            <View style={styles.infoDetails}>
              <Text style={styles.infoText}>
                {selectedPointData.description}
              </Text>
              <Text style={styles.infoText}>
                Souřadnice: {selectedPointData.location.latitude.toFixed(6)},{" "}
                {selectedPointData.location.longitude.toFixed(6)}
              </Text>
              {distanceToSelected && (
                <Text style={styles.infoText}>
                  Vzdálenost: {(distanceToSelected / 1000).toFixed(2)} km
                </Text>
              )}
              <Text style={styles.infoText}>
                {selectedPointData.detailedDescription ||
                  "No additional details"}
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handlePreviousPoint}
            >
              <Text style={styles.buttonText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNextPoint}>
              <Text style={styles.buttonText}>→</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Navigate" onPress={handleNavigate} />
            <Button title="Cancel" onPress={handleCancel} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  infoBox: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  image: {
    width: 80,
    height: 80,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
