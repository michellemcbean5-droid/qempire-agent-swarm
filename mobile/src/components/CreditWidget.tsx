import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useCreditStore } from '../stores/creditStore';

interface Props {
  onUpgradePress?: () => void;
}

export function CreditBadge({ onUpgradePress }: Props) {
  const balance = useCreditStore((s) => s.balance);
  const spentToday = useCreditStore((s) => s.spentToday);
  const dailyCap = useCreditStore((s) => s.dailyCap);

  const isLow = balance <= 10;
  const isCritical = balance <= 0;

  return (
    <TouchableOpacity style={[styles.badge, isLow && styles.badgeLow, isCritical && styles.badgeCritical]} onPress={onUpgradePress}>
      <Text style={styles.icon}>{isCritical ? '🚫' : isLow ? '⚠️' : '⚡'}</Text>
      <Text style={[styles.balance, isLow && styles.balanceLow]}>
        {balance} credits
      </Text>
      <Text style={styles.sub}>{spentToday}/{dailyCap} today</Text>
    </TouchableOpacity>
  );
}

export function LowCreditModal({ visible, onClose, onUpgrade }: { visible: boolean; onClose: () => void; onUpgrade: () => void }) {
  const balance = useCreditStore((s) => s.balance);
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.modalIcon}>{balance <= 0 ? '🚫' : '⚠️'}</Text>
          <Text style={styles.modalTitle}>{balance <= 0 ? 'Credits Exhausted' : 'Low AI Credits'}</Text>
          <Text style={styles.modalBody}>
            {balance <= 0
              ? "You've used all your AI credits. Upgrade your plan to continue building with Q-Bot and the agent crew."
              : `You only have ${balance} AI credits remaining. Upgrade to Pro or Elite for more.`}
          </Text>
          <TouchableOpacity style={styles.upgradeBtn} onPress={onUpgrade}>
            <Text style={styles.upgradeBtnText}>Upgrade Plan ✨</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export function CreditUsageLog() {
  const usageLog = useCreditStore((s) => s.usageLog);
  return (
    <ScrollView style={styles.log} showsVerticalScrollIndicator={false}>
      {usageLog.length === 0 ? (
        <Text style={styles.logEmpty}>No usage yet</Text>
      ) : (
        usageLog.map((entry, i) => (
          <View key={i} style={styles.logEntry}>
            <Text style={styles.logAction}>{entry.action}</Text>
            <Text style={styles.logCost}>-{entry.cost} ⚡</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(65,105,225,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.3)',
  },
  badgeLow: {
    backgroundColor: 'rgba(255,179,0,0.15)',
    borderColor: 'rgba(255,179,0,0.4)',
  },
  badgeCritical: {
    backgroundColor: 'rgba(255,23,68,0.15)',
    borderColor: 'rgba(255,23,68,0.4)',
  },
  icon: { fontSize: 14 },
  balance: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  balanceLow: { color: '#FFB300' },
  sub: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modal: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,179,0,0.3)',
  },
  modalIcon: { fontSize: 48, marginBottom: 12 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 12, textAlign: 'center' },
  modalBody: { fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  upgradeBtn: {
    backgroundColor: '#4169E1',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  closeBtn: { paddingVertical: 8 },
  closeBtnText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  log: { maxHeight: 200 },
  logEntry: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  logAction: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  logCost: { fontSize: 12, color: '#FFB300', fontWeight: '600' },
  logEmpty: { fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingVertical: 12 },
});
