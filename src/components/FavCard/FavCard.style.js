import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    position: "relative",
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
    fontWeight: "700",
    fontSize: 22,
    color: "#ffffff",
    textAlignVertical: "center",
    fontFamily: "OpenSans",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50000,
  },
  bodyContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  menuBox: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menu: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  menuItem:{
    height: 48,
  },
  menuText:{
    color: '#000',
    fontSize: 16
  },
  textFav: {
    color: "#1a1a1a",
    fontWeight: "900",
    fontSize: 18,
    fontFamily: "OpenSans",
  },
  textDate: {
    color: "#1a1a1a",
    fontWeight: "400",
    fontSize: 16,
    fontFamily: "OpenSans",
  },
  menuContent: {
    top: 35,
    right: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
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
