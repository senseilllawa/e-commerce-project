import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/client';
import { Ionicons } from '@expo/vector-icons';

const ManageUsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/api/v1/admin/users');
      const data = response.data.users ? response.data.users : response.data;
      setUsers(data);
    } catch (e) {
      console.error('Ошибка при загрузке пользователей:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={[
          styles.roleBadge, 
          { backgroundColor: item.role === 'admin' ? '#FF9500' : '#007AFF' }
        ]}>
          <Text style={styles.roleText}>
            {item.role === 'admin' ? 'Администратор' : 'Пользователь'}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('EditUser', { user: item })}
        style={styles.editBtn}
      >
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
        <Ionicons name="settings-outline" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF9500" />
        </View>
      ) : (
        <FlatList 
          data={users} 
          keyExtractor={item => item.id.toString()} 
          renderItem={renderUser}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF9500" />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Пользователи не найдены</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 15 },
  userCard: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 15, 
    marginBottom: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  userEmail: { color: '#888', fontSize: 13, marginBottom: 8 },
  roleBadge: { 
    paddingHorizontal: 10, 
    paddingVertical: 3, 
    borderRadius: 20, 
    alignSelf: 'flex-start' 
  },
  roleText: { color: '#fff', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  editBtn: { flexDirection: 'row', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999' }
});

export default ManageUsersScreen;