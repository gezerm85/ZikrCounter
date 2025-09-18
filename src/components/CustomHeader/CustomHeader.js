import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fixedColors } from '../../utils/Theme/VectorTheme';

const CustomHeader = ({ title, subtitle }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle && (
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'OpenSans',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'OpenSans',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default CustomHeader;
