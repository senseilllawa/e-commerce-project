import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import apiClient from '../../api/client';

const AdminHomeScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/v1/admin/dashboard');
      setData(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return <ActivityIndicator size="large" style={{flex:1}} />;

  const { stats } = data;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStats(); }} />}
    >
      <Text style={styles.title}>Общая статистика</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Продажи</Text>
          <Text style={styles.statValue}>${stats.total_sales.toFixed(2)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Заказы</Text>
          <Text style={styles.statValue}>{stats.orders_count}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Товары</Text>
          <Text style={styles.statValue}>{stats.items_count}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Юзеры</Text>
          <Text style={styles.statValue}>{stats.users_count}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { 
    backgroundColor: '#fff', width: '48%', padding: 20, 
    borderRadius: 15, marginBottom: 15, elevation: 2 
  },
  statLabel: { color: '#666', fontSize: 14, marginBottom: 5 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' }
});

export default AdminHomeScreen;