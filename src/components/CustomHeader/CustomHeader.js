import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useExploreTheme } from '../../utils/Theme/ExploreTheme';

const CustomHeader = ({ title, subtitle, right }) => {
  const { c, fonts } = useExploreTheme();
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.headerTitle, { color: c.ink, fontFamily: fonts.display }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.headerSubtitle, { color: c.muted, fontFamily: fonts.ui }]}>{subtitle}</Text>
        ) : null}
      </View>
      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '400',
  },
});

export default CustomHeader;
