import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { RootStackParamList } from '../navigation/RootNavigator';
import { GradientButton } from '../components/GradientButton';
import { SUBSCRIPTION_TIERS } from '../constants';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const upgradeTier = useAuthStore((s) => s.upgradeTier);
  const tier = useSubscriptionStore((s) => s.tier);
  const [promoCode, setPromoCode] = useState('');
  const [masterCode, setMasterCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');

  const handleApplyPromo = async () => {
    const success = await useAuthStore.getState().applyPromoCode(promoCode);
    setPromoMessage(success ? 'Promo code applied successfully!' : 'Invalid promo code.');
    setTimeout(() => setPromoMessage(''), 3000);
  };

  const handleMasterCode = () => {
    const success = useAuthStore.getState().applyMasterCode(masterCode);
    setPromoMessage(success ? 'Elite access unlocked! 🎉' : 'Invalid master code.');
    setTimeout(() => setPromoMessage(''), 3000);
    if (success) setMasterCode('');
  };

  const tierInfo = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || '?'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
            <View style={[styles.tierBadge, { backgroundColor: tier === 'elite' ? '#D4AF37' : tier === 'pro' ? '#BF00FF' : '#4169E1' }]}>
              <Text style={styles.tierBadgeText}>{tierInfo.name}</Text>
            </View>
          </View>
        </View>

        {/* Referral Code */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎁 Referral Program</Text>
          <Text style={styles.cardSub}>Share your code. Both get rewards.</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{user?.referralCode || 'N/A'}</Text>
            <TouchableOpacity style={styles.copyBtn}>
              <Text style={styles.copyBtnText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Promo Code */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎟️ Promo Code</Text>
          <View style={styles.promoRow}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter code"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={promoCode}
              onChangeText={setPromoCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.promoBtn} onPress={handleApplyPromo}>
              <Text style={styles.promoBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
          {promoMessage ? <Text style={styles.promoMessage}>{promoMessage}</Text> : null}
        </View>

        {/* Master Code (hidden) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔑 Master Access</Text>
          <View style={styles.promoRow}>
            <TextInput
              style={styles.promoInput}
              placeholder="Master code"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={masterCode}
              onChangeText={setMasterCode}
              secureTextEntry
            />
            <TouchableOpacity style={styles.promoBtn} onPress={handleMasterCode}>
              <Text style={styles.promoBtnText}>Unlock</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Subscription Tiers */}
        <Text style={styles.sectionTitle}>Subscription</Text>
        {Object.entries(SUBSCRIPTION_TIERS).map(([key, info]) => (
          <TouchableOpacity
            key={key}
            style={[styles.tierCard, tier === key && styles.tierCardActive]}
            onPress={() => {
              if (key !== 'free') navigation.navigate('Checkout', { packageId: key });
            }}
          >
            <View style={styles.tierHeader}>
              <Text style={styles.tierName}>{info.name}</Text>
              <Text style={styles.tierPrice}>
                {info.price === 0 ? 'Free' : `$${info.price}/mo`}
              </Text>
            </View>
            <Text style={styles.tierFeature}>• {info.maxProjects} projects</Text>
            <Text style={styles.tierFeature}>• {info.maxAutomations} automations</Text>
            <Text style={styles.tierFeature}>• {info.aiRequestsPerDay} AI requests/day</Text>
            {tier === key && <Text style={styles.currentBadge}>Current Plan</Text>}
          </TouchableOpacity>
        ))}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.actionText}>⚙️ Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Support')}>
            <Text style={styles.actionText}>🆘 Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Referrals')}>
            <Text style={styles.actionText}>👥 Referrals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.logoutBtn]} onPress={logout}>
            <Text style={styles.logoutText}>🚪 Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 20 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.2)',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4169E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  tierBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  tierBadgeText: { fontSize: 11, fontWeight: 'bold', color: '#FFFFFF' },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.15)',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  cardSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12 },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A1A',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.2)',
  },
  codeText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#00FFFF', letterSpacing: 1 },
  copyBtn: { backgroundColor: '#4169E1', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6 },
  copyBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  promoRow: { flexDirection: 'row', gap: 8 },
  promoInput: {
    flex: 1,
    backgroundColor: '#0A0A1A',
    borderRadius: 10,
    padding: 12,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.2)',
    fontSize: 14,
  },
  promoBtn: { backgroundColor: '#4169E1', paddingHorizontal: 16, borderRadius: 10, justifyContent: 'center' },
  promoBtnText: { color: '#FFFFFF', fontWeight: '600' },
  promoMessage: { marginTop: 8, fontSize: 12, color: '#00C853' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginTop: 8, marginBottom: 12 },
  tierCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tierCardActive: { borderColor: '#4169E1', backgroundColor: 'rgba(65,105,225,0.08)' },
  tierHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  tierName: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  tierPrice: { fontSize: 14, fontWeight: '600', color: '#00FFFF' },
  tierFeature: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 2 },
  currentBadge: { marginTop: 8, fontSize: 11, color: '#00C853', fontWeight: '600' },
  actions: { marginTop: 16, gap: 8 },
  actionBtn: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  actionText: { fontSize: 14, color: '#FFFFFF' },
  logoutBtn: { borderColor: 'rgba(255,23,68,0.3)' },
  logoutText: { color: '#FF1744' },
});
