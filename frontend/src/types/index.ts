export enum UserType {
  CLIENT = "CLIENT",
  ADMIN = "ADMIN",
}

export enum PaymentMethod {
  CASH = "CASH",
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
  PIX = "PIX",
}

export interface User {
  id: string;
  name: string;
  address: string;
  phone: string;
  userType: UserType;
  password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  description: string;
  unitPrice: number;
  categoryId: string;
  category?: Category;
  image?: string;
  ingredients?: string;
  createdAt: Date;
  updatedAt: Date;
  averageRating?: number;
  reviewCount?: number;
}

export interface Order {
  id: string;
  clientId: string;
  client?: User;
  paymentMethod: PaymentMethod;
  status: string;
  createdBy: string;
  addressId: string;
  address?: Address;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
}

export interface OrderItem {
  orderId: string;
  itemId: string;
  item?: Item;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  itemId: string;
  item?: Item;
  userId: string;
  user?: User;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  userId: string;
  user?: User;
  subject: string;
  message: string;
  response?: string;
  createdAt: Date;
  respondedAt?: Date;
}

export interface DishOfTheDay {
  id: string;
  itemId: string;
  item?: Item;
  dayOfWeek: number; // 0-6 (domingo a sábado)
  createdAt: Date;
  updatedAt: Date;
}
