import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../stores/authStore';
import { GradientButton } from '../components/GradientButton';

export default function ReferralsScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const referralCode = user?.referralCode || 'N/A';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on Q-Empire! Use my code ${referralCode} to get started building your empire. https://qempire.app`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const milestones = [
    { count: 1, reward: '10 AI Credits' },
    { count: 5, reward: '1 Month Pro Free' },
    { count: 10, reward: '3 Months Elite' },
    { count: 25, reward: 'Lifetime Elite Access' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Referrals</Text>
        <Text style={styles.subtitle}>Share Q-Empire. Earn rewards.</Text>

        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Your Referral Code</Text>
          <Text style={styles.codeValue}>{referralCode}</Text>
          <Text style={styles.codeHint}>Friends get 20% off. You get credits.</Text>
        </View>

        <GradientButton title="Share with Friends" onPress={handleShare} style={styles.shareBtn} />

        <Text style={styles.sectionTitle}>Milestones</Text>
        {milestones.map((m, i) => (
          <View key={i} style={styles.milestoneRow}>
            <View style={styles.milestoneDot}>
              <Text style={styles.milestoneNum}>{m.count}</Text>
            </View>
            <View style={styles.milestoneContent}>
              <Text style={styles.milestoneReward}>{m.reward}</Text>
              <Text style={styles.milestoneDesc}>{m.count} successful referral{m.count > 1 ? 's' : ''}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  scroll: { padding: 24, paddingBottom: 40 },
  backBtn: { marginBottom: 16 },
  backText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 },
  codeCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    marginBottom: 16,
  },
  codeLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  codeValue: { fontSize: 32, fontWeight: '900', color: '#D4AF37', letterSpacing: 2, marginBottom: 8 },
  codeHint: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  shareBtn: { width: '100%', marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
  milestoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  milestoneDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(65,105,225,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  milestoneNum: { fontSize: 14, fontWeight: 'bold', color: '#4169E1' },
  milestoneContent: { flex: 1 },
  milestoneReward: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  milestoneDesc: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
});
