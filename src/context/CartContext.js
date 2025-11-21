import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addToCart(product) {
    setItems((prev) => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex >= 0) {
        // Si el producto ya existe, incrementar cantidad
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1
        };
        return updated;
      }
      // Si es nuevo, agregarlo con cantidad 1
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter(item => item.id !== productId));
  }

  function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }

  function incrementQuantity(productId) {
    setItems((prev) => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  }

  function decrementQuantity(productId) {
    setItems((prev) => 
      prev.map(item => {
        if (item.id === productId) {
          const newQuantity = (item.quantity || 1) - 1;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.id !== productId || (item.quantity || 1) > 0)
    );
  }

  function clearCart() {
    setItems([]);
  }

  function getSubtotal() {
    return items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }

  function getTotalItems() {
    return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  const value = useMemo(
    () => ({ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      incrementQuantity,
      decrementQuantity,
      clearCart, 
      getSubtotal,
      getTotalItems,
      count: items.length 
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}