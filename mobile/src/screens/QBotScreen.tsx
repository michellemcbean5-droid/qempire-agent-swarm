import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  role: 'user' | 'qbot';
  content: string;
  timestamp: Date;
}

const QBOT_INTROS = [
  "👑 Hey! I'm Q-Bot, your master AI orchestrator. I command a full crew of specialized agents — Marketing Maya, Finance Fiona, Tech Theo, Legal Lexi, and Sales Sam. What empire shall we build today?",
  "🤖 Q-Bot here! I'm connected to your agent swarm and ready to deploy. Tell me your business idea and I'll activate the right agents immediately.",
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function QBotScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      role: 'qbot',
      content: QBOT_INTROS[0],
      timestamp: new Date(),
    },
  ]);

  const webhookUrl = process.env.EXPO_PUBLIC_WEBHOOK_URL || 'http://localhost:8080';

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      // Try to get AI response from HuggingFace or fallback to smart local response
      const response = await generateQBotResponse(text, webhookUrl);
      const botMsg: Message = {
        id: `b_${Date.now()}`,
        role: 'qbot',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `b_${Date.now()}`,
          role: 'qbot',
          content:
            "I'm having trouble connecting right now, but I'm still here! Try again in a moment, or head to the Projects tab to submit a task directly. 💪",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [input, loading, webhookUrl]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.avatar}>👑</Text>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Q-Bot</Text>
            <Text style={styles.headerSub}>Master Orchestrator • 6 agents active</Text>
          </View>
          <View style={styles.onlineDot} />
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.botBubble]}
            >
              {msg.role === 'qbot' && <Text style={styles.botLabel}>Q-Bot 👑</Text>}
              <Text style={[styles.bubbleText, msg.role === 'user' && styles.userText]}>
                {msg.content}
              </Text>
              <Text style={styles.timestamp}>{formatTime(msg.timestamp)}</Text>
            </View>
          ))}
          {loading && (
            <View style={[styles.bubble, styles.botBubble]}>
              <ActivityIndicator color="#00FFFF" size="small" />
              <Text style={styles.typingText}>Q-Bot is thinking…</Text>
            </View>
          )}
        </ScrollView>

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask Q-Bot anything…"
            placeholderTextColor="rgba(255,255,255,0.3)"
            multiline
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendIcon}>▶</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

async function generateQBotResponse(userMessage: string, apiBase: string): Promise<string> {
  const lower = userMessage.toLowerCase();

  // Smart local responses for common queries
  if (lower.includes('agent') || lower.includes('crew')) {
    return "🤖 Your agent crew is fully assembled!\n\n• **Maya** — Marketing (Creative, Motivating)\n• **Fiona** — Finance (Analytical, Strict)\n• **Theo** — Tech (Professional, Balanced)\n• **Lexi** — Legal (Professional, Strict)\n• **Sam** — Sales (Aggressive, Urgent)\n\nHead to the Agents tab to customize their personality and schedule!";
  }
  if (lower.includes('build') || lower.includes('website') || lower.includes('launch')) {
    return "🚀 Let's build! I'll activate Theo (Tech) to build your website, Maya (Marketing) for branding, and Fiona (Finance) to research funding.\n\nGo to **Projects → New Project** to kick off the full build. Your empire awaits! 👑";
  }
  if (lower.includes('invoice') || lower.includes('crm') || lower.includes('client')) {
    return "💼 Sam (Sales) and Fiona (Finance) handle that! I can generate invoices, set up your CRM, and track your pipeline automatically.\n\nJust submit a task with type **SETUP_CRM** or **CREATE_INVOICE** from the Projects screen.";
  }
  if (lower.includes('social') || lower.includes('instagram') || lower.includes('post')) {
    return "📱 Maya (Marketing) is your social media queen! She generates platform-specific posts for Instagram, LinkedIn, and Twitter — with hashtags, tone matching, and a scheduled queue.\n\nSubmit a **POST_SOCIAL_MEDIA** task to activate her!";
  }

  // Try webhook for AI-powered response
  const res = await fetch(`${apiBase}/task`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'GENERATE_CONTENT',
      payload: { prompt: `You are Q-Bot, a friendly AI business builder. The user said: "${userMessage}". Respond helpfully in 2-3 sentences.` },
    }),
  });
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  return data.message || "I've queued that task for your agent crew! Check the Dashboard for updates. 💪";
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(65,105,225,0.2)',
    backgroundColor: '#0D0D20',
  },
  avatar: { fontSize: 36, marginRight: 12 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  headerSub: { fontSize: 12, color: '#00FFFF', marginTop: 2 },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00FF88',
  },
  messages: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8, gap: 12 },
  bubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 16,
    gap: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.3)',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#4169E1',
    borderBottomRightRadius: 4,
  },
  botLabel: { fontSize: 11, color: '#00FFFF', fontWeight: '600', marginBottom: 2 },
  bubbleText: { fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 20 },
  userText: { color: '#FFFFFF' },
  timestamp: { fontSize: 10, color: 'rgba(255,255,255,0.3)', alignSelf: 'flex-end' },
  typingText: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(65,105,225,0.2)',
    backgroundColor: '#0D0D20',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.2)',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4169E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: 'rgba(65,105,225,0.3)' },
  sendIcon: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
