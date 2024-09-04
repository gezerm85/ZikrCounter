import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    gap: 16,
    borderRadius: 8,
    alignItems: "flex-start",
  },
  bodyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    width: '100%'
  },
  innerContainer: {
    gap: 16,
    width: '100%'
  },
  switch:{
    width: 56,    
    height: 56, 
    alignItems:'center',
    justifyContent:'center',
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "OpenSans",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    fontFamily: "OpenSans",
  },

  btnBox: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    height: 48,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#b2a9a9'
  },

  button: {
    padding: 10,
  },
  fontContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
