import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentIndex } from '../../redux/CounterSlice';
import { setTheme } from '../../utils/Theme/Theme';
import { fixedColors } from '../../utils/Theme/VectorTheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const ThemeModal = ({ isVisible, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentIndex } = useSelector((state) => state.counter);
  const [selectedIndex, setSelectedIndex] = useState(currentIndex);

  const handleThemeSelect = (index) => {
    setSelectedIndex(index);
  };

  const handleConfirm = () => {
    dispatch(setCurrentIndex(selectedIndex));
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("THEME_SELECTION")}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.themeGrid}>
              {setTheme.map((theme, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.themeItem,
                    selectedIndex === index && styles.selectedTheme,
                  ]}
                  onPress={() => handleThemeSelect(index)}
                >
                  <View style={styles.themePreview}>
                    <Image
                      source={theme.img}
                      style={styles.themeImage}
                      resizeMode="contain"
                    />
   
                  </View>
                  <Text style={styles.themeNumber}>Tema {index + 1}</Text>
                  {selectedIndex === index && (
                    <View style={styles.selectedIndicator}>
                      <MaterialIcons name="check" size={20} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Onayla Butonu */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>{t("CONFIRM")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'OpenSans',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    maxHeight: 600,
  },
  scrollContent: {
    padding: 20,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  themeItem: {
    width: (width - 100) / 2,
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  selectedTheme: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  themePreview: {
    width: '100%',
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 6,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  themeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  themeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 16,
    flexDirection: 'row',
    paddingHorizontal: 2,
    paddingVertical: 1,
    gap: 2,
  },
  colorPreview: {
    flex: 1,
    height: '100%',
    borderRadius: 4,
  },
  themeNumber: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'OpenSans',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  selectedTheme: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'OpenSans',
  },
});

export default ThemeModal;
