import React, { useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useExploreTheme } from "../../utils/Theme/ExploreTheme";
import { ExploreScreen as Screen, ExploreHeader } from "../../components/explore/ExploreUI";

const TermsOfService = () => {
  const { t } = useTranslation();
  const { c } = useExploreTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  return (
    <Screen>
      <ExploreHeader title={t("TERMS_OF_SERVICE")} onBack={() => navigation.goBack()} />
      <View style={[styles.container, { backgroundColor: c.bg }]}>
        <WebView
          source={{ uri: "https://www.termsfeed.com/live/097ccdc9-1c16-49f6-a9b6-1507eb8c8502" }}
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

export default TermsOfService;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" },
});
