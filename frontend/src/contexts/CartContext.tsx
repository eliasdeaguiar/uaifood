import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Item } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";

interface CartItem extends Item {
  quantity: number;
  observations?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Item, quantity?: number, observations?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // 3. CARREGAR CARRINHO QUANDO O USUÁRIO MUDA
  useEffect(() => {
    if (user?.id) {
      // Se tem usuário, busca o carrinho dele
      const savedCart = localStorage.getItem(`uaifood:cart:${user.id}`);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      } else {
        setItems([]); // Carrinho novo
      }
    } else {
      // Se não tem usuário (deslogou), limpa o carrinho da memória
      setItems([]); 
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`uaifood:cart:${user.id}`, JSON.stringify(items));
    }
  }, [items, user?.id]);

  const addItem = (item: Item, quantity: number = 1, observations?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.observations === observations);
      if (existing) {
        toast({
          title: "Item atualizado!",
          description: `${item.description} teve sua quantidade aumentada.`,
        });
        return prev.map((i) =>
          i.id === item.id && i.observations === observations
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      toast({
        title: "Item adicionado!",
        description: `${item.description} foi adicionado ao carrinho.`,
      });
      return [...prev, { ...item, quantity, observations }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    toast({
      title: "Item removido",
      description: "O item foi removido do carrinho.",
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
