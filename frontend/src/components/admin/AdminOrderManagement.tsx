import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Order, OrderItem, PaymentMethod, User } from "@/types";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Package, MapPin, CreditCard, CheckCircle, Truck, CookingPot, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// (Copiado da sua tela MyOrders.tsx)
const statusMap: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  PENDING: { label: "Pendente", icon: CookingPot, color: "text-yellow-600" },
  CONFIRMED: { label: "Confirmado", icon: CheckCircle, color: "text-green-600" },
  DELIVERING: { label: "Em Entrega", icon: Truck, color: "text-blue-600" },
  CANCELLED: { label: "Cancelado", icon: CheckCircle, color: "text-red-600" },
  DELIVERED: { label: "Entregue", icon: CheckCircle, color: "text-gray-600" },
};

// (Copiado da sua tela MyOrders.tsx)
const paymentLabels: Record<string, string> = {
  PIX: "PIX",
  CREDIT: "Cartão de Crédito",
  DEBIT: "Cartão de Débito",
  CASH: "Dinheiro",
};

// ADICIONE ESTE BLOCO DE IMPORTAÇÃO:
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Opções que o Admin pode selecionar
const statusOptions = ["PENDING", "CONFIRMED", "DELIVERING", "DELIVERED", "CANCELLED"];

// Interface estendida para os dados do admin (que inclui o 'client')
interface AdminOrder extends Omit<Order, 'client'> { // <--- Use 'Omit'
  client: Pick<User, 'name' | 'phone'>;
}

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ orderId: string; newStatus: string } | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Erro ao buscar todos os pedidos:", error);
      toast({ title: "Erro ao buscar pedidos", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      toast({ title: "Status do pedido atualizado!" });
      
      // Esta é a linha que atualiza a tela SEM refresh!
      setOrders(prevOrders =>
        prevOrders.map(order =>
          // 👇 --- MUDE ESTA LINHA --- 👇
          String(order.id) === orderId ? { ...order, status: newStatus } : order
          // 👆 --- FIM DA MUDANÇA --- 👆
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({ title: "Erro ao atualizar status", variant: "destructive" });
    } finally {
      // Limpa o estado pendente e fecha o modal
      setIsConfirmModalOpen(false);
      setPendingStatusChange(null);
    }
  };

  // ADICIONE ESTA FUNÇÃO
  const promptStatusChange = (orderId: string, newStatus: string, currentStatus: string) => {
    // Se o status for o mesmo, não faz nada
    if (newStatus === currentStatus) return;
    
    // Guarda a mudança pendente e abre o modal
    setPendingStatusChange({ orderId, newStatus });
    setIsConfirmModalOpen(true);
  };

  // ADICIONE ESTA FUNÇÃO
  const cancelStatusChange = () => {
    setIsConfirmModalOpen(false);
    setPendingStatusChange(null);
  };

  // (Função copiada de MyOrders.tsx)
  const calculateOrderTotal = (items: OrderItem[]) => {
    return items.reduce((sum, orderItem) => {
      // O backend de admin (GET /orders) nos envia o preço
      const price = orderItem.item?.unitPrice || 0;
      return sum + price * orderItem.quantity;
    }, 0);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Gerenciar Pedidos</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-center text-muted-foreground">Nenhum pedido encontrado.</p>
        ) : (
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
                            Cliente: {order.client?.name || 'Desconhecido'}
                          </p>
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
                            {order.items?.map((orderItem) => (
                              <div key={orderItem.item?.description || orderItem.itemId} className="flex justify-between text-sm">
                                <span>{orderItem.quantity}x {orderItem.item?.description || "Item"}</span>
                                <span>R$ {((orderItem.item?.unitPrice || 0) * orderItem.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-3 gap-4">
                          {/* Coluna 1: Cliente */}
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <UserIcon className="h-4 w-4" /> Cliente
                            </h4>
                            <div className="text-sm text-muted-foreground">
                              <p>{order.client?.name || 'Desconhecido'}</p>
                              <p>{order.client?.phone || 'Sem telefone'}</p>
                            </div>
                          </div>
                          {/* Coluna 2: Endereço */}
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <MapPin className="h-4 w-4" /> Endereço
                            </h4>
                            <div className="text-sm text-muted-foreground">
                              <p>{order.address?.street}, {order.address?.number}</p>
                              <p>{order.address?.city} - {order.address?.state}</p>
                            </div>
                          </div>
                          {/* Coluna 3: Pagamento */}
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <CreditCard className="h-4 w-4" /> Pagamento
                            </h4>
                            <div className="text-sm text-muted-foreground">
                              <p>Total: R$ {(orderTotal + deliveryFee).toFixed(2)}</p>
                              <p>Método: {paymentLabels[order.paymentMethod] || order.paymentMethod}</p>
                            </div>
                          </div>
                        </div>

                        <Separator />
                        
                        {/* Seletor de Status */}
                        <div className="flex items-center gap-4">
                           <Label className="font-semibold">Alterar Status do Pedido:</Label>
                           <Select 
                             value={order.status} 
                             // MUDE O 'onValueChange' PARA CHAMAR A 'promptStatusChange'
                             onValueChange={(newStatus) => 
                               promptStatusChange(String(order.id), newStatus, order.status)
                             }
                           >
                             <SelectTrigger className="w-[200px]">
                               <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                               {statusOptions.map(status => (
                                 <SelectItem key={status} value={status}>
                                   {statusMap[status]?.label || status}
                                 </SelectItem>
                               ))}
                             </SelectContent>
                           </Select>
                        </div>
                        
                      </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </CardContent>
      {/* ADICIONE O MODAL DE CONFIRMAÇÃO AQUI */}
      <AlertDialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Alteração de Status?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja alterar o status do pedido #{pendingStatusChange?.orderId} para 
              <strong className="ml-1">{statusMap[pendingStatusChange?.newStatus || '']?.label}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelStatusChange}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => 
                // Chama a função final apenas se o admin confirmar
                handleStatusChange(pendingStatusChange!.orderId, pendingStatusChange!.newStatus)
              }
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default AdminOrderManagement;