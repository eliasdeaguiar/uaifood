import { User, UserType, Category, Item, Address, Review, Message, DishOfTheDay } from "@/types";
import burgerImg from "@/assets/burger.jpg";
import pizzaImg from "@/assets/pizza.jpg";
import feijoadaImg from "@/assets/feijoada.jpg";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Cliente Teste",
    email: "cliente@cliente.com",
    password: "123456",
    address: "Rua Exemplo, 123",
    phone: "(31) 99999-9999",
    type: UserType.CLIENT,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Admin Teste",
    email: "admin@admin.com",
    password: "123456",
    address: "Av. Admin, 456",
    phone: "(31) 88888-8888",
    type: UserType.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockAddresses: Address[] = [
  {
    id: "1",
    userId: "1",
    street: "Rua das Flores",
    number: "123",
    district: "Centro",
    city: "Belo Horizonte",
    state: "MG",
    zipCode: "30140-000",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "1",
    street: "Av. Afonso Pena",
    number: "456",
    district: "Funcionários",
    city: "Belo Horizonte",
    state: "MG",
    zipCode: "30130-001",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockCategories: Category[] = [
  {
    id: "1",
    description: "Burgers",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    description: "Pizzas",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    description: "Pratos Tradicionais",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    description: "Sobremesas",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockItems: Item[] = [
  {
    id: "1",
    description: "Burger Artesanal",
    unitPrice: 32.90,
    categoryId: "1",
    image: burgerImg,
    ingredients: "Pão brioche, hambúrguer artesanal 180g, queijo cheddar, alface, tomate, cebola roxa, picles, molho especial",
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.5,
    reviewCount: 12,
  },
  {
    id: "2",
    description: "Pizza Margherita",
    unitPrice: 45.90,
    categoryId: "2",
    image: pizzaImg,
    ingredients: "Molho de tomate, mussarela de búfala, manjericão fresco, azeite extra virgem, orégano",
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.8,
    reviewCount: 25,
  },
  {
    id: "3",
    description: "Feijoada Completa",
    unitPrice: 38.90,
    categoryId: "3",
    image: feijoadaImg,
    ingredients: "Feijão preto, carnes suínas variadas, linguiça calabresa, arroz branco, couve refogada, farofa, laranja",
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.7,
    reviewCount: 18,
  },
  {
    id: "4",
    description: "Burger Especial",
    unitPrice: 42.90,
    categoryId: "1",
    image: burgerImg,
    ingredients: "Pão australiano, dois hambúrgueres 120g cada, queijo suíço, bacon crocante, cebola caramelizada, rúcula, maionese trufada",
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.6,
    reviewCount: 15,
  },
  {
    id: "5",
    description: "Pizza Portuguesa",
    unitPrice: 48.90,
    categoryId: "2",
    image: pizzaImg,
    ingredients: "Molho de tomate, mussarela, presunto, ovos, cebola, azeitonas pretas, orégano",
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.4,
    reviewCount: 20,
  },
  {
    id: "6",
    description: "Virado à Paulista",
    unitPrice: 35.90,
    categoryId: "3",
    image: feijoadaImg,
    ingredients: "Arroz branco, feijão, bisteca suína, linguiça toscana, ovo frito, couve refogada, banana à milanesa",
    createdAt: new Date(),
    updatedAt: new Date(),
    averageRating: 4.3,
    reviewCount: 10,
  },
];

export const mockReviews: Review[] = [
  {
    id: "1",
    itemId: "1",
    userId: "1",
    rating: 5,
    comment: "Delicioso! Melhor burger da cidade!",
    createdAt: new Date("2025-10-20"),
  },
  {
    id: "2",
    itemId: "1",
    userId: "1",
    rating: 4,
    comment: "Muito bom, mas poderia ter mais bacon.",
    createdAt: new Date("2025-10-15"),
  },
  {
    id: "3",
    itemId: "2",
    userId: "1",
    rating: 5,
    comment: "Pizza perfeita! Massa fina e crocante.",
    createdAt: new Date("2025-10-18"),
  },
];

export const mockMessages: Message[] = [
  {
    id: "1",
    userId: "1",
    subject: "Dúvida sobre entrega",
    message: "Vocês entregam no bairro Santa Efigênia?",
    createdAt: new Date("2025-10-25"),
  },
  {
    id: "2",
    userId: "1",
    subject: "Elogio",
    message: "Adorei o burger artesanal! Parabéns!",
    response: "Muito obrigado pelo feedback! Ficamos felizes que tenha gostado!",
    createdAt: new Date("2025-10-20"),
    respondedAt: new Date("2025-10-21"),
  },
];

export const mockDishesOfTheDay: DishOfTheDay[] = [
  {
    id: "1",
    itemId: "1",
    dayOfWeek: 1, // Segunda
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    itemId: "2",
    dayOfWeek: 2, // Terça
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    itemId: "3",
    dayOfWeek: 3, // Quarta
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
