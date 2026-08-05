import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  title: string;
  description: string;
  actionLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** If provided, show an explanation of why this action is happening */
  whyExplanation?: string;
  /** Mark as high-risk to show red warning UI */
  highRisk?: boolean;
}

/**
 * ConfirmActionModal — consent gate for high-risk or irreversible actions.
 * Shown before: email sends, social media posts, GitHub deploys, billing actions.
 * Also surfaces a "why this action" explainability snippet when provided.
 */
export function ConfirmActionModal({
  visible,
  title,
  description,
  actionLabel = 'Confirm',
  onConfirm,
  onCancel,
  whyExplanation,
  highRisk = false,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, highRisk && styles.modalHighRisk]}>
          <Text style={styles.icon}>{highRisk ? '⚠️' : 'ℹ️'}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          {whyExplanation ? (
            <View style={styles.whyBox}>
              <Text style={styles.whyLabel}>Why is Q-Bot doing this?</Text>
              <Text style={styles.whyText}>{whyExplanation}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.confirmBtn, highRisk && styles.confirmBtnHighRisk]}
            onPress={onConfirm}
          >
            <Text style={styles.confirmBtnText}>{actionLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.3)',
  },
  modalHighRisk: {
    borderColor: 'rgba(255,23,68,0.4)',
  },
  icon: { fontSize: 40, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 10, textAlign: 'center' },
  description: { fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 22, textAlign: 'center', marginBottom: 16 },
  whyBox: {
    backgroundColor: 'rgba(0,255,255,0.06)',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.15)',
  },
  whyLabel: { fontSize: 11, fontWeight: '700', color: '#00FFFF', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  whyText: { fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 20 },
  confirmBtn: {
    backgroundColor: '#4169E1',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmBtnHighRisk: { backgroundColor: '#FF1744' },
  confirmBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  cancelBtn: { paddingVertical: 8 },
  cancelBtnText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
});
