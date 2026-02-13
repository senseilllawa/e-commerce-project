import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';

const ManageItemsScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = async () => {
    try {
      const response = await apiClient.get('/api/v1/items');
      const data = response.data.items ? response.data.items : response.data;
      setItems(data);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить список товаров');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchItems();
    });
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id) => {
    Alert.alert('Удаление', 'Удалить этот товар навсегда?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: async () => {
          try {
            await apiClient.delete(`/api/v1/items/${id}`);
            setItems(prev => prev.filter(item => item.id !== id));
          } catch (e) {
            Alert.alert('Ошибка', 'Не удалось удалить товар');
          }
      }},
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('EditItem', { item })} 
          style={styles.editBtn}
        >
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleDelete(item.id)} 
          style={styles.deleteBtn}
        >
          <Ionicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.addBtn} 
        onPress={() => navigation.navigate('EditItem', { item: null })}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addBtnText}>Добавить новый товар</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 20}} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchItems(); }} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Товары не найдены. Создайте первый!</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  addBtn: { 
    flexDirection: 'row', backgroundColor: '#28a745', margin: 16, 
    padding: 15, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4
  },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  card: { 
    backgroundColor: '#fff', padding: 16, borderRadius: 12, 
    marginBottom: 12, flexDirection: 'row', alignItems: 'center', 
    justifyContent: 'space-between', elevation: 2
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 15, color: '#007AFF', fontWeight: '600', marginTop: 4 },
  actions: { flexDirection: 'row' },
  editBtn: { padding: 10, backgroundColor: '#E3F2FD', borderRadius: 8, marginRight: 8 },
  deleteBtn: { padding: 10, backgroundColor: '#FFEBEE', borderRadius: 8 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 16 }
});

export default ManageItemsScreen;