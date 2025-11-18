import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Order, OrderItem, Item, Review } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Package, MapPin, CreditCard, CheckCircle, Truck, CookingPot } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

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

// Mapeamento de status para um visual melhor
const statusMap: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  PENDING: { label: "Pendente", icon: CookingPot, color: "text-yellow-600" },
  CONFIRMED: { label: "Confirmado", icon: CheckCircle, color: "text-green-600" },
  DELIVERING: { label: "Em Entrega", icon: Truck, color: "text-blue-600" },
  CANCELLED: { label: "Cancelado", icon: CheckCircle, color: "text-red-600" },
  DELIVERED: { label: "Entregue", icon: CheckCircle, color: "text-gray-600" },
};

// Mapeamento de Pagamento
const paymentLabels: Record<string, string> = {
  PIX: "PIX",
  CREDIT: "Cartão de Crédito",
  DEBIT: "Cartão de Débito",
  CASH: "Dinheiro",
};

// Componente de Estrelas para mostrar a nota
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${
          rating >= star ? "fill-primary text-primary" : "text-muted-foreground"
        }`}
      />
    ))}
  </div>
);

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]); // Estado para suas reviews
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Estados do Modal de Criar Avaliação
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedItemToReview, setSelectedItemToReview] = useState<Item | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  
  // Estados do Modal de Editar/Ver Avaliação
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  // Função para buscar TODOS os dados (pedidos e reviews)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Busca pedidos e avaliações do usuário ao mesmo tempo
      const [ordersResponse, reviewsResponse] = await Promise.all([
        api.get('/orders/me'),
        api.get('/reviews/me') // A nova rota
      ]);
      setOrders(ordersResponse.data);
      setMyReviews(reviewsResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast({ title: "Erro ao buscar seus dados", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    fetchData();
  }, [isAuthenticated, navigate]);

  // Função para calcular o total do pedido
  const calculateOrderTotal = (items: OrderItem[]) => {
    return items.reduce((sum, orderItem) => {
      const price = orderItem.item?.unitPrice || 0;
      return sum + price * orderItem.quantity;
    }, 0);
  };

  // --- Funções do Modal de CRIAÇÃO ---
  const openCreateModal = (item: Item) => {
    setSelectedItemToReview(item);
    setRating(0);
    setComment("");
    setIsCreateModalOpen(true);
  };
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handleSubmitReview = async () => {
    if (rating === 0 || !comment || !selectedItemToReview) {
      toast({ title: "Erro", description: "Por favor, selecione uma nota e escreva um comentário.", variant: "destructive" });
      return;
    }
    try {
      await api.post('/reviews', {
        rating: rating,
        comment: comment,
        itemId: selectedItemToReview.id,
      });
      toast({ title: "Avaliação enviada com sucesso!" });
      closeCreateModal();
      fetchData(); // Atualiza a lista de reviews
    } catch (error: any) {
      console.error("Erro ao enviar avaliação:", error);
      toast({ title: "Erro ao enviar avaliação", description: error.response?.data?.error, variant: "destructive" });
    }
  };
  
  // --- Funções do Modal de EDIÇÃO/VISUALIZAÇÃO ---
  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);
  
  const handleUpdateReview = async () => {
    if (!editingReview || editRating === 0 || !editComment) {
      toast({ title: "Erro", description: "Nota e comentário são obrigatórios.", variant: "destructive" });
      return;
    }
    try {
      await api.put(`/reviews/me/${editingReview.id}`, {
        rating: editRating,
        comment: editComment
      });
      toast({ title: "Avaliação atualizada!" });
      closeEditModal();
      fetchData(); // Atualiza a lista
    } catch (error: any) {
      console.error("Erro ao atualizar avaliação:", error);
      toast({ title: "Erro ao atualizar", description: error.response?.data?.error, variant: "destructive" });
    }
  };
  
  const handleDeleteReview = async () => {
    if (!editingReview) return;
    try {
      await api.delete(`/reviews/me/${editingReview.id}`);
      toast({ title: "Avaliação deletada!" });
      closeEditModal();
      fetchData(); // Atualiza a lista
    } catch (error: any) {
      console.error("Erro ao deletar avaliação:", error);
      toast({ title: "Erro ao deletar", description: error.response?.data?.error, variant: "destructive" });
    }
  };

  // --- Funções de Renderização ---

  // Helper para checar se um item já foi avaliado
  const findMyReview = (itemId: number) => {
    return myReviews.find(review => String(review.itemId) === String(itemId));
  };

  const renderOrderList = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-16">
          <Package className="h-24 w-24 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold mt-4">Nenhum pedido encontrado</h2>
          <p className="text-muted-foreground">Você ainda não fez nenhum pedido.</p>
          <Button asChild size="lg" variant="hero" className="mt-6">
            <Link to="/menu">Começar a Pedir</Link>
          </Button>
        </div>
      );
    }

    return (
      <Accordion type="single" collapsible className="w-full space-y-4">
        {orders.map((order) => {
          const orderTotal = calculateOrderTotal(order.items || []);
          const statusInfo = statusMap[order.status] || { label: order.status, icon: Package, color: "text-gray-600" };
          const StatusIcon = statusInfo.icon;
          const deliveryFee = 8.00;

          return (
            <AccordionItem value={String(order.id)} key={order.id} className="border-b-0">
              <Card className="overflow-hidden">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="flex justify-between items-center w-full">
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Pedido #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Feito em: {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`font-bold text-base ${statusInfo.color}`}>
                        <StatusIcon className="h-4 w-4 mr-2" />
                        {statusInfo.label}
                      </Badge>
                      <p className="text-lg font-bold text-primary mt-1">
                        R$ {(orderTotal + deliveryFee).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-6 pt-0 space-y-4">
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold mb-2">Itens do Pedido</h4>
                      <div className="space-y-2">
                        {order.items?.map((orderItem) => {
                          const userReview = orderItem.item ? findMyReview(Number(orderItem.item.id)) : undefined;
                          
                          return (
                            <div key={orderItem.item?.id || orderItem.itemId} className="flex justify-between items-center text-sm">
                              <div>
                                <span>{orderItem.quantity}x {orderItem.item?.description || "Item"}</span>
                                <span className="ml-4 text-primary font-semibold">
                                  R$ {((orderItem.item?.unitPrice || 0) * orderItem.quantity).toFixed(2)}
                                </span>
                              </div>
                              
                              {/* LÓGICA CONDICIONAL PARA MOSTRAR BOTÃO */}
                              {userReview ? (
                                // JÁ AVALIOU: Mostra as estrelas
                                <Button variant="outline" size="sm" onClick={() => openEditModal(userReview)}>
                                  <StarRating rating={userReview.rating} />
                                  <span className="ml-2">Ver Avaliação</span>
                                </Button>
                              ) : order.status === 'DELIVERED' ? (
                                // NÃO AVALIOU E FOI ENTREGUE: Mostra botão "Avaliar"
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => openCreateModal(orderItem.item!)}
                                >
                                  <Star className="h-4 w-4 mr-2" />
                                  Avaliar
                                </Button>
                              ) : (
                                // Pedido não foi entregue, não mostra nada
                                null
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* ... (Endereço de Entrega) ... */}
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> Endereço de Entrega
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          <p>{order.address?.street}, {order.address?.number}</p>
                          <p>{order.address?.district}</p>
                          <p>{order.address?.city} - {order.address?.state}</p>
                        </div>
                      </div>
                      {/* ... (Pagamento) ... */}
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CreditCard className="h-4 w-4" /> Pagamento
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          <p>Subtotal: R$ {orderTotal.toFixed(2)}</p>
                          <p>Taxa de Entrega: R$ {deliveryFee.toFixed(2)}</p>
                          <p className="font-semibold">Total: R$ {(orderTotal + deliveryFee).toFixed(2)}</p>
                          <p className="mt-1">
                            Método: {paymentLabels[order.paymentMethod] || order.paymentMethod}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Meus Pedidos
        </h1>
        {renderOrderList()}
      </main>
      <Footer />

      {/* MODAL DE CRIAR AVALIAÇÃO */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avaliar {selectedItemToReview?.description}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Seletor de Estrelas */}
            <div>
              <Label>Nota</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${
                      rating >= star ? "fill-primary text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            {/* Campo de Comentário */}
            <div>
              <Label htmlFor="comment">Comentário</Label>
              <Textarea
                id="comment"
                placeholder="Conte-nos o que você achou do prato..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeCreateModal}>Cancelar</Button>
            <Button onClick={handleSubmitReview}>Enviar Avaliação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* MODAL DE EDITAR/VER AVALIAÇÃO */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sua Avaliação para {editingReview?.item?.description}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Seletor de Estrelas (Editável) */}
            <div>
              <Label>Nota</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${
                      editRating >= star ? "fill-primary text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => setEditRating(star)}
                  />
                ))}
              </div>
            </div>
            {/* Campo de Comentário (Editável) */}
            <div>
              <Label htmlFor="edit-comment">Comentário</Label>
              <Textarea
                id="edit-comment"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter className="justify-between">
            {/* Botão de Deletar (precisa de confirmação) */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Deletar Avaliação</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deletar Avaliação?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={handleDeleteReview}
                  >
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={closeEditModal}>Cancelar</Button>
              <Button onClick={handleUpdateReview}>Salvar Alterações</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrders;