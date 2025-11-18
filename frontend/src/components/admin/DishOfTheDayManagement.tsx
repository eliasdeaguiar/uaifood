import { useState, useEffect } from "react";
//import { mockDishesOfTheDay, mockItems } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api"; // 3. IMPORTE A API
import { Item, DishOfTheDay } from "@/types"; // 4. IMPORTE OS TIPOS

const daysOfWeek = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

const DishOfTheDayManagement = () => {
  //const [dishesOfDay, setDishesOfDay] = useState(mockDishesOfTheDay);

  // 6. ADICIONE OS NOVOS ESTADOS
  const [items, setItems] = useState<Item[]>([]); // Para a lista de pratos
  const [isLoading, setIsLoading] = useState(true);

  // Este é o estado principal: guarda as seleções do usuário
  // Ex: { 0: '1', 1: '3' } (Domingo = item 1, Segunda = item 3)
  const [selectedDishes, setSelectedDishes] = useState<Record<number, string>>({});

  // 7. CRIE O 'useEffect' PARA BUSCAR OS DADOS
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [itemsResponse, dishesResponse] = await Promise.all([
          api.get('/items'),
          api.get('/dishes-of-the-day')
        ]);
        
        setItems(itemsResponse.data);

        // Converte o array da API para o formato do nosso 'selectedDishes'
        const dishesMap = dishesResponse.data.reduce((acc: Record<number, string>, dish: DishOfTheDay) => {
          acc[dish.dayOfWeek] = String(dish.itemId);
          return acc;
        }, {});
        setSelectedDishes(dishesMap);
        
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast({ title: "Erro ao carregar dados", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 8. REMOVA A FUNÇÃO ANTIGA 'getDishForDay'
  // Ela não é mais necessária, pois o 'selectedDishes' controla o valor

  // 9. CRIE A FUNÇÃO 'handleSave'
  const handleSave = async () => {
    // Converte o estado { 0: '1' } de volta para o array [{ dayOfWeek: 0, itemId: 1 }]
    const dishesArray = Object.entries(selectedDishes).map(([day, id]) => ({
      dayOfWeek: parseInt(day),
      itemId: parseInt(id),
    }));

    try {
      await api.post('/dishes-of-the-day', { dishes: dishesArray });
      toast({
        title: "Pratos do dia atualizados!",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  // 10. (NOVO) CRIE A FUNÇÃO PARA ATUALIZAR O ESTADO
  const handleSelectChange = (dayOfWeek: number, itemId: string) => {
    setSelectedDishes(prev => ({
      ...prev,
      [dayOfWeek]: itemId,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pratos do Dia da Semana</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 11. ADICIONE UM 'isLoading' (Opcional) */}
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Configure qual prato será destaque em cada dia da semana.
            </p>
            
            <div className="grid gap-4">
              {daysOfWeek.map((day) => (
                <div key={day.value} className="grid grid-cols-2 gap-4 items-center">
                  <Label className="font-semibold">{day.label}</Label>
                  {/* 12. ATUALIZE O 'Select' */}
                  <Select 
                    value={selectedDishes[day.value] || ""}
                    onValueChange={(itemId) => handleSelectChange(day.value, itemId)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um prato" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* 13. POPULE O SELECT COM OS ITENS REAIS */}
                      {items.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.description} - R$ {item.unitPrice.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <Button className="w-full" variant="hero" onClick={handleSave}>
              Salvar Configurações
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DishOfTheDayManagement;
