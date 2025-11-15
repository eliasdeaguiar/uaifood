import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Item } from "@/types";
import AddToCartModal from "./AddToCartModal";

interface FoodCardProps {
  item: Item;
}

const BACKEND_URL = 'http://localhost:3000';

const FoodCard = ({ item }: FoodCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  // 2. CRIE A URL COMPLETA DA IMAGEM
  // Se o item tiver uma imagem, monte a URL. Senão, 'imageSrc' será null.
  const imageSrc = item.image ? `${BACKEND_URL}/files/${item.image}` : null;

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in">
      <div className="aspect-video overflow-hidden">
        <img
          src={imageSrc || item.image} // Usa a URL montada ou o placeholder (ex: 'burgerImg' do mockData)
          alt={item.description}
          // Adiciona uma cor de fundo caso a imagem falhe
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 bg-muted"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-xl">{item.description}</h3>
          {item.averageRating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold">{item.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-primary">
          R$ {item.unitPrice.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          size="lg" 
          variant="hero"
          onClick={() => setModalOpen(true)}
        >
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
      
      <AddToCartModal 
        item={{ ...item, image: imageSrc || item.image }} // 4. PASSE A URL CORRETA PARA O MODAL
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </Card>
  );
};

export default FoodCard;
