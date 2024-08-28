import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    width: 350,
    height: 450,
    alignItems: "center",
    justifyContent: "center",
  },
  bgImg: {
    resizeMode: "contain",
  },
  title: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    fontFamily: "OpenSans",
    width: "100%",
    textAlign: "center",
  },
  bodyContainer: {
    height: "85%",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  screenContainer: {
    width: "100%",
    height: "25%",
    alignItems: "center",
    justifyContent: "center",
  },

  innerContainer: {
    flexDirection: "row",
    width: "100%",
    height: "25%",
    alignItems: "center",
    justifyContent: "center",
    gap: 70,
  },
  btnContainer: {
    width: "100%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  btnBox: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  bigCircle: {
    height: 155,
    width: 155,
    borderRadius: 600,
    backgroundColor: "#6D804C",
  },
  smallCircle: {
    backgroundColor: "#fff",
    height: 51,
    width: 51,
    borderRadius: 100,
  },
  screen: {
    backgroundColor: "#C3C3C3",
    height: "80%",
    width: "70%",
    borderRadius: 16,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  text: {
    color: "#000",
    height: "100%",
    fontFamily: "digital",
    textAlignVertical: "center",
    marginRight: 6,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
