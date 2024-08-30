import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    marginVertical: 10,
  },
  imageNavigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 20,
  },
  coords: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
});
export default styles;
