import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FoodCard from "@/components/FoodCard";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Item, Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  // Estados para os dados reais
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Busca os dados da API quando o componente carrega
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesResponse, itemsResponse] = await Promise.all([
          api.get('/categories'),
          api.get('/items') // Esta rota agora inclui as avaliações!
        ]);
        
        setCategories(categoriesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados do menu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // O array vazio [] faz isso rodar só uma vez

  // Lógica de filtro (agora usa os dados reais)
  const filteredItems = selectedCategory === "Todos" 
    ? items 
    : items.filter(item => {
        // O 'item' vindo da API já tem o objeto 'category'
        return item.category?.description === selectedCategory;
      });
  
  // Lista de botões (agora usa os dados reais)
  const categoryButtons = ["Todos", ...categories.map(c => c.description)];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Cardápio Completo
            </h1>
            <p className="text-muted-foreground">
              Explore todos os nossos pratos deliciosos
            </p>
          </div>

          {/* Filtros de Categoria Reais */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categoryButtons.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Lista de Itens Reais */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mostra "esqueletos" enquanto carrega */}
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-[400px] w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;