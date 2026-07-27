// Reusable UI primitives for the Explore / Qur'an / Hadith design system.
// All components read the current Explore theme (light/dark) internally.
// Faithful to the Zikirmatik v2.0 mockup token/spacing spec.

import React from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useTranslation } from "react-i18next";
import { useExploreTheme, RADIUS } from "../../utils/Theme/ExploreTheme";

// ---- Screen scaffold -------------------------------------------------------
export const ExploreScreen = ({ children, edges = ["top"], style }) => {
  const { c } = useExploreTheme();
  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor: c.bg }, style]}>
      {children}
    </SafeAreaView>
  );
};

// ---- Header ----------------------------------------------------------------
export const ExploreHeader = ({ title, subtitle, onBack, right }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <View style={styles.headerRow}>
      {onBack ? (
        <HeaderIconButton onPress={onBack} name="chevron-left" />
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: onBack ? 24 : 28, fontWeight: "700", color: c.ink }}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ fontFamily: fonts.ui, fontSize: 13, color: c.muted, marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
};

export const HeaderIconButton = ({ name, onPress, color, accent }) => {
  const { c } = useExploreTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.headerBtn,
        { backgroundColor: c.surface, borderColor: c.line, opacity: pressed ? 0.7 : 1 },
      ]}
      hitSlop={8}
    >
      <Feather name={name} size={20} color={color || (accent ? c.gold : c.ink)} />
    </Pressable>
  );
};

// ---- Card ------------------------------------------------------------------
export const Card = ({ children, style, surface, onPress }) => {
  const { c } = useExploreTheme();
  const bg = surface ? c.surface : c.card;
  const body = (
    <View
      style={[
        {
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: c.line,
          borderRadius: RADIUS.card,
          padding: 16,
          shadowColor: c.shadow,
          shadowOpacity: 1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.99 : 1 }] })}>
      {body}
    </Pressable>
  );
};

// ---- Icon chip -------------------------------------------------------------
export const IconChip = ({ name, size = 50, icon = 24 }) => {
  const { c } = useExploreTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size >= 44 ? 15 : 11,
        backgroundColor: c.goldSoft,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Feather name={name} size={icon} color={c.gold} />
    </View>
  );
};

// ---- Pill / badge ----------------------------------------------------------
export const Pill = ({ children, tone = "soft" }) => {
  const { c, fonts } = useExploreTheme();
  const soft = tone === "soft";
  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: soft ? c.goldSoft : "transparent",
        borderWidth: soft ? 0 : 1,
        borderColor: c.line,
        borderRadius: RADIUS.pill,
        paddingVertical: 4,
        paddingHorizontal: 12,
      }}
    >
      <Text style={{ fontFamily: fonts.ui, fontSize: 11, fontWeight: "700", color: soft ? c.goldInk : c.inkSoft }}>
        {children}
      </Text>
    </View>
  );
};

// ---- Buttons ---------------------------------------------------------------
export const PrimaryButton = ({ label, icon, onPress, style, flex }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flex: flex ? 1 : undefined,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: c.gold,
          borderRadius: RADIUS.button,
          paddingVertical: 13,
          paddingHorizontal: 16,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {icon ? <Feather name={icon} size={17} color={c.onAcc} /> : null}
      <Text style={{ fontFamily: fonts.ui, fontSize: 14, fontWeight: "700", color: c.onAcc }}>{label}</Text>
    </Pressable>
  );
};

export const SoftButton = ({ label, icon, onPress, style, flex }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flex: flex ? 1 : undefined,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          backgroundColor: c.goldSoft,
          borderRadius: 12,
          paddingVertical: 10,
          paddingHorizontal: 14,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {icon ? <Feather name={icon} size={15} color={c.goldInk} /> : null}
      <Text style={{ fontFamily: fonts.ui, fontSize: 13, fontWeight: "700", color: c.goldInk }}>{label}</Text>
    </Pressable>
  );
};

