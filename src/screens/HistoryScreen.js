import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const stored = JSON.parse(await AsyncStorage.getItem('proposal_history') || '[]');
    setHistory(stored);
  };

  const copyItem = async (content) => {
    await Clipboard.setStringAsync(content);
    Alert.alert('Copied', 'Proposal copied to clipboard.');
  };

  const deleteItem = async (id) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    await AsyncStorage.setItem('proposal_history', JSON.stringify(updated));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Proposal History</Text>
        <Text style={styles.sub}>Your generated proposals are saved here.</Text>

        {history.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="documents-outline" size={48} color="#C7C7CC" />
            <Text style={styles.emptyText}>No proposals yet</Text>
            <Text style={styles.emptySub}>Generated proposals will appear here.</Text>
          </View>
        ) : (
          history.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>{item.client_name || 'Untitled'}</Text>
                  <Text style={styles.cardMeta}>{item.project_type || 'Proposal'} - {new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteItem(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardPreview} numberOfLines={3}>{item.content}</Text>
              <TouchableOpacity style={styles.copyBtn} onPress={() => copyItem(item.content)}>
                <Ionicons name="copy-outline" size={16} color="#4A90E2" />
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F8' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E', marginTop: 10 },
  sub: { fontSize: 13, color: '#8E8E93', marginTop: 4, marginBottom: 20 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#8E8E93', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#C7C7CC', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  cardMeta: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  cardPreview: { fontSize: 13, color: '#555', lineHeight: 20 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  copyText: { fontSize: 13, color: '#4A90E2', fontWeight: '600' },
});
