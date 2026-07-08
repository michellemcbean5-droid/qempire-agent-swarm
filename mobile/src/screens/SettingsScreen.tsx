import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../stores/appStore';
import { useAuthStore } from '../stores/authStore';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const notificationsEnabled = useAppStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useAppStore((s) => s.setNotificationsEnabled);
  const isOffline = useAppStore((s) => s.isOffline);
  const setOffline = useAppStore((s) => s.setOffline);
  const user = useAuthStore((s) => s.user);

  const [biometrics, setBiometrics] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Push Notifications</Text>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ false: '#333', true: '#4169E1' }} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Appearance</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Dark Mode</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: '#333', true: '#4169E1' }} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Offline Mode</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Force Offline</Text>
            <Switch value={isOffline} onValueChange={setOffline} trackColor={{ false: '#333', true: '#4169E1' }} />
          </View>
          <Text style={styles.hint}>When enabled, app uses cached data only.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Security</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Biometric Login</Text>
            <Switch value={biometrics} onValueChange={setBiometrics} trackColor={{ false: '#333', true: '#4169E1' }} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.aboutText}>Q-Empire Agent Swarm v1.0.0</Text>
          <Text style={styles.aboutText}>Built with ❤️ by Michelle & Q-Bot</Text>
          <Text style={styles.aboutText}>© 2024 Q-Empire Automation</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  scroll: { padding: 24, paddingBottom: 40 },
  backBtn: { marginBottom: 16 },
  backText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 20 },
  card: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(65,105,225,0.15)' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: 'rgba(255,255,255,0.6)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  rowLabel: { fontSize: 14, color: '#FFFFFF' },
  hint: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 },
  aboutText: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
});
