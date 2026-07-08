import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../stores/appStore';
import { useAuthStore } from '../stores/authStore';
import { SkeletonList } from '../components/Skeleton';
import { RootStackParamList } from '../navigation/RootNavigator';

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const projects = useAppStore((s) => s.projects);
  const isLoading = useAppStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);

  const activeProjects = projects.filter((p) => p.status !== 'complete');
  const completedProjects = projects.filter((p) => p.status === 'complete');

  const deliverables = projects.flatMap((p) => p.deliverables || []);
  const completedDeliverables = deliverables.filter((d) => d.status === 'complete').length;
  const totalDeliverables = deliverables.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>👋 Welcome back, {user?.name || 'Founder'}</Text>
        <Text style={styles.subtitle}>Michelle & Q-Bot are building your empire.</Text>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <LinearGradient colors={['rgba(65,105,225,0.2)', 'rgba(65,105,225,0.05)']} style={styles.statCard}>
            <Text style={styles.statNumber}>{projects.length}</Text>
            <Text style={styles.statLabel}>Total Projects</Text>
          </LinearGradient>
          <LinearGradient colors={['rgba(191,0,255,0.2)', 'rgba(191,0,255,0.05)']} style={styles.statCard}>
            <Text style={styles.statNumber}>{activeProjects.length}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </LinearGradient>
          <LinearGradient colors={['rgba(0,255,255,0.2)', 'rgba(0,255,255,0.05)']} style={styles.statCard}>
            <Text style={styles.statNumber}>{completedProjects.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </LinearGradient>
          <LinearGradient colors={['rgba(212,175,55,0.2)', 'rgba(212,175,55,0.05)']} style={styles.statCard}>
            <Text style={styles.statNumber}>
              {totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 0}%
            </Text>
            <Text style={styles.statLabel}>Progress</Text>
          </LinearGradient>
        </View>

        {/* Active Projects */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Projects</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Main')}>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <SkeletonList count={2} />
        ) : activeProjects.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🚀</Text>
            <Text style={styles.emptyTitle}>No active projects</Text>
            <Text style={styles.emptySub}>Start your first empire build today.</Text>
          </View>
        ) : (
          activeProjects.slice(0, 3).map((project) => (
            <TouchableOpacity
              key={project.id}
              style={styles.projectCard}
              onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
            >
              <View style={styles.projectHeader}>
                <View>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Text style={styles.projectIndustry}>{project.industry}</Text>
                </View>
                <View style={[styles.statusBadge, project.status === 'building' && styles.statusBuilding]}>
                  <Text style={styles.statusText}>{project.status}</Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${project.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{project.progress}% complete</Text>
            </TouchableOpacity>
          ))
        )}

        {/* Recent Activity */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recent Activity</Text>
        <View style={styles.activityList}>
          {[
            { icon: '✅', text: 'Business plan PDF generated', time: '2 min ago' },
            { icon: '🔍', text: 'Market research completed', time: '5 min ago' },
            { icon: '📊', text: 'Pitch deck created (12 slides)', time: '8 min ago' },
            { icon: '🌐', text: 'Generating website HTML...', time: 'Now' },
          ].map((a, i) => (
            <View key={i} style={styles.activityItem}>
              <Text style={styles.activityIcon}>{a.icon}</Text>
              <Text style={styles.activityText} numberOfLines={1}>{a.text}</Text>
              <Text style={styles.activityTime}>{a.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1A' },
  scroll: { padding: 20, paddingBottom: 40 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4, marginBottom: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statNumber: { fontSize: 28, fontWeight: '900', color: '#FFFFFF' },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  seeAll: { fontSize: 12, color: '#4169E1' },
  emptyCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.15)',
  },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  emptySub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  projectCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.15)',
  },
  projectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  projectName: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  projectIndustry: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  statusBadge: { backgroundColor: 'rgba(0,200,83,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBuilding: { backgroundColor: 'rgba(0,255,255,0.15)' },
  statusText: { fontSize: 10, color: '#00FFFF', fontWeight: '600', textTransform: 'capitalize' },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4169E1', borderRadius: 3 },
  progressText: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6 },
  activityList: { gap: 8 },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26,26,46,0.5)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(65,105,225,0.08)',
  },
  activityIcon: { fontSize: 16, marginRight: 10 },
  activityText: { flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  activityTime: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
});
