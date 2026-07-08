import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppStore } from '../stores/appStore';
import { Project } from '../types';
import { RootStackParamList } from '../navigation/RootNavigator';
import { GradientButton } from '../components/GradientButton';
import { EmptyState } from '../components/EmptyState';

export default function ProjectsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const projects = useAppStore((s) => s.projects);
  const [filter, setFilter] = useState<'all' | 'active' | 'complete'>('all');
  const [search, setSearch] = useState('');

  const filtered = projects.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusColor = (status: string) => {
    switch (status) {
      case 'complete': return '#00C853';
      case 'building': return '#00FFFF';
      case 'error': return '#FF1744';
      default: return '#FFB300';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>My Projects</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search projects..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.filterRow}>
          {(['all', 'active', 'complete'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filtered.length === 0 ? (
          <EmptyState
            icon="🚀"
            title="No projects yet"
            subtitle="Start your first empire build and watch Michelle & Q-Bot work their magic."
            actionLabel="Start New Project"
            actionRoute="Checkout"
            actionParams={{ packageId: 'foundation' }}
          />
        ) : (
          filtered.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={styles.projectCard}
              onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
            >
              <View style={styles.projectHeader}>
                <View style={styles.projectMeta}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Text style={styles.projectIndustry}>{project.industry}</Text>
                </View>
                <View style={[styles.statusDot, { backgroundColor: statusColor(project.status) }]} />
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${project.progress}%`, backgroundColor: statusColor(project.status) }]} />
              </View>
              <View style={styles.projectFooter}>
                <Text style={styles.progressText}>{project.progress}% complete</Text>
                <Text style={styles.deliverableCount}>
                  {(project.deliverables || []).filter((d) => d.status === 'complete').length}/{(project.deliverables || []).length} deliverables
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 16 },
  searchInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.2)',
    marginBottom: 12,
  },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  filterChipActive: { backgroundColor: 'rgba(65,105,225,0.2)', borderColor: '#4169E1' },
  filterText: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  filterTextActive: { color: '#FFFFFF', fontWeight: '600' },
  projectCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.15)',
  },
  projectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  projectMeta: { flex: 1 },
  projectName: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  projectIndustry: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  projectFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  progressText: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  deliverableCount: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
});
