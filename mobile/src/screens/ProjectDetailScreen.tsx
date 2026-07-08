import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useAppStore } from '../stores/appStore';
import { SkeletonList } from '../components/Skeleton';

export default function ProjectDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { projectId } = route.params as { projectId: string };
  const projects = useAppStore((s) => s.projects);
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Project not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'complete': return '#00C853';
      case 'in_progress': return '#00FFFF';
      case 'pending': return '#FFB300';
      default: return '#FF1744';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back to Projects</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{project.name}</Text>
        <Text style={styles.industry}>{project.industry}</Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={styles.progressPercent}>{project.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${project.progress}%` }]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Deliverables</Text>
        {(project.deliverables || []).length === 0 ? (
          <SkeletonList count={3} />
        ) : (
          project.deliverables.map((d) => (
            <View key={d.id} style={styles.deliverableCard}>
              <View style={styles.deliverableHeader}>
                <Text style={styles.deliverableIcon}>
                  {d.type === 'blueprint' ? '📋' : d.type === 'website' ? '🌐' : d.type === 'automation' ? '🤖' : d.type === 'funding' ? '💰' : '✨'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deliverableName}>{d.name}</Text>
                  <Text style={styles.deliverableType}>{d.type.toUpperCase()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${statusColor(d.status)}20` }]}>
                  <Text style={[styles.statusText, { color: statusColor(d.status) }]}>{d.status}</Text>
                </View>
              </View>
              <View style={styles.deliverableProgressBar}>
                <View style={[styles.deliverableProgressFill, { width: `${d.progress}%`, backgroundColor: statusColor(d.status) }]} />
              </View>
              {d.url && (
                <TouchableOpacity>
                  <Text style={styles.urlText}>🔗 View Deliverable</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  scroll: { padding: 24, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 16 },
  backLink: { color: '#4169E1', fontSize: 14 },
  backBtn: { marginBottom: 16 },
  backText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  industry: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 },
  progressSection: { marginBottom: 24 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  progressPercent: { fontSize: 14, fontWeight: 'bold', color: '#00FFFF' },
  progressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4169E1', borderRadius: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
  deliverableCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.15)',
  },
  deliverableHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  deliverableIcon: { fontSize: 28, marginRight: 12 },
  deliverableName: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  deliverableType: { fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  deliverableProgressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' },
  deliverableProgressFill: { height: '100%', borderRadius: 2 },
  urlText: { fontSize: 12, color: '#4169E1', marginTop: 10 },
});
