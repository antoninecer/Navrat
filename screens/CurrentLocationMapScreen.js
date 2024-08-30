import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GMapModule from "../components/GMapModule";
import * as Location from "expo-location";
import { Marker } from "react-native-maps"; // Import Marker

export default function CurrentLocationMapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [points, setPoints] = useState([]);
  const [selectedPointData, setSelectedPointData] = useState(null);
  const [distanceToSelected, setDistanceToSelected] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const mapCenterRef = useRef(() => {});

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
        if (location && location.coords) {
          console.log("Current location:", location.coords);
          setLocation(location.coords);
        } else {
          console.error("Location data is null or undefined");
        }

        const storedPoints = await AsyncStorage.getItem("interestPoints");
        if (storedPoints) {
          const parsedPoints = JSON.parse(storedPoints);
          const validPoints = parsedPoints.filter(
            (point) =>
              point.location &&
              point.location.latitude &&
              point.location.longitude
          );
          console.log("Loaded Points:", validPoints);
          setPoints(validPoints);
        } else {
          console.log("No points found in storage.");
        }
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

    mapCenterRef.current(point.location.latitude, point.location.longitude);
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
      if (
        point.location &&
        point.location.latitude &&
        point.location.longitude
      ) {
        const pinColor = point.isReturnPoint ? "red" : "blue"; // Different color for return points
        console.log("Marker Data:", {
          description: point.description,
          coordinates: {
            latitude: point.location.latitude,
            longitude: point.location.longitude,
          },
          isReturnPoint: point.isReturnPoint,
          pinColor: pinColor,
        });

        // Extra checks for Return Point issues
        if (point.isReturnPoint) {
          console.log(
            "Return Point Debug: Checking values before rendering marker",
            {
              latitude: point.location.latitude,
              longitude: point.location.longitude,
              description: point.description,
              pinColor: pinColor,
            }
          );
        }

        return (
          <Marker
            key={index}
            coordinate={{
              latitude: point.location.latitude,
              longitude: point.location.longitude,
            }}
            title={point.description}
            pinColor={pinColor}
            onPress={() => handleMarkerClick(index, point)}
          />
        );
      } else {
        console.error("Invalid coordinates for marker", point);
        return null;
      }
    });
  };

  return (
    <View style={styles.container}>
      <GMapModule
        points={points}
        onMarkerClick={handleMarkerClick}
        setMapCenter={(func) => (mapCenterRef.current = func)}
        currentLocation={location}
      />
      {renderMarkers()}
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
