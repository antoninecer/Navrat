import * as Location from "expo-location";

export const averageGpsCoordinates = async (
  sampleCount = 10,
  maxDeviation = 0.0001
) => {
  let samples = [];
  for (let i = 0; i < sampleCount; i++) {
    let { coords } = await Location.getCurrentPositionAsync({});

    if (samples.length > 0) {
      const { latitude, longitude } = coords;
      const avgLat =
        samples.reduce((sum, { latitude }) => sum + latitude, 0) /
        samples.length;
      const avgLon =
        samples.reduce((sum, { longitude }) => sum + longitude, 0) /
        samples.length;

      const latDeviation = Math.abs(latitude - avgLat);
      const lonDeviation = Math.abs(longitude - avgLon);

      if (latDeviation < maxDeviation && lonDeviation < maxDeviation) {
        samples.push(coords);
      }
    } else {
      samples.push(coords);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 sekunda mezi měřeními
  }

  if (samples.length > 0) {
    const latSum = samples.reduce((sum, { latitude }) => sum + latitude, 0);
    const lonSum = samples.reduce((sum, { longitude }) => sum + longitude, 0);

    return {
      latitude: latSum / samples.length,
      longitude: lonSum / samples.length,
    };
  } else {
    throw new Error("Žádná validní GPS měření nebyla zaznamenána.");
  }
};
