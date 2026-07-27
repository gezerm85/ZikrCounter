import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useExploreTheme } from '../../utils/Theme/ExploreTheme';

const CustomAlert = ({ visible, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const { c, fonts } = useExploreTheme();
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: c.overlay }]}>
        <View style={[styles.body, { backgroundColor: c.surface, borderColor: c.line }]}>
          <Text style={[styles.title, { color: c.ink, fontFamily: fonts.display }]}>{t('RESET_COUNTER')}</Text>
          <Text style={[styles.message, { color: c.inkSoft, fontFamily: fonts.ui }]}>{t('CONFIRM_RESET')}</Text>
          <View style={styles.btnBox}>
            <Pressable onPress={onClose} style={[styles.ghostBtn, { borderColor: c.line }]}>
              <Text style={{ color: c.inkSoft, fontFamily: fonts.ui, fontSize: 14, fontWeight: '600' }}>{t('NO')}</Text>
            </Pressable>
            <Pressable onPress={onConfirm} style={[styles.primaryBtn, { backgroundColor: c.gold }]}>
              <Text style={{ color: c.onAcc, fontFamily: fonts.ui, fontSize: 14, fontWeight: '700' }}>{t('YES')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  body: { padding: 20, borderRadius: 20, borderWidth: 1, width: '100%', maxWidth: 400 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  message: { fontSize: 15, lineHeight: 22, marginBottom: 20 },
  btnBox: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  ghostBtn: { height: 44, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1 },
  primaryBtn: { height: 44, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
});
