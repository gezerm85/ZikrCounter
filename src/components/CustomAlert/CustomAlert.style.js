import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    padding: 20,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "flex-start",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    height: 48,
    textAlignVertical: "center",
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    height: 48,
    textAlignVertical: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    height: 48,
    gap: 16,
  },
  button: {
    height: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "OpenSans",
  },
});
