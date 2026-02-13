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

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await itemsAPI.getItems();
      setItems(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Ошибка', 'Не удалось загрузить товары');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) {
      fetchItems();
      return;
    }

    try {
      const data = await itemsAPI.searchItems(query);
      setItems(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось выполнить поиск');
    } finally {
      setLoading(false);
    }
  };

  const onSearchTextChange = (text) => {
    setSearchQuery(text);
    if (text.length > 1 || text.length === 0) {
      handleSearch(text);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    Alert.alert('Успешно', `${item.name} добавлен в корзину`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemCard}
      onPress={() => navigation.navigate('ItemDetails', { item })}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
        {item.description && (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => handleAddToCart(item)}
      >
        <Ionicons name="cart-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Поиск товаров..." 
          value={searchQuery} 
          onChangeText={onSearchTextChange} 
          onSubmitEditing={() => handleSearch()} 
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch()}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList 
        data={items} 
        renderItem={renderItem} 
        keyExtractor={item => item.id.toString()} 
        contentContainerStyle={styles.listContainer} 
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => { 
              setRefreshing(true); 
              setSearchQuery('');
              fetchItems(); 
            }} 
          />
        } 
        ListEmptyComponent={
          <Text style={styles.emptyText}>Товары не найдены</Text>
        } 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { 
    flexDirection: 'row', 
    padding: 10, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd',
    alignItems: 'center'
  },
  searchInput: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    padding: 10, 
    borderRadius: 8, 
    marginRight: 10,
    fontSize: 16
  },
  searchButton: { 
    backgroundColor: '#007AFF', 
    padding: 12, 
    borderRadius: 8, 
    justifyContent: 'center' 
  },
  listContainer: { padding: 10, paddingBottom: 20 },
  itemCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
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
  itemInfo: { flex: 1, marginRight: 10 },
  itemName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' },
  itemPrice: { fontSize: 18, color: '#007AFF', fontWeight: 'bold', marginBottom: 4 },
  itemDescription: { fontSize: 14, color: '#666', lineHeight: 20 },
  addButton: { 
    backgroundColor: '#007AFF', 
    padding: 10, 
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#999' },
});

export default HomeScreen;