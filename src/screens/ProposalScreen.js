import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateProposal } from '../services/ApiService';
import AIConsentModal, { useAIConsent } from '../components/AIConsentModal';

const PROJECT_TYPES = ['Web Design', 'Mobile App', 'Consulting', 'Marketing', 'Branding', 'Other'];

export default function ProposalScreen() {
  const [clientName, setClientName] = useState('');
  const [projectType, setProjectType] = useState('Web Design');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const consent = useAIConsent();
  const [pendingGenerate, setPendingGenerate] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Missing details', 'Please describe the project for the proposal.');
      return;
    }
    if (!consent.hasConsented) {
      setPendingGenerate(true);
      consent.requestConsent();
      return;
    }
    doGenerate();
  };

  const doGenerate = async () => {
    setLoading(true);
    setResult('');
    try {
      const res = await generateProposal({
        prompt,
        client_name: clientName,
        project_type: projectType,
        budget,
        timeline,
      });
      if (res.content) {
        setResult(res.content);
        const history = JSON.parse(await AsyncStorage.getItem('proposal_history') || '[]');
        history.unshift({ id: Date.now().toString(), client_name: clientName, project_type: projectType, content: res.content, date: new Date().toISOString() });
        await AsyncStorage.setItem('proposal_history', JSON.stringify(history.slice(0, 50)));
      } else {
        Alert.alert('Error', res.error || 'Could not generate proposal.');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onConsentAccept = async () => {
    consent.accept();
    if (pendingGenerate) {
      setPendingGenerate(false);
      doGenerate();
    }
  };

  const onConsentDecline = () => {
    consent.decline();
    setPendingGenerate(false);
  };

  const copyResult = async () => {
    await Clipboard.setStringAsync(result);
    Alert.alert('Copied', 'Proposal copied to clipboard.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Build a Proposal</Text>
        <Text style={styles.sub}>Describe the project and generate a professional proposal.</Text>

        <Text style={styles.fieldLabel}>Client Name (optional)</Text>
        <TextInput style={styles.input} value={clientName} onChangeText={setClientName} placeholder="e.g. Acme Corp" placeholderTextColor="#B0B0B8" />

        <Text style={styles.fieldLabel}>Project Type</Text>
        <View style={styles.pillRow}>
          {PROJECT_TYPES.map(t => (
            <TouchableOpacity key={t} style={[styles.pill, projectType === t && styles.pillActive]} onPress={() => setProjectType(t)}>
              <Text style={[styles.pillText, projectType === t && styles.pillTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Budget (optional)</Text>
        <TextInput style={styles.input} value={budget} onChangeText={setBudget} placeholder="e.g. $15,000" placeholderTextColor="#B0B0B8" />

        <Text style={styles.fieldLabel}>Timeline (optional)</Text>
        <TextInput style={styles.input} value={timeline} onChangeText={setTimeline} placeholder="e.g. 6 weeks" placeholderTextColor="#B0B0B8" />

        <Text style={styles.fieldLabel}>Project Description</Text>
        <TextInput style={[styles.input, styles.inputTall]} value={prompt} onChangeText={setPrompt} multiline placeholder="Describe the project scope, deliverables, and any specific requirements..." placeholderTextColor="#B0B0B8" />

        <TouchableOpacity style={styles.genBtn} onPress={handleGenerate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : (
            <>
              <Ionicons name="sparkles" size={18} color="#fff" />
              <Text style={styles.genBtnText}>Generate Proposal</Text>
            </>
          )}
        </TouchableOpacity>

        {result ? (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Your Proposal</Text>
              <TouchableOpacity onPress={copyResult}>
                <Ionicons name="copy-outline" size={20} color="#4A90E2" />
              </TouchableOpacity>
            </View>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        ) : null}
      </ScrollView>
      <AIConsentModal visible={consent.showModal} onAccept={onConsentAccept} onDecline={onConsentDecline} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F8' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E', marginTop: 10 },
  sub: { fontSize: 13, color: '#8E8E93', marginTop: 4, marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#1C1C1E', marginBottom: 6, marginTop: 4 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 15, color: '#1C1C1E', borderWidth: 1, borderColor: '#E5E5EA', marginBottom: 16 },
  inputTall: { minHeight: 140, textAlignVertical: 'top' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E5EA' },
  pillActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  pillText: { fontSize: 13, color: '#1C1C1E' },
  pillTextActive: { color: '#fff', fontWeight: '600' },
  genBtn: { flexDirection: 'row', backgroundColor: '#4A90E2', borderRadius: 14, padding: 16, alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 },
  genBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resultCard: { backgroundColor: '#fff', borderRadius: 16, padding: 18, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  resultTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  resultText: { fontSize: 14, color: '#1C1C1E', lineHeight: 22 },
});
