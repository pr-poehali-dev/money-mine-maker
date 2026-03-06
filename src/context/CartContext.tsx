import { createContext, useContext, useState, ReactNode } from 'react';
import { Bot } from '@/data/bots';

export interface CartItem {
  bot: Bot;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (bot: Bot) => void;
  removeFromCart: (botId: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (bot: Bot) => {
    setItems(prev => {
      const existing = prev.find(i => i.bot.id === bot.id);
      if (existing) return prev;
      return [...prev, { bot, qty: 1 }];
    });
  };

  const removeFromCart = (botId: number) => {
    setItems(prev => prev.filter(i => i.bot.id !== botId));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.bot.price * i.qty, 0);
  const count = items.length;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
