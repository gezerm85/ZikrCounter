import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnContainer: {
    width: width,
    height: "15%",
    flexDirection: "row",
    gap: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bodyContainer: {
    width: "100%",
    height: "75%",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    width: width,
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  btnBox: {
    backgroundColor: "#E7F0DC",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
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
