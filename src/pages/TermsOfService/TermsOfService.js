import React, { useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

const PrivacyPolicy = () => {
  const [loading, setLoading] = useState(false);
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1717e5" />
        </View>
      )}
      <WebView
        source={{
          uri: "https://www.termsfeed.com/live/097ccdc9-1c16-49f6-a9b6-1507eb8c8502",
        }}
        onLoad={() => setLoading(false)}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
