import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  image: string;
  book_type: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const currentItems = get().items;
        // Check if book is already in cart (prevents buying the same physical used book twice!)
        const existingItem = currentItems.find((i) => i._id === item._id);
        
        if (!existingItem) {
          set({ items: [...currentItems, item] });
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item._id !== id) });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price, 0);
      },
    }),
    {
      name: 'marketengine-cart', // This saves the cart in the browser's Local Storage!
    }
  )
);