export const OutlineButton = ({ label, icon, onPress, style, flex }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flex: flex ? 1 : undefined,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          backgroundColor: c.surface,
          borderWidth: 1,
          borderColor: c.line,
          borderRadius: 12,
          paddingVertical: 10,
          paddingHorizontal: 14,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      {icon ? <Feather name={icon} size={16} color={c.inkSoft} /> : null}
      {label ? (
        <Text style={{ fontFamily: fonts.ui, fontSize: 13, fontWeight: "600", color: c.inkSoft }}>{label}</Text>
      ) : null}
    </Pressable>
  );
};

// ---- Section header --------------------------------------------------------
export const SectionHeader = ({ children, style }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <Text
      style={[
        { fontFamily: fonts.ui, fontSize: 12, fontWeight: "700", color: c.muted, letterSpacing: 1, marginTop: 20, marginBottom: 10, marginHorizontal: 4 },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

// ---- Search input ----------------------------------------------------------
export const SearchInput = ({ value, onChangeText, placeholder }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: c.surface,
        borderWidth: 1,
        borderColor: c.line,
        borderRadius: RADIUS.search,
        paddingVertical: 10,
        paddingHorizontal: 14,
      }}
    >
      <Feather name="search" size={18} color={c.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.muted}
        style={{ flex: 1, fontFamily: fonts.ui, fontSize: 14, color: c.ink, padding: 0 }}
        returnKeyType="search"
      />
    </View>
  );
};

// ---- Toggle ----------------------------------------------------------------
export const Toggle = ({ value, onValueChange }) => {
  const { c } = useExploreTheme();
  return (
    <Pressable onPress={() => onValueChange(!value)} style={{ width: 50, height: 29, borderRadius: 999, backgroundColor: value ? c.gold : c.line, justifyContent: "center" }}>
      <View
        style={{
          width: 23,
          height: 23,
          borderRadius: 999,
          backgroundColor: "#fff",
          position: "absolute",
          left: value ? 24 : 3,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      />
    </Pressable>
  );
};

// ---- Arabic text -----------------------------------------------------------
export const ArabicText = ({ children, size = 22, color, style }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <Text
      style={[
        {
          fontFamily: fonts.arabic,
          fontSize: size,
          lineHeight: size * 1.9,
          color: color || c.ink,
          writingDirection: "rtl",
          textAlign: "right",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

// ---- Chevron affordance ----------------------------------------------------
export const Chevron = () => {
  const { c } = useExploreTheme();
  return <Feather name="chevron-right" size={18} color={c.muted} />;
};

// ---- Offline banner --------------------------------------------------------
export const OfflineBanner = ({ visible }) => {
  const { c, fonts } = useExploreTheme();
  const { t } = useTranslation();
  if (!visible) return null;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: c.goldSoft, paddingVertical: 8, paddingHorizontal: 16 }}>
      <Feather name="wifi-off" size={14} color={c.goldInk} />
      <Text style={{ fontFamily: fonts.ui, fontSize: 12, color: c.goldInk, flex: 1 }}>{t("OFFLINE_CACHED")}</Text>
    </View>
  );
};

// ---- Loading / error / empty state ----------------------------------------
export const StateView = ({ status, message, onRetry }) => {
  const { c, fonts } = useExploreTheme();
  const { t } = useTranslation();
  return (
    <View style={{ paddingVertical: 60, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
      {status === "loading" ? (
        <ActivityIndicator color={c.gold} size="large" />
      ) : (
        <>
          <Feather
            name={status === "offline" ? "wifi-off" : status === "empty" ? "inbox" : "alert-circle"}
            size={34}
            color={c.muted}
          />
          <Text style={{ fontFamily: fonts.ui, fontSize: 15, color: c.inkSoft, textAlign: "center", marginTop: 14, lineHeight: 22 }}>
            {message}
          </Text>
          {onRetry ? (
            <Pressable onPress={onRetry} style={{ marginTop: 16 }}>
              <Text style={{ fontFamily: fonts.ui, fontSize: 14, fontWeight: "700", color: c.gold }}>{t("RETRY")}</Text>
            </Pressable>
          ) : null}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
