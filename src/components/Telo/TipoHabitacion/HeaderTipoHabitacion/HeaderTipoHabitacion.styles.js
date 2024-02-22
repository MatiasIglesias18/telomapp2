import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  content: {
    justifyContent: "flex-start",
    padding: 15,
  },
  titleView: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    marginTop: 5,
    color: "#828282",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 5,
  }
});
