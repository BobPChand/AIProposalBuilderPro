import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { purchasePackage, restorePurchases, checkProStatus } from '../services/RevenueCatService';

export default function PaywallScreen() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const pro = await checkProStatus();
      setIsPro(pro);
      setChecking(false);
    })();
  }, []);

  const handlePurchase = async (packageId) => {
    setLoading(true);
    try {
      const success = await purchasePackage(packageId);
      if (success) {
        setIsPro(true);
        Alert.alert('Success', 'You are now a Pro member!');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const restored = await restorePurchases();
      if (restored) {
        setIsPro(true);
        Alert.alert('Success', 'Your purchases have been restored.');
      } else {
        Alert.alert('No Purchases', 'No previous purchases were found.');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not restore purchases.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  if (isPro) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.proCard}>
            <Ionicons name="star" size={48} color="#FFD60A" />
            <Text style={styles.proTitle}>You are a Pro Member</Text>
            <Text style={styles.proSub}>Enjoy unlimited proposal generation, pitch decks, and more.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Upgrade to Pro</Text>
        <Text style={styles.sub}>Unlock unlimited proposals, pitch decks, and history.</Text>

        <View style={styles.features}>
          <View style={styles.feature}><Ionicons name="checkmark-circle" size={20} color="#34C759" /><Text style={styles.featureText}>Unlimited proposal generation</Text></View>
          <View style={styles.feature}><Ionicons name="checkmark-circle" size={20} color="#34C759" /><Text style={styles.featureText}>AI pitch deck builder</Text></View>
          <View style={styles.feature}><Ionicons name="checkmark-circle" size={20} color="#34C759" /><Text style={styles.featureText}>Unlimited proposal history</Text></View>
          <View style={styles.feature}><Ionicons name="checkmark-circle" size={20} color="#34C759" /><Text style={styles.featureText}>Export and copy proposals</Text></View>
          <View style={styles.feature}><Ionicons name="checkmark-circle" size={20} color="#34C759" /><Text style={styles.featureText}>Priority AI processing</Text></View>
        </View>

        <TouchableOpacity style={styles.planCard} onPress={() => handlePurchase('$rc_monthly')} disabled={loading}>
          <View style={{ flex: 1 }}>
            <Text style={styles.planTitle}>Monthly</Text>
            <Text style={styles.planDesc}>Auto-renews monthly. Cancel anytime.</Text>
          </View>
          <Text style={styles.planPrice}>$14.99/mo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.planCard, styles.planCardBest]} onPress={() => handlePurchase('$rc_annual')} disabled={loading}>
          <View style={{ flex: 1 }}>
            <Text style={styles.planTitle}>Yearly</Text>
            <Text style={styles.planDesc}>Save 45%. Auto-renews annually.</Text>
            <View style={styles.bestBadge}><Text style={styles.bestText}>BEST VALUE</Text></View>
          </View>
          <Text style={styles.planPrice}>$99.99/yr</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="small" color="#4A90E2" style={{ margin: 20 }} />}

        <TouchableOpacity onPress={handleRestore} disabled={loading}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>Subscriptions auto-renew unless cancelled at least 24 hours before the end of the current period. Manage in App Store settings.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F8' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1C1C1E', marginTop: 10, textAlign: 'center' },
  sub: { fontSize: 14, color: '#8E8E93', textAlign: 'center', marginTop: 6, marginBottom: 24 },
  features: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 20, gap: 12 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontSize: 14, color: '#1C1C1E' },
  planCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  planCardBest: { borderColor: '#4A90E2', backgroundColor: '#EBF2FF' },
  planTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  planDesc: { fontSize: 12, color: '#8E8E93', marginTop: 4 },
  planPrice: { fontSize: 18, fontWeight: '700', color: '#4A90E2' },
  bestBadge: { backgroundColor: '#4A90E2', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginTop: 6 },
  bestText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  restoreText: { fontSize: 14, color: '#4A90E2', textAlign: 'center', marginTop: 16, fontWeight: '600' },
  disclaimer: { fontSize: 11, color: '#C7C7CC', textAlign: 'center', marginTop: 12, lineHeight: 16 },
  proCard: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, padding: 40, marginTop: 40 },
  proTitle: { fontSize: 20, fontWeight: 'bold', color: '#1C1C1E', marginTop: 12 },
  proSub: { fontSize: 14, color: '#8E8E93', textAlign: 'center', marginTop: 6 },
});
