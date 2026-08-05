import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientButton } from '../components/GradientButton';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useAuthStore } from '../stores/authStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAuthStore((s) => s.user);

  const stats = [
    { label: 'Min Buildout', value: '90', suffix: '' },
    { label: 'Hours Saved/Week', value: '15+', suffix: '' },
    { label: 'ROI Average', value: '3.7x', suffix: '' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🧜🏾‍♀️ MICHELLE & Q-BOT</Text>
          </View>
          <Text style={styles.title}>
            Build Your{' '}
            <Text style={styles.gradientText}>Empire on Autopilot.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Meet Michelle, the Mermaid Queen of the Deep, and her son Q-Bot. Together they turn your idea into a real business.
          </Text>
          <GradientButton
            title="Start Building Now"
            onPress={() => navigation.navigate('Checkout', { packageId: 'empire-pro' })}
            size="lg"
            style={styles.cta}
          />
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statBox}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Brand Story */}
        <LinearGradient
          colors={['rgba(65,105,225,0.1)', 'rgba(191,0,255,0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.storyCard}
        >
          <View style={styles.storyContent}>
            <View>
              <Text style={styles.storyTitle}>Guided by Michelle, Powered by Q-Bot</Text>
              <Text style={styles.storyText}>
                Michelle is the Black Mermaid Queen of the Deep — a symbol of creativity, resilience, and transformation.
              </Text>
              <View style={styles.bulletList}>
                {['🌊 Clear, beautiful automation', '🤖 Q-Bot handles the tech', '✨ Built for founders who want results fast'].map((b, i) => (
                  <Text key={i} style={styles.bullet}>{b}</Text>
                ))}
              </View>
            </View>
            <View style={styles.mermaidBox}>
              <Text style={styles.mermaidEmoji}>🧜🏾‍♀️</Text>
              <Text style={styles.mermaidTitle}>Michelle & Q-Bot</Text>
              <Text style={styles.mermaidSub}>Your guides from idea to empire</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {[
            { icon: '📋', label: 'New Project', route: 'Checkout' as const, params: { packageId: 'foundation' } },
            { icon: '🤖', label: 'AI Assistant', route: 'Main' as const },
            { icon: '📊', label: 'Dashboard', route: 'Main' as const },
            { icon: '👥', label: 'Referrals', route: 'Referrals' as const },
          ].map((a, i) => (
            <TouchableOpacity
              key={i}
              style={styles.actionCard}
              onPress={() => {
                if (a.route === 'Checkout') navigation.navigate(a.route, a.params as any);
                else if (a.route === 'Referrals') navigation.navigate(a.route);
              }}
            >
              <Text style={styles.actionIcon}>{a.icon}</Text>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginTop: 20 },
  badge: {
    backgroundColor: 'rgba(191,0,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(191,0,255,0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  badgeText: { color: '#00FFFF', fontSize: 12, fontWeight: '600' },
  title: { fontSize: 36, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', lineHeight: 44 },
  gradientText: { color: '#00FFFF' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 16, maxWidth: 320 },
  cta: { marginTop: 24, width: '80%' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 32, marginBottom: 24 },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '900', color: '#00FFFF' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  storyCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.2)',
    padding: 20,
    marginBottom: 24,
  },
  storyContent: { gap: 16 },
  storyTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  storyText: { fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 20 },
  bulletList: { marginTop: 12, gap: 8 },
  bullet: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  mermaidBox: {
    backgroundColor: 'rgba(65,105,225,0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.1)',
  },
  mermaidEmoji: { fontSize: 48 },
  mermaidTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginTop: 8 },
  mermaidSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 64) / 2,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.15)',
  },
  actionIcon: { fontSize: 28, marginBottom: 8 },
  actionLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
});
