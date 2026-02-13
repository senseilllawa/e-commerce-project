import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderScreen = ({ name }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{name || 'Screen'}</Text>
    <Text style={styles.subtext}>В разработке</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  text: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  subtext: { fontSize: 14, color: '#666', marginTop: 10 },
});

export const ItemDetailsScreen = () => <PlaceholderScreen name="Детали товара" />;
export const CartScreen = () => <PlaceholderScreen name="Корзина" />;
export const OrdersScreen = () => <PlaceholderScreen name="Заказы" />;
export const OrderDetailsScreen = () => <PlaceholderScreen name="Детали заказа" />;
export const ProfileScreen = () => <PlaceholderScreen name="Профиль" />;
export const AdminHomeScreen = () => <PlaceholderScreen name="Админ панель" />;
export const ManageUsersScreen = () => <PlaceholderScreen name="Управление пользователями" />;
export const ManageItemsScreen = () => <PlaceholderScreen name="Управление товарами" />;
export const EditUserScreen = () => <PlaceholderScreen name="Редактировать пользователя" />;
export const EditItemScreen = () => <PlaceholderScreen name="Редактировать товар" />;
