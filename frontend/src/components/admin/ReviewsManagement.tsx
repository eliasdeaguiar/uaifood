import { useState, useEffect } from "react";
//import { mockReviews, mockItems, mockUsers } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Trash2 } from "lucide-react"; // 3. IMPORTE 'Trash2'
import { api } from "@/lib/api"; // 4. IMPORTE A 'api'
import { Review } from "@/types"; // 5. IMPORTE A 'Review'
import { toast } from "@/hooks/use-toast"; // 6. IMPORTE 'toast'
import { Button } from "@/components/ui/button"; // 7. IMPORTE 'Button'
// 8. IMPORTE O 'AlertDialog' PARA CONFIRMAÇÃO
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ReviewsManagement = () => {
  // 9. ATUALIZE OS ESTADOS
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 10. CRIE A FUNÇÃO 'fetchData'
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
      toast({ title: "Erro ao buscar avaliações", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // 11. CRIE O 'useEffect'
  useEffect(() => {
    fetchData();
  }, []);

  // 12. CRIE A FUNÇÃO 'handleDelete'
  const handleDeleteReview = async (reviewId: string) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast({ title: "Avaliação deletada com sucesso!" });
      fetchData(); // Atualiza a lista
    } catch (error: any) {
      console.error("Erro ao deletar avaliação:", error);
      toast({ title: "Erro ao deletar", description: error.response?.data?.error, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliações dos Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 14. ADICIONE O 'isLoading' */}
        {isLoading ? (
          <p className="text-center">Carregando avaliações...</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    {/* 15. USE OS DADOS REAIS VINDOS DA API */}
                    <h3 className="font-semibold">
                      {review.item?.description || "Item não encontrado"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Por {review.user?.name || "Usuário desconhecido"} • {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">{review.comment}</p>
                  
                  {/* 16. ADICIONE O BOTÃO DELETAR COM CONFIRMAÇÃO */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Essa ação irá deletar o comentário: "{review.comment}"
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          Deletar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsManagement;
