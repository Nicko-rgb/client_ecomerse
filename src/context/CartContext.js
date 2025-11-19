import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addToCart(product) {
    setItems((prev) => [...prev, product]);
  }

  function removeFromCart(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function clearCart() {
    setItems([]);
  }

  const value = useMemo(
    () => ({ items, addToCart, removeFromCart, clearCart, count: items.length }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}