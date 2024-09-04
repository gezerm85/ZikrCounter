import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {},
  bodyContainer: {
    backgroundColor: "#fff",
    padding: 16,
    gap: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: "OpenSans",
    fontWeight: "900",
  },
  btnBox: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 16,
  },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingLeft: 4,
    fontSize: 18,
    fontFamily: "OpenSans",
  },
  button: {
    height: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 16,
    fontFamily: "OpenSans",
  },
});
