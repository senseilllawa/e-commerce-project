import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import apiClient from '../../api/client';

const EditUserScreen = ({ route, navigation }) => {
  const { user } = route.params; 
  
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    role: user.role || 'user',
    password: '', 
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.first_name || !formData.email) {
      Alert.alert('Ошибка', 'Имя и Email обязательны');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.put(`/api/v1/admin/users/${user.id}`, { user: formData });
      
      Alert.alert('Успешно', 'Данные пользователя обновлены');
      navigation.goBack();
    } catch (error) {
      console.error(error.response?.data);
      const errorMsg = error.response?.data?.errors?.join('\n') || 'Не удалось обновить пользователя';
      Alert.alert('Ошибка', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Имя</Text>
        <TextInput
          style={styles.input}
          value={formData.first_name}
          onChangeText={(txt) => setFormData({...formData, first_name: txt})}
          placeholder="Имя"
        />

        <Text style={styles.label}>Фамилия</Text>
        <TextInput
          style={styles.input}
          value={formData.last_name}
          onChangeText={(txt) => setFormData({...formData, last_name: txt})}
          placeholder="Фамилия"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(txt) => setFormData({...formData, email: txt})}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Роль</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity 
            style={[styles.roleBtn, formData.role === 'user' && styles.roleBtnActive]}
            onPress={() => setFormData({...formData, role: 'user'})}
          >
            <Text style={[styles.roleBtnText, formData.role === 'user' && styles.roleTextActive]}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.roleBtn, formData.role === 'admin' && styles.roleBtnActiveAdmin]}
            onPress={() => setFormData({...formData, role: 'admin'})}
          >
            <Text style={[styles.roleBtnText, formData.role === 'admin' && styles.roleTextActive]}>Admin</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        <Text style={styles.label}>Новый пароль (оставьте пустым, если не хотите менять)</Text>
        <TextInput
          style={styles.input}
          value={formData.password}
          onChangeText={(txt) => setFormData({...formData, password: txt})}
          placeholder="Минимум 6 символов"
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.saveBtn, isLoading && { opacity: 0.7 }]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Сохранить изменения</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 15, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  label: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '600' },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: '#333'
  },
  roleContainer: { flexDirection: 'row', marginBottom: 20, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd' },
  roleBtn: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  roleBtnActive: { backgroundColor: '#007AFF' },
  roleBtnActiveAdmin: { backgroundColor: '#FF9500' },
  roleBtnText: { fontWeight: 'bold', color: '#666' },
  roleTextActive: { color: '#fff' },
  separator: { height: 1, backgroundColor: '#eee', marginBottom: 20 },
  saveBtn: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default EditUserScreen;