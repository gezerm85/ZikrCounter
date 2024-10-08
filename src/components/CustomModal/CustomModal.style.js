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
    fontSize: 18,
    fontFamily: "OpenSans",
    fontWeight: "900",
    color: '#000'
  },
  btnBox: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 16,
  },
  input: {
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    height: 48,
    color: '#333333'
  },
  button: {
   height: 48,
   paddingHorizontal: 24,
   alignItems: 'center',
   justifyContent: 'center',
  },
  buttonText:{
    fontSize: 16,
    fontFamily: "OpenSans",
    color: '#333333'
  },
});
