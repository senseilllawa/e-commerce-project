import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import apiClient from '../../api/client';

const EditItemScreen = ({ route, navigation }) => {
  const existingItem = route.params?.item;
  
  const [name, setName] = useState(existingItem?.name || '');
  const [description, setDescription] = useState(existingItem?.description || '');
  const [price, setPrice] = useState(existingItem?.price?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !price) {
      Alert.alert('Ошибка', 'Название и цена обязательны');
      return;
    }

    setIsLoading(true);
    const itemData = { name, description, price: parseFloat(price) };

    try {
      if (existingItem) {
        await apiClient.put(`/api/v1/items/${existingItem.id}`, { item: itemData });
        Alert.alert('Успешно', 'Товар обновлен');
      } else {
        await apiClient.post('/api/v1/items', { item: itemData });
        Alert.alert('Успешно', 'Товар добавлен');
      }
      navigation.goBack(); 
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert('Ошибка', 'Не удалось сохранить товар');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Название товара</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Например: iPhone 16 Pro Max"
        />

        <Text style={styles.label}>Описание</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Описание характеристик..."
          multiline
        />

        <Text style={styles.label}>Цена ($)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="1200"
          keyboardType="numeric"
        />

        <TouchableOpacity 
          style={[styles.saveBtn, isLoading && { backgroundColor: '#ccc' }]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveBtnText}>
            {isLoading ? 'Сохранение...' : (existingItem ? 'Обновить товар' : 'Создать товар')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: { 
    borderWidth: 1, borderColor: '#ddd', borderRadius: 10, 
    padding: 12, marginBottom: 20, fontSize: 16 
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveBtn: { 
    backgroundColor: '#28a745', padding: 18, borderRadius: 12, 
    alignItems: 'center', marginTop: 10 
  },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default EditItemScreen;