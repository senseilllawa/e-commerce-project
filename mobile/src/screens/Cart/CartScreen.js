import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import apiClient from '../../api/client';

const CartScreen = ({ navigation }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    Alert.alert(
      'Подтверждение',
      `Оформить заказ на сумму $${getCartTotal().toFixed(2)}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Оформить', 
          onPress: async () => {
            setIsSubmitting(true);
            try {
              const response = await apiClient.post('/api/v1/orders', {
  total_price: getCartTotal(),
  items: cartItems
});

              if (response.status === 201) {
                Alert.alert('Успешно', `Заказ №${response.data.order.id} создан!`);
                clearCart();
                navigation.navigate('Home');
              }
            } catch (error) {
              console.error(error.response?.data || error.message);
              Alert.alert('Ошибка', 'Не удалось создать заказ. Проверьте соединение.');
            } finally {
              setIsSubmitting(false);
            }
          } 
        }
      ]
    );
  };

  const renderItem = ({ item: cartEntry }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{cartEntry.item.name}</Text>
        <Text style={styles.price}>${cartEntry.item.price}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => updateQuantity(cartEntry.item.id, cartEntry.quantity - 1)} style={styles.qtyBtn}>
          <Ionicons name="remove" size={20} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.qtyText}>{cartEntry.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(cartEntry.item.id, cartEntry.quantity + 1)} style={styles.qtyBtn}>
          <Ionicons name="add" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeFromCart(cartEntry.item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={entry => entry.item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>Корзина пуста</Text>}
      />
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Итого:</Text>
            <Text style={styles.totalValue}>${getCartTotal().toFixed(2)}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.checkoutBtn, isSubmitting && { backgroundColor: '#ccc' }]} 
            onPress={handleCheckout}
            disabled={isSubmitting}
          >
            {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.checkoutText}>Оформить заказ</Text>}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, color: '#007AFF', marginTop: 4 },
  controls: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { padding: 8, backgroundColor: '#f0f0f0', borderRadius: 6 },
  qtyText: { marginHorizontal: 12, fontSize: 16, fontWeight: 'bold' },
  deleteBtn: { marginLeft: 15, padding: 5 },
  footer: { backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 18, color: '#666' },
  totalValue: { fontSize: 22, fontWeight: 'bold' },
  checkoutBtn: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#999' }
});

export default CartScreen;