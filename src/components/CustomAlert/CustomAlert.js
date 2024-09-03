import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, View, Text,  TouchableOpacity } from 'react-native';
import styles from './CustomAlert.style'



const CustomAlert = ({ visible, onClose, onConfirm }) => {

    const { t } = useTranslation()
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t("RESET_COUNTER")}</Text>
          <Text style={styles.modalMessage}>{t("CONFIRM_RESET")}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onConfirm} style={styles.button}>
              <Text style={styles.buttonText}>{t("YES")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>{t("NO")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default CustomAlert;