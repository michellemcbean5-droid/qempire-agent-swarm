import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

interface AgentCard {
  id: string;
  name: string;
  specialty: string;
  personality: string;
  attitude: string;
  emoji: string;
  active: boolean;
  schedule: string;
}

const DEFAULT_AGENTS: AgentCard[] = [
  {
    id: 'qbot',
    name: 'Q-Bot',
    specialty: 'Master Orchestrator',
    personality: 'Professional',
    attitude: 'Motivating',
    emoji: '👑',
    active: true,
    schedule: '24/7',
  },
  {
    id: 'marketing-agent',
    name: 'Maya',
    specialty: 'Marketing',
    personality: 'Creative',
    attitude: 'Motivating',
    emoji: '🎨',
    active: true,
    schedule: 'Mon–Fri 9–5',
  },
  {
    id: 'finance-agent',
    name: 'Fiona',
    specialty: 'Finance',
    personality: 'Analytical',
    attitude: 'Strict',
    emoji: '💰',
    active: true,
    schedule: 'Mon–Fri 9–5',
  },
  {
    id: 'tech-agent',
    name: 'Theo',
    specialty: 'Technology',
    personality: 'Professional',
    attitude: 'Balanced',
    emoji: '⚡',
    active: true,
    schedule: 'Mon–Fri 9–5',
  },
  {
    id: 'legal-agent',
    name: 'Lexi',
    specialty: 'Legal',
    personality: 'Professional',
    attitude: 'Strict',
    emoji: '⚖️',
    active: true,
    schedule: 'Mon–Fri 9–5',
  },
  {
    id: 'sales-agent',
    name: 'Sam',
    specialty: 'Sales',
    personality: 'Aggressive',
    attitude: 'Urgent',
    emoji: '🎯',
    active: true,
    schedule: 'Mon–Fri 9–5',
  },
];

const ATTITUDE_COLORS: Record<string, string> = {
  Motivating: '#00FF88',
  Strict: '#FF6B6B',
  Balanced: '#00FFFF',
  Urgent: '#FFB347',
};

export default function AgentManagementScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Agent Crew</Text>
        <Text style={styles.subtitle}>Customize each agent's personality, attitude & schedule</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {DEFAULT_AGENTS.map((agent) => (
          <TouchableOpacity
            key={agent.id}
            style={styles.card}
            onPress={() => navigation.navigate('AgentDetail', { agentId: agent.id })}
            activeOpacity={0.8}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.emoji}>{agent.emoji}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.agentName}>{agent.name}</Text>
                <Text style={styles.agentSpecialty}>{agent.specialty}</Text>
                <View style={styles.tagRow}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{agent.personality}</Text>
                  </View>
                  <View style={[styles.tag, { borderColor: ATTITUDE_COLORS[agent.attitude] || '#00FFFF' }]}>
                    <Text style={[styles.tagText, { color: ATTITUDE_COLORS[agent.attitude] || '#00FFFF' }]}>
                      {agent.attitude}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.cardRight}>
              <View style={[styles.statusDot, { backgroundColor: agent.active ? '#00FF88' : '#666' }]} />
              <Text style={styles.scheduleText}>{agent.schedule}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>🤖 How agents work</Text>
          <Text style={styles.infoText}>
            Each agent reports to Q-Bot and specializes in their area. Customize their personality to match your brand — from strict and analytical to creative and motivating.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  header: { padding: 20, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  scroll: { padding: 16, gap: 12, paddingBottom: 40 },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.2)',
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  emoji: { fontSize: 36 },
  cardInfo: { flex: 1 },
  agentName: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  agentSpecialty: { fontSize: 12, color: '#00FFFF', marginTop: 2 },
  tagRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  tag: {
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.4)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  cardRight: { alignItems: 'center', gap: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  scheduleText: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
  chevron: { fontSize: 20, color: 'rgba(255,255,255,0.3)' },
  infoBox: {
    backgroundColor: 'rgba(65,105,225,0.08)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.15)',
    marginTop: 8,
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  infoText: { fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 19 },
});
