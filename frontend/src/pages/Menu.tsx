import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FoodCard from "@/components/FoodCard";
import { Button } from "@/components/ui/button";
import { mockItems, mockCategories } from "@/data/mockData";

const categories = ["Todos", ...mockCategories.map(c => c.description)];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredItems = selectedCategory === "Todos" 
    ? mockItems 
    : mockItems.filter(item => {
        const category = mockCategories.find(c => c.id === item.categoryId);
        return category?.description === selectedCategory;
      });

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

          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
