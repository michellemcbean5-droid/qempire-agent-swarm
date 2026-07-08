import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { PACKAGES } from '../constants';
import { GradientButton } from '../components/GradientButton';
import { useToast } from '../components/ToastProvider';

export default function CheckoutScreen() {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { showSuccess } = useToast();
  const { packageId } = route.params as { packageId: string };
  const pkg = PACKAGES.find((p) => p.id === packageId) || PACKAGES[1];

  const handlePurchase = () => {
    showSuccess(`Selected ${pkg.name}. Redirecting to payment...`);
    setTimeout(() => navigation.navigate('Main'), 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.headerBox}>
          <Text style={styles.headerEmoji}>🧜🏾‍♀️</Text>
          <Text style={styles.headerTitle}>Secure Checkout</Text>
          <Text style={styles.headerSub}>Michelle & Q-Bot are ready to build your empire</Text>
        </View>

        <View style={styles.packageCard}>
          <Text style={styles.pkgName}>{pkg.name}</Text>
          <Text style={styles.pkgPrice}>{pkg.price === 0 ? 'Free' : `$${pkg.price.toLocaleString()}`}</Text>
          <Text style={styles.pkgBilling}>{pkg.billing === 'one_time' ? 'One-time payment' : 'Monthly subscription'}</Text>
          <View style={styles.featuresList}>
            {pkg.features.map((f, i) => (
              <Text key={i} style={styles.featureItem}>✓ {f}</Text>
            ))}
          </View>
        </View>

        <GradientButton title="Pay with PayPal" variant="gold" onPress={handlePurchase} size="lg" style={styles.payBtn} />

        <Text style={styles.guarantee}>🔒 Secure payment via PayPal{'
'}30-day money-back guarantee</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  scroll: { padding: 24, paddingBottom: 40 },
  backBtn: { marginBottom: 16 },
  backText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  headerBox: { alignItems: 'center', marginBottom: 24 },
  headerEmoji: { fontSize: 48, marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  packageCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(191,0,255,0.3)',
    marginBottom: 24,
  },
  pkgName: { fontSize: 18, fontWeight: 'bold', color: '#00FFFF', marginBottom: 8 },
  pkgPrice: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  pkgBilling: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16 },
  featuresList: { gap: 8 },
  featureItem: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  payBtn: { width: '100%', marginBottom: 16 },
  guarantee: { fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 18 },
});
