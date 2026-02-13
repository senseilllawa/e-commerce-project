#!/bin/bash


# HomeScreen
cat > src/screens/Home/HomeScreen.js << 'EOF'
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { itemsAPI } from '../../api/items';
import { useCart } from '../../context/CartContext';

const HomeScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const data = await itemsAPI.getItems();
      setItems(data.items);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить товары');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) { fetchItems(); return; }
    setLoading(true);
    try {
      const data = await itemsAPI.searchItems(searchQuery);
      setItems(data.items);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось выполнить поиск');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    Alert.alert('Успешно', `${item.name} добавлен в корзину`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemCard} onPress={() => navigation.navigate('ItemDetails', { item })}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
        {item.description && <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>}
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
        <Ionicons name="cart-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Поиск товаров..." value={searchQuery} onChangeText={setSearchQuery} onSubmitEditing={handleSearch} />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList data={items} renderItem={renderItem} keyExtractor={item => item.id.toString()} contentContainerStyle={styles.listContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchItems(); }} />} ListEmptyComponent={<Text style={styles.emptyText}>Товары не найдены</Text>} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  searchInput: { flex: 1, backgroundColor: '#f5f5f5', padding: 10, borderRadius: 8, marginRight: 10 },
  searchButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8, justifyContent: 'center' },
  listContainer: { padding: 10 },
  itemCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  itemPrice: { fontSize: 18, color: '#007AFF', fontWeight: 'bold', marginBottom: 5 },
  itemDescription: { fontSize: 14, color: '#666' },
  addButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
});

export default HomeScreen;
EOF

for screen in ItemDetailsScreen CartScreen OrdersScreen OrderDetailsScreen ProfileScreen AdminHomeScreen ManageUsersScreen ManageItemsScreen EditUserScreen EditItemScreen; do
  dir=$(echo $screen | sed 's/Screen//')
  case $screen in
    ItemDetailsScreen) dir="Home" ;;
    CartScreen) dir="Cart" ;;
    OrdersScreen|OrderDetailsScreen) dir="Orders" ;;
    ProfileScreen) dir="Profile" ;;
    *) dir="Admin" ;;
  esac
  
  cat > src/screens/$dir/$screen.js << EOF
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const $screen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>$screen - В разработке</Text>
      <Text style={styles.subtext}>Используйте код из документации</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  text: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  subtext: { fontSize: 14, color: '#666', marginTop: 10 },
});

export default $screen;
EOF
done

echo "✅ Все экраны созданы!"
