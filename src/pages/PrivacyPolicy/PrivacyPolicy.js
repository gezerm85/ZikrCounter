import React, { useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useExploreTheme } from "../../utils/Theme/ExploreTheme";
import { ExploreScreen as Screen, ExploreHeader } from "../../components/explore/ExploreUI";

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const { c } = useExploreTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  return (
    <Screen>
      <ExploreHeader title={t("PRIVACY_POLICY")} onBack={() => navigation.goBack()} />
      <View style={[styles.container, { backgroundColor: c.bg }]}>
        <WebView
          source={{ uri: "https://www.termsfeed.com/live/c1654a6a-e871-4fb6-a420-ed2dfe8049ab" }}
          onLoadEnd={() => setLoading(false)}
          style={{ flex: 1, backgroundColor: c.bg }}
        />
        {loading && (
          <View style={[styles.loadingContainer, { backgroundColor: c.bg }]}>
            <ActivityIndicator size="large" color={c.gold} />
          </View>
        )}
      </View>
    </Screen>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" },
});
