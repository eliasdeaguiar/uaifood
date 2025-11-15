import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Item, Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
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

const BACKEND_URL = 'http://localhost:3000';

const ItemsManagement = () => {
  const [items, setItems] = useState<Item[]>([]);

  // ADICIONE ESTES ESTADOS:
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para o modal de Adicionar
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemImage, setNewItemImage] = useState<File | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // MUDE os estados de Edição (tipando corretamente e renomeando)
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ADICIONE estados para os campos de Edição
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null); // Para a *nova* imagem

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Busca itens e categorias ao mesmo tempo
      const [itemsResponse, categoriesResponse] = await Promise.all([
        api.get('/items'),
        api.get('/categories')
      ]);
      setItems(itemsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados do admin:", error);
      toast({ title: "Erro ao buscar dados", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // ADICIONE ISTO:
  useEffect(() => {
    fetchData();
  }, []);

  const handleAddNewItem = async () => {
    if (!newItemDescription || !newItemPrice || !newItemCategory || !newItemImage) {
      toast({ title: "Preencha todos os campos, incluindo a imagem", variant: "destructive" });
      return;
    }

    // Usamos FormData por causa do arquivo de imagem
    const formData = new FormData();
    formData.append('description', newItemDescription);
    formData.append('unitPrice', newItemPrice);
    formData.append('categoryId', newItemCategory);
    formData.append('image', newItemImage);

    try {
      await api.post('/items', formData); // O AuthContext já injeta o Token

      toast({ title: "Prato adicionado com sucesso!" });
      setIsAddModalOpen(false); // Fecha o modal
      // Limpa os campos
      setNewItemDescription("");
      setNewItemPrice("");
      setNewItemCategory("");
      setNewItemImage(null);
      fetchData(); // Atualiza a tabela
    } catch (error: any) {
      console.error("Erro ao adicionar item:", error);
      const errorMsg = error.response?.data?.error || "Erro desconhecido";
      toast({ title: "Erro ao adicionar prato", description: errorMsg, variant: "destructive" });
    }
  };

  // ATUALIZE 'handleEdit' para popular os novos 'editStates'
  const handleEdit = (item: Item) => { // <--- Tipo 'Item'
    setEditingItem(item);
    // Popula os estados do modal de edição
    setEditDescription(item.description);
    setEditPrice(String(item.unitPrice));
    setEditCategory(String(item.categoryId));
    setEditImage(null); // Reseta o campo de nova imagem
    setIsEditModalOpen(true); // <--- Use o state renomeado
  };

  // ATUALIZE 'handleSave' para usar a API (era mock)
  const handleSave = async () => {
    if (!editingItem) return;

    // Criar FormData para o UPDATE
    const formData = new FormData();
    formData.append('description', editDescription);
    formData.append('unitPrice', editPrice);
    formData.append('categoryId', editCategory);
    // Só envia a imagem se uma nova foi selecionada
    if (editImage) {
      formData.append('image', editImage);
    }

    try {
      await api.put(`/items/${editingItem.id}`, formData);
      
      toast({ title: "Prato atualizado com sucesso!" });
      setIsEditModalOpen(false);
      setEditingItem(null);
      fetchData(); // Atualiza a tabela
    } catch (error: any) {
      console.error("Erro ao atualizar item:", error);
      toast({ title: "Erro ao atualizar", description: error.response?.data?.error, variant: "destructive" });
    }
  };

  // ADICIONE A FUNÇÃO 'handleDelete'
  const handleDeleteItem = async (itemId: string) => {
    try {
      await api.delete(`/items/${itemId}`);
      toast({ title: "Prato deletado com sucesso!" });
      fetchData(); // Atualiza a tabela
    } catch (error: any) {
      console.error("Erro ao deletar item:", error);
      toast({ title: "Erro ao deletar", description: error.response?.data?.error, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gerenciar Pratos</CardTitle>
        <Dialog>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}></Dialog>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Prato
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Prato</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome do Prato</Label>
                <Input 
                  placeholder="Ex: Burger Artesanal"
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                />
              </div>
              <div>
                <Label>Preço</Label>
                <Input 
                  type="number" step="0.01" placeholder="0.00"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                />
              </div>
              <div>
                <Label>Categoria</Label>
                <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => ( // <--- 'categories' do state
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Imagem do Prato</Label>
                <Input 
                  type="file" 
                  accept="image/png, image/jpeg"
                  onChange={(e) => setNewItemImage(e.target.files ? e.target.files[0] : null)}
                />
              </div>
              <Button className="w-full" variant="hero" onClick={handleAddNewItem}>
                Adicionar Prato
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* ADICIONE O ESTADO DE LOADING */}
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Carregando dados...
                </TableCell>
              </TableRow>
            ) : (
              // MAPEIE OS 'items' VINDOS DA API
              items.map((item) => {
                // Monte a URL da imagem
                const imageSrc = item.image ? `${BACKEND_URL}/files/${item.image}` : undefined;
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <img 
                        src={imageSrc} // <--- USE A URL
                        alt={item.description} 
                        className="w-16 h-16 object-cover rounded-lg bg-muted" // placeholder
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell>R$ {item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {/* Use a categoria que veio na API */}
                      {item.category?.description || "Sem categoria"}
                    </TableCell>
                    <TableCell>
                      {/* Deixe as avaliações como estão por enquanto */}
                      {item.averageRating?.toFixed(1)} ⭐ ({item.reviewCount || 0})
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)} // <--- 'handleEdit' já estava certo
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {/* MUDE O BOTÃO 'Deletar' para usar o 'AlertDialog' */}
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
                              Essa ação irá deletar permanentemente o prato "{item.description}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => handleDeleteItem(String(item.id))}
                            >
                              Deletar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* MUDE para usar o state 'isEditModalOpen' */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}> 
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Prato</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-4">
                <div>
                  <Label>Nome do Prato</Label>
                  {/* CONECTE O INPUT */}
                  <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                </div>
                <div>
                  <Label>Preço</Label>
                  {/* CONECTE O INPUT */}
                  <Input 
                    type="number" step="0.01" 
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)} 
                  />
                </div>
                <div>
                  <Label>Categoria</Label>
                  {/* CONECTE O SELECT E POPULE COM DADOS REAIS */}
                  <Select value={editCategory} onValueChange={setEditCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* ADICIONE O CAMPO DE IMAGEM */}
                <div>
                  <Label>Nova Imagem (Opcional)</Label>
                  <Input 
                    type="file" 
                    accept="image/png, image/jpeg"
                    onChange={(e) => setEditImage(e.target.files ? e.target.files[0] : null)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Deixe em branco para manter a imagem atual.
                  </p>
                </div>
                {/* O 'onClick' já estava certo, chamando 'handleSave' */}
                <Button className="w-full" variant="hero" onClick={handleSave}>
                  Salvar Alterações
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ItemsManagement;
