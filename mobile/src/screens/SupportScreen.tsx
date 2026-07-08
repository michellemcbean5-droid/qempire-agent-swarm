import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { GradientButton } from '../components/GradientButton';
import { useToast } from '../components/ToastProvider';

export default function SupportScreen() {
  const navigation = useNavigation();
  const { showSuccess } = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const faqs = [
    { q: 'How long does a build take?', a: 'Most projects complete in 60-90 minutes. Complex builds may take up to 24 hours.' },
    { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel anytime from your Profile > Subscription section.' },
    { q: 'What payment methods are accepted?', a: 'We accept PayPal, all major credit cards, and Apple/Google Pay.' },
    { q: 'Is my data secure?', a: 'Absolutely. We use bank-level encryption and never share your data with third parties.' },
  ];

  const handleSubmit = () => {
    showSuccess('Support ticket submitted! Michelle will respond within 24 hours.');
    setSubject('');
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Support</Text>
        <Text style={styles.subtitle}>Michelle & Q-Bot are here to help.</Text>

        <Text style={styles.sectionTitle}>FAQs</Text>
        {faqs.map((faq, i) => (
          <View key={i} style={styles.faqCard}>
            <Text style={styles.faqQ}>Q: {faq.q}</Text>
            <Text style={styles.faqA}>A: {faq.a}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactCard}>
          <TextInput
            style={styles.input}
            placeholder="Subject"
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={subject}
            onChangeText={setSubject}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your issue..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
          />
          <GradientButton title="Submit Ticket" onPress={handleSubmit} disabled={!subject.trim() || !message.trim()} />
        </View>

        <TouchableOpacity onPress={() => Linking.openURL('mailto:support@qempire.app')} style={styles.emailLink}>
          <Text style={styles.emailText}>📧 support@qempire.app</Text>
        </TouchableOpacity>
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
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginTop: 16, marginBottom: 12 },
  faqCard: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(65,105,225,0.1)' },
  faqQ: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 6 },
  faqA: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 18 },
  contactCard: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(65,105,225,0.15)' },
  input: {
    backgroundColor: '#0A0A1A',
    borderRadius: 10,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.2)',
    marginBottom: 12,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  emailLink: { marginTop: 16, alignItems: 'center' },
  emailText: { color: '#4169E1', fontSize: 14 },
});
