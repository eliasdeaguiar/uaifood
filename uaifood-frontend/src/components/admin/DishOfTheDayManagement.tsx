import { useState } from "react";
import { mockDishesOfTheDay, mockItems } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

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
  const [dishesOfDay, setDishesOfDay] = useState(mockDishesOfTheDay);

  const getDishForDay = (dayOfWeek: number) => {
    const dish = dishesOfDay.find(d => d.dayOfWeek === dayOfWeek);
    return dish?.itemId || "";
  };

  const handleSave = () => {
    toast({
      title: "Pratos do dia atualizados!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pratos do Dia da Semana</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Configure qual prato será destaque em cada dia da semana.
          </p>
          
          <div className="grid gap-4">
            {daysOfWeek.map((day) => (
              <div key={day.value} className="grid grid-cols-2 gap-4 items-center">
                <Label className="font-semibold">{day.label}</Label>
                <Select defaultValue={getDishForDay(day.value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um prato" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
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
      </CardContent>
    </Card>
  );
};

export default DishOfTheDayManagement;
