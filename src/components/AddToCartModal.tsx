import { useState } from "react";
import { Item } from "@/types";
import { useCart } from "@/contexts/CartContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

interface AddToCartModalProps {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddToCartModal = ({ item, open, onOpenChange }: AddToCartModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState("");
  const { addItem } = useCart();

  const handleClose = () => {
    setQuantity(1);
    setObservations("");
    onOpenChange(false);
  };

  const handleAddToCart = () => {
    if (item) {
      addItem(item, quantity, observations || undefined);
      handleClose();
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.description}</DialogTitle>
          <DialogDescription className="text-lg font-semibold text-primary">
            R$ {item.unitPrice.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={item.image}
              alt={item.description}
              className="w-full h-full object-cover"
            />
          </div>

          {item.ingredients && (
            <div>
              <Label className="text-base font-semibold mb-2 block">
                Ingredientes
              </Label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.ingredients}
              </p>
            </div>
          )}

          <div>
            <Label className="text-base font-semibold mb-2 block">
              Quantidade
            </Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold min-w-[3rem] text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="ml-4 text-lg font-semibold text-primary">
                Total: R$ {(item.unitPrice * quantity).toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="observations" className="text-base font-semibold mb-2 block">
              Observações (opcional)
            </Label>
            <Textarea
              id="observations"
              placeholder="Ex: Sem cebola, sem picles..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="resize-none h-24"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleAddToCart} size="lg" className="min-w-[200px]">
            Adicionar ao Carrinho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartModal;
