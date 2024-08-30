import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, Button, Animated } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";

export default function KompasScreen({ route, navigation }) {
  const { point } = route.params; // Cílový bod
  const [locationBuffer, setLocationBuffer] = useState([]);
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [distance, setDistance] = useState(null);
  const [arrowRotation] = useState(new Animated.Value(0));

  const MAX_BUFFER_SIZE = 5; // Buffer pro průměrování pozic

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const locSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // každá vteřina
          distanceInterval: 1,
        },
        (loc) => {
          const coords = loc.coords;
          handleNewLocation(coords);
        }
      );

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

      _subscribe();

      return () => {
        locSubscription.remove();
        Magnetometer.removeAllListeners();
      };
    };

    getLocation();
  }, []);

  const handleNewLocation = (newLocation) => {
    if (locationBuffer.length >= MAX_BUFFER_SIZE) {
      setLocationBuffer((prevBuffer) => prevBuffer.slice(1));
    }

    setLocationBuffer((prevBuffer) => [...prevBuffer, newLocation]);

    const averagedLocation = calculateAverageLocation([
      ...locationBuffer,
      newLocation,
    ]);
    setLocation(averagedLocation);

    if (averagedLocation) {
      const dist = calculateDistance(
        averagedLocation.latitude,
        averagedLocation.longitude,
        point.location.latitude,
        point.location.longitude
      );
      setDistance(dist);

      const bearing = calculateBearing(
        averagedLocation.latitude,
        averagedLocation.longitude,
        point.location.latitude,
        point.location.longitude
      );
      const direction = (bearing - heading + 360) % 360; // Směr k cíli mínus aktuální směr zařízení
      animateArrow(direction);
    }
  };

  const calculateAverageLocation = (buffer) => {
    if (buffer.length === 0) return null;

    const filteredBuffer = buffer.filter((loc) => loc.accuracy <= 20); // Filtrujeme extrémní hodnoty

    const sum = filteredBuffer.reduce(
      (acc, loc) => {
        acc.latitude += loc.latitude;
        acc.longitude += loc.longitude;
        return acc;
      },
      { latitude: 0, longitude: 0 }
    );

    return {
      latitude: sum.latitude / filteredBuffer.length,
      longitude: sum.longitude / filteredBuffer.length,
    };
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

  const animateArrow = (direction) => {
    Animated.timing(arrowRotation, {
      toValue: direction,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  if (!location || !point) {
    return (
      <View style={styles.container}>
        <Text>Načítání...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (location.latitude + point.location.latitude) / 2,
          longitude: (location.longitude + point.location.longitude) / 2,
          latitudeDelta:
            Math.abs(location.latitude - point.location.latitude) * 2,
          longitudeDelta:
            Math.abs(location.longitude - point.location.longitude) * 2,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: point.location.latitude,
            longitude: point.location.longitude,
          }}
          title={point.description}
          description={point.detailedDescription}
        />
      </MapView>
      <View style={styles.infoBox}>
        <Text style={styles.text}>
          Aktuální GPS: {location.latitude.toFixed(5)},{" "}
          {location.longitude.toFixed(5)}
        </Text>
        <Text style={styles.text}>
          Cíl GPS: {point.location.latitude.toFixed(5)},{" "}
          {point.location.longitude.toFixed(5)}
        </Text>
        <Text style={styles.text}>
          Vzdálenost: {(distance / 1000).toFixed(2)} km
        </Text>
        <View style={styles.arrowContainer}>
          <Animated.Image
            source={require("../assets/arrow.png")}
            style={[
              styles.arrow,
              {
                transform: [
                  {
                    rotate: arrowRotation.interpolate({
                      inputRange: [0, 360],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
        {point.image && (
          <Image source={{ uri: point.image }} style={styles.image} />
        )}
        <Text style={styles.descriptionText}>{point.description}</Text>
        <Text style={styles.detailedDescriptionText}>
          {point.detailedDescription}
        </Text>
        <Button title="Zpět" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "50%",
  },
  infoBox: {
    padding: 16,
    backgroundColor: "white",
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  arrowContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  arrow: {
    width: 100,
    height: 100,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    borderRadius: 10,
  },
  descriptionText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailedDescriptionText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
});
