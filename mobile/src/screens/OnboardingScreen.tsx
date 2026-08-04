import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import { RootStackParamList } from '../navigation/RootNavigator';
import { GradientButton } from '../components/GradientButton';

const { width } = Dimensions.get('window');

const TOTAL_STEPS = 5;

export default function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const register = useAuthStore((s) => s.register);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    industry: '',
    revenueGoal: '',
    timeline: '',
    selectedPlan: '',
  });
  const [loading, setLoading] = useState(false);

  const industries = ['Technology', 'Health & Wellness', 'E-commerce', 'Professional Services', 'Creative', 'Education', 'Real Estate', 'Other'];
  const timelines = ['1 Month', '3 Months', '6 Months', '1 Year'];
  const revenueGoals = ['$1K–$5K/mo', '$5K–$10K/mo', '$10K–$50K/mo', '$50K+/mo'];

  const plans = [
    { id: 'foundation', name: 'Foundation', price: '$97/mo', emoji: '🌱', features: ['1 Active Project', 'Basic AI Assistant', 'Website Builder', 'Email Automation'] },
    { id: 'empire-pro', name: 'Empire Pro', price: '$197/mo', emoji: '🚀', features: ['5 Active Projects', 'Full AI Swarm', 'Custom Domain', 'Priority Support'], highlight: true },
    { id: 'empire-elite', name: 'Elite', price: '$497/mo', emoji: '👑', features: ['Unlimited Projects', 'White-Label', 'Done-For-You Setup', 'Dedicated Manager'] },
  ];

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
    if (step === 2) return !!form.businessName.trim() && !!form.industry;
    if (step === 3) return !!form.revenueGoal && !!form.timeline;
    if (step === 4) return !!form.selectedPlan;
    return true;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Progress */}
        <View style={styles.progressRow}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <View key={s} style={[styles.progressDot, step >= s && styles.progressDotActive]}>
              <Text style={[styles.progressNum, step >= s && styles.progressNumActive]}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Step 1: Account */}
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

        {/* Step 2: Business Info */}
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
            <View style={styles.chipGrid}>
              {industries.map((ind) => (
                <TouchableOpacity
                  key={ind}
                  style={[styles.chip, form.industry === ind && styles.chipActive]}
                  onPress={() => update('industry', ind)}
                >
                  <Text style={[styles.chipText, form.industry === ind && styles.chipTextActive]}>{ind}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
              <GradientButton title="Next: Goals →" onPress={() => setStep(3)} disabled={!canProceed()} />
            </View>
          </View>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <View>
            <Text style={styles.emoji}>🎯</Text>
            <Text style={styles.title}>Set Your Goals</Text>
            <Text style={styles.subtitle}>Q-Bot will tailor your empire plan to hit these targets.</Text>

            <Text style={styles.label}>Monthly Revenue Goal</Text>
            <View style={styles.chipGrid}>
              {revenueGoals.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.chip, form.revenueGoal === g && styles.chipActive]}
                  onPress={() => update('revenueGoal', g)}
                >
                  <Text style={[styles.chipText, form.revenueGoal === g && styles.chipTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 16 }]}>Timeline to First Revenue</Text>
            <View style={styles.chipGrid}>
              {timelines.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.chip, form.timeline === t && styles.chipActive]}
                  onPress={() => update('timeline', t)}
                >
                  <Text style={[styles.chipText, form.timeline === t && styles.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
              <GradientButton title="Next: Your Plan →" onPress={() => setStep(4)} disabled={!canProceed()} />
            </View>
          </View>
        )}

        {/* Step 4: Choose Plan */}
        {step === 4 && (
          <View>
            <Text style={styles.emoji}>💎</Text>
            <Text style={styles.title}>Choose Your Plan</Text>
            <Text style={styles.subtitle}>Start free for 7 days. Cancel anytime.</Text>

            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, form.selectedPlan === plan.id && styles.planCardActive, plan.highlight && styles.planCardHighlight]}
                onPress={() => update('selectedPlan', plan.id)}
              >
                {plan.highlight && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>⭐ MOST POPULAR</Text>
                  </View>
                )}
                <View style={styles.planHeader}>
                  <Text style={styles.planEmoji}>{plan.emoji}</Text>
                  <View style={styles.planTitleRow}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                  </View>
                  <View style={[styles.planCheck, form.selectedPlan === plan.id && styles.planCheckActive]}>
                    {form.selectedPlan === plan.id && <Text style={styles.planCheckMark}>✓</Text>}
                  </View>
                </View>
                <View style={styles.planFeatures}>
                  {plan.features.map((f) => (
                    <Text key={f} style={styles.planFeature}>• {f}</Text>
                  ))}
                </View>
              </TouchableOpacity>
            ))}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(3)}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
              <GradientButton title="Review & Launch →" onPress={() => setStep(5)} disabled={!canProceed()} />
            </View>
          </View>
        )}

        {/* Step 5: Review & Launch */}
        {step === 5 && (
          <View>
            <Text style={styles.emoji}>🚀</Text>
            <Text style={styles.title}>Ready to Launch?</Text>
            <Text style={styles.subtitle}>Review your empire setup and go live.</Text>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewLabel}>Name</Text>
              <Text style={styles.reviewValue}>{form.name}</Text>
              <Text style={styles.reviewLabel}>Email</Text>
              <Text style={styles.reviewValue}>{form.email}</Text>
              <Text style={styles.reviewLabel}>Business</Text>
              <Text style={styles.reviewValue}>{form.businessName}</Text>
              <Text style={styles.reviewLabel}>Industry</Text>
              <Text style={styles.reviewValue}>{form.industry}</Text>
              <Text style={styles.reviewLabel}>Revenue Goal</Text>
              <Text style={styles.reviewValue}>{form.revenueGoal}</Text>
              <Text style={styles.reviewLabel}>Timeline</Text>
              <Text style={styles.reviewValue}>{form.timeline}</Text>
              <Text style={styles.reviewLabel}>Plan</Text>
              <Text style={styles.reviewValue}>{plans.find((p) => p.id === form.selectedPlan)?.name ?? form.selectedPlan}</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(4)}>
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
  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 },
  progressDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  progressDotActive: { backgroundColor: '#4169E1', borderColor: '#4169E1' },
  progressNum: { fontSize: 13, fontWeight: 'bold', color: 'rgba(255,255,255,0.4)' },
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
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chipActive: { backgroundColor: 'rgba(65,105,225,0.2)', borderColor: '#4169E1' },
  chipText: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  chipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  backBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 12, minHeight: 48 },
  backBtnText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  reviewCard: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(65,105,225,0.15)', marginBottom: 20 },
  reviewLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 12 },
  reviewValue: { fontSize: 15, color: '#FFFFFF', fontWeight: '600', marginTop: 2 },
  // Plan cards
  planCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  planCardActive: { borderColor: '#4169E1', backgroundColor: 'rgba(65,105,225,0.08)' },
  planCardHighlight: { borderColor: 'rgba(0,255,255,0.3)' },
  popularBadge: {
    backgroundColor: 'rgba(0,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  popularBadgeText: { fontSize: 10, color: '#00FFFF', fontWeight: '700' },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  planEmoji: { fontSize: 28 },
  planTitleRow: { flex: 1 },
  planName: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  planPrice: { fontSize: 13, color: '#00FFFF', marginTop: 2 },
  planCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planCheckActive: { backgroundColor: '#4169E1', borderColor: '#4169E1' },
  planCheckMark: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  planFeatures: { gap: 4 },
  planFeature: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
});
