import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";

export default function GpsAccuracyComponent({ onLocationDetermined }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState(t("calculating_gps"));
  const [color, setColor] = useState("red");
  const [locations, setLocations] = useState([]);
  const [lastAccurateCoords, setLastAccurateCoords] = useState(null);

  useEffect(() => {
    startWatchingPosition();
  }, []);

  useEffect(() => {
    if (lastAccurateCoords) {
      // Callback is called after render to avoid issues
      onLocationDetermined(lastAccurateCoords);
    }
  }, [lastAccurateCoords]);

  const startWatchingPosition = async () => {
    setStatus(t("acquiring_gps"));
    setColor("red");
    setLocations([]);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setStatus(t("gps_permission_denied"));
        setColor("red");
        return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 2000,
          distanceInterval: 0.5,
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          const roundedCoords = {
            latitude: roundTo(latitude, 6),
            longitude: roundTo(longitude, 6),
          };

          setLocations((prevLocations) => {
            const updatedLocations = [...prevLocations, roundedCoords];

            if (updatedLocations.length >= 3) {
              const filteredLocations = filterOutliers(updatedLocations);
              const averagedCoords = calculateAverage(filteredLocations);
              setStatus(t("gps_precise"));
              setColor("green");
              setLastAccurateCoords(averagedCoords);
              subscription.remove(); // Stop watching after obtaining precise location
            } else {
              setStatus(t("calculating_average"));
              setColor("yellow");
            }

            return updatedLocations;
          });
        }
      );
    } catch (error) {
      setStatus(t("gps_error"));
      setColor("red");
    }
  };

  const filterOutliers = (locationsArray) => {
    const distances = locationsArray.map((loc) => {
      return calculateDistance(loc, locationsArray[0]);
    });

    const meanDistance =
      distances.reduce((sum, d) => sum + d, 0) / distances.length;
    const filteredLocations = locationsArray.filter((loc, index) => {
      return Math.abs(distances[index] - meanDistance) < 5; // Filter out points that are more than 5 meters from the mean
    });

    return filteredLocations;
  };

  const calculateAverage = (locationsArray) => {
    const total = locationsArray.reduce(
      (acc, loc) => {
        acc.latitude += loc.latitude;
        acc.longitude += loc.longitude;
        return acc;
      },
      { latitude: 0, longitude: 0 }
    );

    const count = locationsArray.length;

    return {
      latitude: roundTo(total.latitude / count, 6),
      longitude: roundTo(total.longitude / count, 6),
    };
  };

  const calculateDistance = (coord1, coord2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (coord1.latitude * Math.PI) / 180;
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // Distance in meters
    return d;
  };

  const roundTo = (value, decimals) => {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={startWatchingPosition}>
      <Text>{status}</Text>
      <View style={[styles.indicator, { backgroundColor: color }]} />
      {status === t("acquiring_gps") && (
        <ActivityIndicator size="small" color="#0000ff" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginTop: 10,
  },
});
