import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';



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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    padding: 20,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "flex-start",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    height: 48,
    textAlignVertical: "center",
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    height: 48,
    textAlignVertical: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    height: 48,
    gap: 16,
  },
  button: {
    height: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "OpenSans",
  },
});