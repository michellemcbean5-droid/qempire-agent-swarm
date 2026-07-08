import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import { RootStackParamList } from '../navigation/RootNavigator';
import { GradientButton } from '../components/GradientButton';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const register = useAuthStore((s) => s.register);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', businessName: '', industry: '' });
  const [loading, setLoading] = useState(false);

  const industries = ['Technology', 'Health & Wellness', 'E-commerce', 'Professional Services', 'Creative', 'Education', 'Real Estate', 'Other'];

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register(form.email, form.name, form.password);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return form.name.trim() && form.email.trim() && form.password.length >= 6;
    if (step === 2) return form.businessName.trim() && form.industry;
    return true;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Progress */}
        <View style={styles.progressRow}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={[styles.progressDot, step >= s && styles.progressDotActive]}>
              <Text style={[styles.progressNum, step >= s && styles.progressNumActive]}>{s}</Text>
            </View>
          ))}
        </View>

        {step === 1 && (
          <View>
            <Text style={styles.emoji}>🧜🏾‍♀️</Text>
            <Text style={styles.title}>Welcome to Q-Empire</Text>
            <Text style={styles.subtitle}>Let's get you set up in under 2 minutes.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput style={styles.input} placeholder="e.g. Michelle" placeholderTextColor="rgba(255,255,255,0.3)" value={form.name} onChangeText={(t) => update('name', t)} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} placeholder="you@email.com" placeholderTextColor="rgba(255,255,255,0.3)" value={form.email} onChangeText={(t) => update('email', t)} keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput style={styles.input} placeholder="Min 6 characters" placeholderTextColor="rgba(255,255,255,0.3)" value={form.password} onChangeText={(t) => update('password', t)} secureTextEntry />
            </View>

            <GradientButton title="Next: Your Business →" onPress={() => setStep(2)} disabled={!canProceed()} style={styles.cta} />
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.emoji}>🏢</Text>
            <Text style={styles.title}>Tell Us About Your Business</Text>
            <Text style={styles.subtitle}>Michelle & Q-Bot will use this to build your empire.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Name</Text>
              <TextInput style={styles.input} placeholder="e.g. TechCorp Solutions" placeholderTextColor="rgba(255,255,255,0.3)" value={form.businessName} onChangeText={(t) => update('businessName', t)} />
            </View>

            <Text style={styles.label}>Industry</Text>
            <View style={styles.industryGrid}>
              {industries.map((ind) => (
                <TouchableOpacity
                  key={ind}
                  style={[styles.industryChip, form.industry === ind && styles.industryChipActive]}
                  onPress={() => update('industry', ind)}
                >
                  <Text style={[styles.industryText, form.industry === ind && styles.industryTextActive]}>{ind}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
              <GradientButton title="Next: Launch →" onPress={() => setStep(3)} disabled={!canProceed()} />
            </View>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.emoji}>🚀</Text>
            <Text style={styles.title}>Ready to Launch?</Text>
            <Text style={styles.subtitle}>Review your details and start building.</Text>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewLabel}>Name</Text>
              <Text style={styles.reviewValue}>{form.name}</Text>
              <Text style={styles.reviewLabel}>Email</Text>
              <Text style={styles.reviewValue}>{form.email}</Text>
              <Text style={styles.reviewLabel}>Business</Text>
              <Text style={styles.reviewValue}>{form.businessName}</Text>
              <Text style={styles.reviewLabel}>Industry</Text>
              <Text style={styles.reviewValue}>{form.industry}</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
              <GradientButton title="🚀 Launch My Empire" onPress={handleRegister} disabled={loading} />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  scroll: { padding: 24, paddingBottom: 40 },
  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 32 },
  progressDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  progressDotActive: { backgroundColor: '#4169E1', borderColor: '#4169E1' },
  progressNum: { fontSize: 14, fontWeight: 'bold', color: 'rgba(255,255,255,0.4)' },
  progressNumActive: { color: '#FFFFFF' },
  emoji: { fontSize: 56, textAlign: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 28 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6, fontWeight: '500' },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.2)',
  },
  cta: { marginTop: 8, width: '100%' },
  industryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  industryChip: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  industryChipActive: { backgroundColor: 'rgba(65,105,225,0.2)', borderColor: '#4169E1' },
  industryText: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  industryTextActive: { color: '#FFFFFF', fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  backBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
  backBtnText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  reviewCard: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(65,105,225,0.15)', marginBottom: 20 },
  reviewLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 12 },
  reviewValue: { fontSize: 15, color: '#FFFFFF', fontWeight: '600', marginTop: 2 },
});
