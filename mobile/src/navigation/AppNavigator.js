import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

// Real Screens (User)
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen'; 
import CartScreen from '../screens/Cart/CartScreen';
import OrdersScreen from '../screens/Orders/OrdersScreen';

// Real Screens (Admin)
import AdminHomeScreen from '../screens/Admin/AdminHomeScreen';
import ManageItemsScreen from '../screens/Admin/ManageItemsScreen';
import EditItemScreen from '../screens/Admin/EditItemScreen';
import ManageUsersScreen from '../screens/Admin/ManageUsersScreen';
import EditUserScreen from '../screens/Admin/EditUserScreen';
import ManageOrdersScreen from '../screens/Admin/ManageOrdersScreen';

// Placeholder Screens
import {
  ItemDetailsScreen,
  OrderDetailsScreen,
} from '../screens/PlaceholderScreens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- ТАБЫ ПОЛЬЗОВАТЕЛЯ ---
const UserTabs = () => {
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'Orders') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Товары' }} />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ 
          title: 'Корзина',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }} 
      />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'Мои заказы' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль' }} />
    </Tab.Navigator>
  );
};

// --- ТАБЫ АДМИНИСТРАТОРА ---
const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'AdminHome') iconName = focused ? 'apps' : 'apps-outline';
          else if (route.name === 'ManageUsers') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'ManageItems') iconName = focused ? 'cube' : 'cube-outline';
          else if (route.name === 'ManageOrders') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF9500',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Панель' }} />
      <Tab.Screen name="ManageUsers" component={ManageUsersScreen} options={{ title: 'Юзеры' }} />
      <Tab.Screen name="ManageItems" component={ManageItemsScreen} options={{ title: 'Товары' }} />
      <Tab.Screen name="ManageOrders" component={ManageOrdersScreen} options={{ title: 'Заказы' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Аккаунт' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return null;

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      ) : user?.role === 'admin' ? (
        <Stack.Navigator>
          <Stack.Screen name="MainTabs" component={AdminTabs} options={{ headerShown: false }} />
          <Stack.Screen name="EditUser" component={EditUserScreen} options={{ title: 'Править пользователя' }} />
          <Stack.Screen name="EditItem" component={EditItemScreen} options={{ title: 'Править товар' }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="MainTabs" component={UserTabs} options={{ headerShown: false }} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} options={{ title: 'Детали товара' }} />
          <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ title: 'Детали заказа' }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;