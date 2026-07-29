import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { restorePurchases } from '../services/RevenueCatService';

export default function SettingsScreen({ navigation }) {
  const [restoring, setRestoring] = useState(false);

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const restored = await restorePurchases();
      if (restored) {
        Alert.alert('Success', 'Your purchases have been restored.');
      } else {
        Alert.alert('No Purchases', 'No previous purchases were found.');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not restore purchases. Please try again.');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Settings</Text>

        <TouchableOpacity style={styles.item} onPress={handleRestore} disabled={restoring}>
          <Ionicons name="refresh-circle" size={22} color="#4A90E2" />
          <Text style={styles.itemText}>{restoring ? 'Restoring...' : 'Restore Purchases'}</Text>
          <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => Linking.openURL('mailto:bobchandroyalpacific@gmail.com')}>
          <Ionicons name="mail" size={22} color="#4A90E2" />
          <Text style={styles.itemText}>Contact Support</Text>
          <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => Linking.openURL('https://aibusinessassistant.ai')}>
          <Ionicons name="globe" size={22} color="#4A90E2" />
          <Text style={styles.itemText}>Visit Website</Text>
          <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
        </TouchableOpacity>

        <View style={styles.about}>
          <Text style={styles.aboutTitle}>AI Proposal Builder Pro</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0</Text>
          <Text style={styles.aboutText}>BC Canadian - USA Global Ventures LLC</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F8' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E', marginTop: 10, marginBottom: 20 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, gap: 12 },
  itemText: { flex: 1, fontSize: 15, color: '#1C1C1E' },
  about: { alignItems: 'center', marginTop: 30 },
  aboutTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  aboutVersion: { fontSize: 13, color: '#8E8E93', marginTop: 4 },
  aboutText: { fontSize: 12, color: '#C7C7CC', marginTop: 4 },
});
