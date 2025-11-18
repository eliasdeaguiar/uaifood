import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Address } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";

// Formulário para Adicionar/Editar Endereço
// (Criado como um sub-componente para organizar)
interface AddressFormProps {
  initialData?: Address; // Se 'initialData' for fornecido, estamos editando
  onSave: () => void;
  onCancel: () => void;
}

const AddressForm = ({ initialData, onSave, onCancel }: AddressFormProps) => {
  const [street, setStreet] = useState(initialData?.street || "");
  const [number, setNumber] = useState(initialData?.number || "");
  const [district, setDistrict] = useState(initialData?.district || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [state, setState] = useState(initialData?.state || "");
  const [zipCode, setZipCode] = useState(initialData?.zipCode || "");

  const handleSubmit = async () => {
    const addressData = { street, number, district, city, state, zipCode };
    
    try {
      if (initialData) {
        // Modo Edição (PUT)
        await api.put(`/addresses/${initialData.id}`, addressData);
        toast({ title: "Endereço atualizado com sucesso!" });
      } else {
        // Modo Criação (POST)
        await api.post('/addresses', addressData);
        toast({ title: "Endereço adicionado com sucesso!" });
      }
      onSave(); // Fecha o modal e recarrega os dados
    } catch (error: any) {
      console.error("Erro ao salvar endereço:", error);
      toast({ title: "Erro ao salvar endereço", description: error.response?.data?.error, variant: "destructive" });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Label htmlFor="street">Rua</Label>
        <Input id="street" value={street} onChange={(e) => setStreet(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="number">Número</Label>
        <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="district">Bairro</Label>
        <Input id="district" value={district} onChange={(e) => setDistrict(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="city">Cidade</Label>
        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="state">Estado (UF)</Label>
        <Input id="state" value={state} onChange={(e) => setState(e.target.value)} maxLength={2} />
      </div>
      <div className="col-span-2">
        <Label htmlFor="zipCode">CEP</Label>
        <Input id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
      </div>
      <DialogFooter className="col-span-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSubmit}>Salvar Endereço</Button>
      </DialogFooter>
    </div>
  );
};

// Página Principal
const MyAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Estados do Modal (null = fechado, {} = novo, {address} = editando)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/addresses/me');
      setAddresses(response.data);
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
      toast({ title: "Erro ao buscar seus endereços", variant: "destructive" });
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

  const handleDelete = async (addressId: number) => {
    try {
      await api.delete(`/addresses/${addressId}`);
      toast({ title: "Endereço deletado com sucesso!" });
      fetchData(); // Recarrega a lista
    } catch (error: any) {
      console.error("Erro ao deletar endereço:", error);
      toast({ title: "Erro ao deletar", description: error.response?.data?.error, variant: "destructive" });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleSave = () => {
    closeModal();
    fetchData(); // Recarrega os dados após salvar
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Meus Endereços
            </h1>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Novo Endereço
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6">
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="p-16 text-center">
                  <MapPin className="h-24 w-24 mx-auto text-muted-foreground" />
                  <h2 className="text-2xl font-bold mt-4">Nenhum endereço cadastrado</h2>
                  <p className="text-muted-foreground">Adicione um endereço para facilitar seus pedidos.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {addresses.map((address) => (
                    <div key={address.id} className="p-6 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{address.street}, {address.number}</p>
                        <p className="text-sm text-muted-foreground">{address.district} - {address.city}/{address.state}</p>
                        <p className="text-sm text-muted-foreground">CEP: {address.zipCode}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => {
                          setEditingAddress(address);
                          setIsModalOpen(true);
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita e irá deletar o endereço: <br />
                                "{address.street}, {address.number}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDelete(Number(address.id))}
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
        </main>
        <Footer />
      </div>

      {/* Modal de Adicionar/Editar Endereço */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Editar Endereço" : "Adicionar Novo Endereço"}</DialogTitle>
          </DialogHeader>
          <AddressForm
            initialData={editingAddress || undefined}
            onSave={handleSave}
            onCancel={closeModal}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyAddresses;