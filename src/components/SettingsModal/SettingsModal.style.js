import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 8,
    borderRadius: 8,
    alignItems: "flex-start",
  
  },
  bodyContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: '100%',
    gap: 16
  },
  innerContainer: {
    gap: 16,
    width: '100%'
  },
  switchContainer:{
    alignItems:'center',
    justifyContent:'center',
  },
  switch:{
   transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
   width: 48,
   height: 48,
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "OpenSans",
    color: '#000'
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    fontFamily: "OpenSans",
    color: '#000'
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
  fontBtn:{
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent:'center',
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
