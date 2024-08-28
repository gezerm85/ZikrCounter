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
          uri: "https://www.termsfeed.com/live/c1654a6a-e871-4fb6-a420-ed2dfe8049ab",
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
