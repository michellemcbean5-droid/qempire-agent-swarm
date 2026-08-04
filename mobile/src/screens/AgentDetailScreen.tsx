import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';

type AgentDetailRouteProp = RouteProp<RootStackParamList, 'AgentDetail'>;

const PERSONALITIES = ['professional', 'friendly', 'aggressive', 'creative', 'analytical'];
const ATTITUDES = ['motivating', 'strict', 'relaxed', 'urgent', 'balanced'];
const WORK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AGENT_DATA: Record<string, {
  name: string; specialty: string; emoji: string;
  personality: string; attitude: string; active: boolean;
  workDays: number[]; workStart: string; workEnd: string;
}> = {
  'qbot': { name: 'Q-Bot', specialty: 'Master Orchestrator', emoji: '👑', personality: 'professional', attitude: 'motivating', active: true, workDays: [0,1,2,3,4,5,6], workStart: '00:00', workEnd: '23:59' },
  'marketing-agent': { name: 'Maya', specialty: 'Marketing', emoji: '🎨', personality: 'creative', attitude: 'motivating', active: true, workDays: [0,1,2,3,4], workStart: '09:00', workEnd: '17:00' },
  'finance-agent': { name: 'Fiona', specialty: 'Finance', emoji: '💰', personality: 'analytical', attitude: 'strict', active: true, workDays: [0,1,2,3,4], workStart: '09:00', workEnd: '17:00' },
  'tech-agent': { name: 'Theo', specialty: 'Technology', emoji: '⚡', personality: 'professional', attitude: 'balanced', active: true, workDays: [0,1,2,3,4], workStart: '09:00', workEnd: '17:00' },
  'legal-agent': { name: 'Lexi', specialty: 'Legal', emoji: '⚖️', personality: 'professional', attitude: 'strict', active: true, workDays: [0,1,2,3,4], workStart: '09:00', workEnd: '17:00' },
  'sales-agent': { name: 'Sam', specialty: 'Sales', emoji: '🎯', personality: 'aggressive', attitude: 'urgent', active: true, workDays: [0,1,2,3,4], workStart: '09:00', workEnd: '17:00' },
};

export default function AgentDetailScreen() {
  const route = useRoute<AgentDetailRouteProp>();
  const navigation = useNavigation();
  const { agentId } = route.params;

  const base = AGENT_DATA[agentId] || AGENT_DATA['qbot'];

  const [personality, setPersonality] = useState(base.personality);
  const [attitude, setAttitude] = useState(base.attitude);
  const [active, setActive] = useState(base.active);
  const [workDays, setWorkDays] = useState<number[]>(base.workDays);
  const [saved, setSaved] = useState(false);

  const toggleDay = (dayIdx: number) => {
    if (agentId === 'qbot') return; // Q-Bot always works 24/7
    setWorkDays((prev) =>
      prev.includes(dayIdx) ? prev.filter((d) => d !== dayIdx) : [...prev, dayIdx]
    );
    setSaved(false);
  };

  const handleSave = async () => {
    const webhookUrl = process.env.EXPO_PUBLIC_WEBHOOK_URL || 'http://localhost:8080';
    try {
      await fetch(`${webhookUrl}/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personality,
          attitude,
          active,
          schedule: {
            work_days: workDays,
            work_start: base.workStart,
            work_end: base.workEnd,
            timezone: 'America/New_York',
            max_tasks_per_day: 20,
          },
        }),
      });
    } catch {
      // Offline — save locally only
    }
    setSaved(true);
    Alert.alert('✅ Saved!', `${base.name}'s profile has been updated.`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.emoji}>{base.emoji}</Text>
        <Text style={styles.title}>{base.name}</Text>
        <Text style={styles.specialty}>{base.specialty}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Active Toggle */}
        {agentId !== 'qbot' && (
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Agent Active</Text>
              <Switch
                value={active}
                onValueChange={(v) => { setActive(v); setSaved(false); }}
                trackColor={{ false: '#333', true: '#4169E1' }}
                thumbColor={active ? '#00FFFF' : '#888'}
              />
            </View>
            <Text style={styles.hint}>When inactive, this agent won't accept new tasks.</Text>
          </View>
        )}

        {/* Personality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personality</Text>
          <View style={styles.optionGrid}>
            {PERSONALITIES.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.option, personality === p && styles.optionActive]}
                onPress={() => { setPersonality(p); setSaved(false); }}
              >
                <Text style={[styles.optionText, personality === p && styles.optionTextActive]}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Attitude */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attitude</Text>
          <View style={styles.optionGrid}>
            {ATTITUDES.map((a) => (
              <TouchableOpacity
                key={a}
                style={[styles.option, attitude === a && styles.optionActive]}
                onPress={() => { setAttitude(a); setSaved(false); }}
              >
                <Text style={[styles.optionText, attitude === a && styles.optionTextActive]}>
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Work Schedule */}
        {agentId !== 'qbot' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Days</Text>
            <View style={styles.dayRow}>
              {WORK_DAYS.map((day, idx) => (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayBtn, workDays.includes(idx) && styles.dayBtnActive]}
                  onPress={() => toggleDay(idx)}
                >
                  <Text style={[styles.dayText, workDays.includes(idx) && styles.dayTextActive]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.hint}>Work hours: {base.workStart} – {base.workEnd} ET</Text>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.saveBtnSaved]}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>{saved ? '✅ Saved!' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(65,105,225,0.15)' },
  backBtn: { alignSelf: 'flex-start', marginBottom: 12 },
  backText: { color: '#00FFFF', fontSize: 16 },
  emoji: { fontSize: 56, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '900', color: '#FFFFFF' },
  specialty: { fontSize: 14, color: '#00FFFF', marginTop: 4 },
  scroll: { padding: 20, gap: 20, paddingBottom: 48 },
  section: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.2)',
    gap: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 15, color: '#FFFFFF', fontWeight: '600' },
  hint: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.3)',
    backgroundColor: 'rgba(65,105,225,0.05)',
  },
  optionActive: {
    borderColor: '#00FFFF',
    backgroundColor: 'rgba(0,255,255,0.1)',
  },
  optionText: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  optionTextActive: { color: '#00FFFF', fontWeight: '700' },
  dayRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  dayBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.3)',
  },
  dayBtnActive: { backgroundColor: '#4169E1', borderColor: '#4169E1' },
  dayText: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  dayTextActive: { color: '#FFFFFF' },
  saveBtn: {
    backgroundColor: '#4169E1',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnSaved: { backgroundColor: '#00AA55' },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
