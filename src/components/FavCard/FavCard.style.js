import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    borderRadius: 8,
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  box: {
    width: "100%",

    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    gap: 8,
  },
  counter: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#1a1a1a",
    textAlignVertical: "center",
    fontFamily: "OpenSans",
  },
  bodyContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
  },
  innerContainer: {},
  removeBox: {},
  textFav: {
    color: "#1a1a1a",
    fontWeight: "900",
    fontSize: 18,
    fontFamily: "OpenSans",
  },
  textDate: {
    color: "#1a1a1a",
    fontWeight: "400",
    fontSize: 14,
    fontFamily: "OpenSans",
  },
});
