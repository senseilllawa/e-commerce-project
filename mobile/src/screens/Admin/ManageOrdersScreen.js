import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import apiClient from '../../api/client';

const ManageOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      const response = await apiClient.get('/api/v1/admin/orders');
      setOrders(response.data.orders);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllOrders(); }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await apiClient.put(`/api/v1/admin/orders/${orderId}`, { order: { status: newStatus } });
      fetchAllOrders(); 
      Alert.alert('Готово', `Статус изменен на ${newStatus}`);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось обновить статус');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#007AFF';
    }
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Заказ №{item.id}</Text>
        <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
      
      <Text style={styles.userText}>{item.user?.first_name} {item.user?.last_name}</Text>
      <Text style={styles.amount}>Сумма: ${parseFloat(item.amount).toFixed(2)}</Text>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.btnComplete} 
          onPress={() => updateStatus(item.id, 'completed')}
        >
          <Text style={styles.btnText}>Завершить</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.btnCancel} 
          onPress={() => updateStatus(item.id, 'cancelled')}
        >
          <Text style={styles.btnText}>Отменить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator size="large" /> : (
        <FlatList 
          data={orders} 
          keyExtractor={item => item.id.toString()} 
          renderItem={renderOrder}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  orderCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { fontSize: 16, fontWeight: 'bold' },
  statusBadge: { color: '#fff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, fontSize: 12, overflow: 'hidden' },
  userText: { fontSize: 14, color: '#333' },
  amount: { fontSize: 18, fontWeight: 'bold', marginVertical: 8, color: '#2ecc71' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btnComplete: { backgroundColor: '#28a745', padding: 10, borderRadius: 8, flex: 0.48, alignItems: 'center' },
  btnCancel: { backgroundColor: '#dc3545', padding: 10, borderRadius: 8, flex: 0.48, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});

export default ManageOrdersScreen;