import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({children}) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [cartItems]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (item, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.item.id === item.id);
      
      if (existingItem) {
        return prevItems.map(i =>
          i.item.id === item.id
            ? {...i, quantity: i.quantity + quantity}
            : i
        );
      }
      
      return [...prevItems, {item, quantity}];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(i => i.item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(i =>
        i.item.id === itemId ? {...i, quantity: newQuantity} : i
      )
    );
  };

  const clearCart = async () => {
    setCartItems([]);
    await AsyncStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, entry) => {
      const price = parseFloat(entry.item.price) || 0;
      return total + (price * entry.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, entry) => count + entry.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};