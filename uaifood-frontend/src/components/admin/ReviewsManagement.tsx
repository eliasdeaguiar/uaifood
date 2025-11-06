import { useState } from "react";
import { mockReviews, mockItems, mockUsers } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const ReviewsManagement = () => {
  const [reviews] = useState(mockReviews);

  const getItemName = (itemId: string) => {
    return mockItems.find(i => i.id === itemId)?.description || "Item desconhecido";
  };

  const getUserName = (userId: string) => {
    return mockUsers.find(u => u.id === userId)?.name || "Usuário desconhecido";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliações dos Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{getItemName(review.itemId)}</h3>
                  <p className="text-sm text-muted-foreground">
                    Por {getUserName(review.userId)} • {new Date(review.createdAt).toLocaleDateString('pt-BR')}
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
              <p className="text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewsManagement;
