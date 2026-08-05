import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { aiService } from '../services/aiService';
import { useAppStore } from '../stores/appStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useCreditStore } from '../stores/creditStore';
import { AIInsight } from '../types';
import { GradientButton } from '../components/GradientButton';

export default function AIScreen() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const addInsight = useAppStore((s) => s.addInsight);
  const canUseFeature = useSubscriptionStore((s) => s.canUseFeature);
  const incrementAIRequest = useSubscriptionStore((s) => s.incrementAIRequest);
  const { canAfford, deductCredits, getLowBalanceWarning, balance } = useCreditStore();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!canUseFeature('ai_requests')) {
      setResponse('⚠️ Daily AI request limit reached. Upgrade your plan for more.');
      return;
    }
    if (!canAfford('generate_text')) {
      setResponse('⚠️ Insufficient AI credits. Upgrade your plan or wait for your monthly reset.');
      return;
    }
    setLoading(true);
    incrementAIRequest();
    const tx = deductCredits('generate_text');
    try {
      void tx; // transaction recorded for audit trail
      const result = await aiService.generateText(prompt);
      setResponse(result);
      const insight: AIInsight = {
        id: 'ins_' + Date.now(),
        type: 'content',
        title: 'Generated Content',
        content: result,
        confidence: 0.85,
        generatedAt: new Date().toISOString(),
      };
      addInsight(insight);
      setInsights((prev) => [insight, ...prev]);
    } catch (e) {
      setResponse('Error generating response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Write a mission statement for my tech startup',
    'Generate 5 Instagram captions for a wellness brand',
    'Create a 30-second elevator pitch',
    'Draft a cold email to potential investors',
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🤖 AI Assistant</Text>
        <Text style={styles.subtitle}>Powered by HuggingFace + Q-Bot intelligence</Text>
        <Text style={styles.creditsLabel}>💳 {balance} credits remaining</Text>
        {getLowBalanceWarning() && (
          <Text style={styles.creditWarning}>{getLowBalanceWarning()}</Text>
        )}

        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Ask Q-Bot anything..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={4}
          />
          <GradientButton
            title={loading ? 'Generating...' : 'Generate'}
            onPress={handleGenerate}
            disabled={loading || !prompt.trim()}
            style={styles.generateBtn}
          />
        </View>

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#4169E1" />
            <Text style={styles.loadingText}>Q-Bot is thinking...</Text>
          </View>
        )}

        {response && !loading && (
          <View style={styles.responseCard}>
            <Text style={styles.responseLabel}>Q-Bot Response</Text>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Quick Prompts</Text>
        <View style={styles.promptsGrid}>
          {quickPrompts.map((p, i) => (
            <TouchableOpacity key={i} style={styles.promptChip} onPress={() => setPrompt(p)}>
              <Text style={styles.promptText} numberOfLines={2}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {insights.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Insights</Text>
            {insights.slice(0, 5).map((ins) => (
              <View key={ins.id} style={styles.insightCard}>
                <Text style={styles.insightTitle}>{ins.title}</Text>
                <Text style={styles.insightContent} numberOfLines={3}>{ins.content}</Text>
                <Text style={styles.insightMeta}>Confidence: {Math.round(ins.confidence * 100)}%</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
  creditsLabel: { fontSize: 12, color: '#00FFFF', marginBottom: 4 },
  creditWarning: { fontSize: 12, color: '#FFB300', marginBottom: 12, fontWeight: '600' },
  inputCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.2)',
    marginBottom: 16,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  generateBtn: { width: '100%' },
  loadingBox: { alignItems: 'center', marginVertical: 20 },
  loadingText: { color: 'rgba(255,255,255,0.5)', marginTop: 8 },
  responseCard: {
    backgroundColor: 'rgba(0,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.15)',
    marginBottom: 20,
  },
  responseLabel: { fontSize: 12, color: '#00FFFF', fontWeight: '600', marginBottom: 8 },
  responseText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12, marginTop: 8 },
  promptsGrid: { gap: 8, marginBottom: 20 },
  promptChip: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.15)',
  },
  promptText: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  insightCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.1)',
  },
  insightTitle: { fontSize: 13, fontWeight: '600', color: '#FFFFFF', marginBottom: 4 },
  insightContent: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  insightMeta: { fontSize: 10, color: 'rgba(255,255,255,0.3)' },
});
