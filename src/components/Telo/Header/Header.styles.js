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
  },
  description: {
    marginTop: 5,
    color: "#828282",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 300,
  }
});
