import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
//import { mockAddresses } from "@/data/mockData";
import { PaymentMethod, Address } from "@/types";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Wallet, Banknote, MapPin, Plus } from "lucide-react"; // 4. IMPORTE O ÍCONE 'Plus'
import { api } from "@/lib/api"; // 5. IMPORTE A 'api'
import { Skeleton } from "@/components/ui/skeleton"; // 6. IMPORTE 'Skeleton'

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  // 7. CRIE OS NOVOS ESTADOS
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 8. ATUALIZE O ESTADO 'selectedAddress'
  // Ele começará vazio e será preenchido após a busca
  const [selectedAddress, setSelectedAddress] = useState(""); 
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.PIX);
  const deliveryFee = 8.00;

  // 9. CRIE O 'useEffect' PARA BUSCAR OS ENDEREÇOS
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    const fetchAddresses = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/addresses/me');
        setUserAddresses(response.data);
        
        // Seleciona o primeiro endereço da lista por padrão
        if (response.data.length > 0) {
          setSelectedAddress(response.data[0].id);
        }
      } catch (error) {
        console.error("Erro ao buscar endereços:", error);
        toast({ title: "Erro ao buscar seus endereços", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [isAuthenticated, navigate]);


  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  // 10. REMOVA A LÓGICA MOCKADA
  // const userAddresses = mockAddresses.filter((addr) => addr.userId === user?.id);
  const selectedAddressData = userAddresses.find((addr) => addr.id === selectedAddress);

  const handleConfirmOrder = async () => {
    // 1. Verificação de segurança
    if (!selectedAddress) {
      toast({ title: "Erro", description: "Por favor, selecione um endereço de entrega.", variant: "destructive" });
      return;
    }
    if (items.length === 0) {
      toast({ title: "Erro", description: "Seu carrinho está vazio.", variant: "destructive" });
      return;
    }

    // 2. Formatar os itens para o backend
    // O backend espera: [{ itemId: 1, quantity: 2 }, ...]
    const orderItems = items.map(item => ({
      itemId: parseInt(item.id), // Garantir que é um número
      quantity: item.quantity,
    }));

    // 3. Montar o payload final
    const orderData = {
      paymentMethod: paymentMethod,       // Do estado
      addressId: parseInt(selectedAddress), // Do estado (garantir que é número)
      items: orderItems,                  // Do carrinho
    };

    // 4. Enviar para a API
    try {
      await api.post('/orders', orderData); // O AuthContext já injeta o Token

      // 5. Sucesso!
      toast({
        title: "Pedido realizado com sucesso!",
        description: "Seu pedido está sendo preparado e logo estará a caminho.",
      });
      clearCart();
      navigate("/"); // Redireciona para a home

    } catch (error: any) {
      console.error("Erro ao confirmar pedido:", error);
      const errorMsg = error.response?.data?.error || "Não foi possível finalizar o pedido.";
      toast({
        title: "Erro no Pedido",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const paymentIcons = {
    [PaymentMethod.PIX]: <Wallet className="h-5 w-5" />,
    [PaymentMethod.CREDIT]: <CreditCard className="h-5 w-5" />,
    [PaymentMethod.DEBIT]: <CreditCard className="h-5 w-5" />,
    [PaymentMethod.CASH]: <Banknote className="h-5 w-5" />,
  };

  const paymentLabels = {
    [PaymentMethod.PIX]: "PIX",
    [PaymentMethod.CREDIT]: "Cartão de Crédito",
    [PaymentMethod.DEBIT]: "Cartão de Débito",
    [PaymentMethod.CASH]: "Dinheiro",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Finalizar Pedido
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Endereço de Entrega */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 11. ADICIONE O 'isLoading' */}
                {isLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                    {userAddresses.map((address) => (
                      <div key={address.id} className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value={address.id} id={address.id} />
                        <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                          <div className="font-semibold">
                            {address.street}, {address.number}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {address.district} - {address.city}/{address.state}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            CEP: {address.zipCode}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {/* 13. (BÔNUS) BOTÃO PARA ADICIONAR ENDEREÇO */}
                {/* (Ainda não temos o modal para isso, mas podemos deixar o botão) */}
                <Button 
                  variant="outline" 
                  className="w-full mt-4" 
                  onClick={() => navigate('/meus-enderecos')} // <--- MUDE AQUI
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Gerenciar Endereços
                </Button>
              </CardContent>
            </Card>

            {/* Forma de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle>Forma de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  {Object.values(PaymentMethod).map((method) => (
                    <div key={method} className="flex items-center space-x-2 border rounded-lg p-4">
                      <RadioGroupItem value={method} id={method} />
                      <Label htmlFor={method} className="flex items-center gap-2 flex-1 cursor-pointer">
                        {paymentIcons[method]}
                        <span className="font-semibold">{paymentLabels[method]}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.description}</span>
                      <span>R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de entrega</span>
                  <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">R$ {(totalPrice + deliveryFee).toFixed(2)}</span>
                </div>
                
                {selectedAddressData && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-semibold mb-1">Entregar em:</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAddressData.street}, {selectedAddressData.number}<br />
                      {selectedAddressData.city}/{selectedAddressData.state}
                    </p>
                  </div>
                )}
                
                <Button 
                  className="w-full" 
                  size="lg" 
                  variant="hero"
                  onClick={handleConfirmOrder}
                >
                  Confirmar Pedido
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
