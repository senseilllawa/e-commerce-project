import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { user, signOut, isLoading } = useAuth();

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', onPress: signOut, style: 'destructive' },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={50} color="#fff" />
        </View>
        <Text style={styles.userName}>
          {user?.first_name || 'Пользователь'} {user?.last_name || ''}
        </Text>
        <Text style={styles.userEmail}>{user?.email || 'email не указан'}</Text>
        
        {user?.role && (
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
          </View>
        )}
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={[styles.menuText, { color: '#FF3B30' }]}>Выйти из аккаунта</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    backgroundColor: '#fff', 
    padding: 40, 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    elevation: 2
  },
  avatarPlaceholder: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#007AFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 16, color: '#666', marginTop: 5 },
  roleBadge: { 
    marginTop: 12, 
    backgroundColor: '#E3F2FD', 
    paddingHorizontal: 15, 
    paddingVertical: 5, 
    borderRadius: 20 
  },
  roleText: { color: '#007AFF', fontWeight: 'bold', fontSize: 12 },
  menuSection: { marginTop: 20, backgroundColor: '#fff' },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  menuText: { fontSize: 16, marginLeft: 15, fontWeight: '500' },
});

export default ProfileScreen;