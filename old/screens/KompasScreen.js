import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, Button } from "react-native";
import { Magnetometer } from "expo-sensors";
import * as Location from "expo-location";
export default function KompasScreen({ route }) {
  const { point } = route.params;
  const [heading, setHeading] = useState(0);
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setDistance(
        calculateDistance(
          loc.coords.latitude,
          loc.coords.longitude,
          point.latitude,
          point.longitude
        )
      );
    };
    const _subscribe = () => {
      Magnetometer.addListener((data) => {
        let { x, y } = data;
        let angle = Math.atan2(y, x) * (180 / Math.PI);
        if (angle < 0) {
          angle += 360;
        }
        setHeading(Math.round(angle));
      });
    };
    getLocation();
    _subscribe();
    return () => {
      Magnetometer.removeAllListeners();
    };
  }, [location]);
  const calculateBearing = (lat1, lon1, lat2, lon2) => {
    const toRadians = (deg) => deg * (Math.PI / 180);
    const toDegrees = (rad) => rad * (180 / Math.PI);
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δλ = toRadians(lon2 - lon1);
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    let brng = toDegrees(Math.atan2(y, x));
    return (brng + 360) % 360;
  };
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Poloměr Země v metrech
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Vzdálenost v metrech
  };
  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  const bearing = calculateBearing(
    location.latitude,
    location.longitude,
    point.latitude,
    point.longitude
  );
  const direction = (bearing - heading + 360) % 360;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Aktuální GPS: {location.latitude}, {location.longitude}
      </Text>
      <Text style={styles.text}>
        Cíl GPS: {point.latitude}, {point.longitude}
      </Text>
      <Text style={styles.text}>Směr k cíli: {Math.round(direction)}°</Text>
      <Text style={styles.text}>
        Vzdálenost: {(distance / 1000).toFixed(2)} km
      </Text>
      <Image
        source={require("../assets/arrow.png")} // cesta k obrázku šipky
        style={[styles.arrow, { transform: [{ rotate: `${direction}deg` }] }]}
      />
      <Button
        title="Open Compass App"
        onPress={() => {
          // Zde by byla funkce pro otevření nativní kompasové aplikace
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  arrow: {
    width: 200,
    height: 200,
  },
  distanceText: {
    marginTop: 20,
    fontSize: 24,
    color: "#333",
  },
});
