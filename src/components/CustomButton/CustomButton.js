import { StyleSheet, Pressable, Text, View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { useExploreTheme } from "../../utils/Theme/ExploreTheme";

const CustomButton = ({ onPress }) => {
  const { t } = useTranslation();
  const { c, fonts } = useExploreTheme();
  return (
    <Pressable
      accessible={true}
      accessibilityLabel={t("INCREASE")}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: c.gold,
          shadowColor: c.gold,
          transform: [{ scale: pressed ? 0.96 : 1 }],
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <Text style={[styles.star, { color: c.onAcc }]}>✦</Text>
      <Text style={[styles.label, { color: c.onAcc, fontFamily: fonts.ui }]}>{t("PULL")}</Text>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btn: {
    height: 150,
    width: 150,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  star: {
    fontSize: 38,
    marginBottom: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 2,
  },
});
