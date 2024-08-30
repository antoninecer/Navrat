import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import * as Location from "expo-location";
export default function GMapModule({
  points = [],
  returnPoint = null,
  onMarkerClick,
  setMapCenter,
}) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);
  const setMapCenterFunc = (latitude, longitude) => {
    if (mapRef.current) {
      const currentRegion = mapRef.current.__lastRegion;
      mapRef.current.animateToRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: currentRegion?.latitudeDelta || 0.0922,
        longitudeDelta: currentRegion?.longitudeDelta || 0.0421,
      });
    }
  };
  useEffect(() => {
    let locationSubscription;
    const startTrackingLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          console.log("Permission to access location was denied");
          return;
        }
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (newLocation) => {
            setLocation(newLocation.coords);
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
            }
          }
        );
      } catch (error) {
        setErrorMsg("Error getting location");
        console.error("Error getting location:", error);
      }
    };
    startTrackingLocation();
    if (setMapCenter) {
      setMapCenter(setMapCenterFunc);
    }
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
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
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={MapView.PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
          pinColor="green"
          zIndex={1000} // Aktuální pozice je vždy nad ostatními
        />
        {returnPoint && (
          <Marker
            coordinate={{
              latitude: returnPoint.latitude,
              longitude: returnPoint.longitude,
            }}
            title="Return Point"
            pinColor="red"
          />
        )}
        {points.map((point, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: point.location.latitude,
              longitude: point.location.longitude,
            }}
            title={point.description || "No Description"}
            description={point.detailedDescription || ""}
            pinColor="blue"
            onPress={() => {
              if (onMarkerClick) {
                onMarkerClick(index, point);
              }
            }}
          />
        ))}
      </MapView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
