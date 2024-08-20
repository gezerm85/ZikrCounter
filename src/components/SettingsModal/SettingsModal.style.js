import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    gap: 12,
    borderRadius: 8,
    alignItems: "flex-start",
  },
  bodyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  innerContainer: {
    gap: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "OpenSans",
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    fontFamily: "OpenSans",
  },

  btnBox: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  button: {
    padding: 10,
  },
});
