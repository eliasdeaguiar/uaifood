import { useState, useEffect } from "react";
// import { mockMessages, mockUsers } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api"; // 3. IMPORTE A API
import { Message } from "@/types"; // 4. IMPORTE O TIPO 'Message'

const MessagesManagement = () => {
  const [messages, setMessages] = useState<Message[]>([]); // Começa vazio
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [response, setResponse] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Para controlar o modal

  // 6. CRIE A FUNÇÃO 'fetchData'
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/messages');
      setMessages(response.data);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      toast({ title: "Erro ao buscar mensagens", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // 7. CRIE O 'useEffect'
  useEffect(() => {
    fetchData();
  }, []);

  // 8. ATUALIZE 'getUserName'
  // O backend já manda o 'user' dentro da mensagem!
  const getUserName = (message: Message) => {
    return message.user?.name || "Usuário desconhecido";
  };

  // 9. ATUALIZE 'handleSendResponse'
  const handleSendResponse = async () => {
    if (!selectedMessage || !response) {
      toast({ title: "Digite uma resposta", variant: "destructive" });
      return;
    }

    try {
      await api.put(`/messages/${selectedMessage.id}`, {
        response: response,
      });

      toast({
        title: "Resposta enviada!",
        description: "O cliente foi notificado.",
      });
      setResponse("");
      setSelectedMessage(null);
      setIsModalOpen(false); // Fecha o modal
      fetchData(); // Atualiza a lista de mensagens
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      toast({ title: "Erro ao enviar resposta", variant: "destructive" });
    }
  };

  // 10. (NOVO) Função para abrir o modal
  const openResponseModal = (message: Message) => {
    setSelectedMessage(message);
    setResponse(""); // Limpa o campo de resposta
    setIsModalOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mensagens dos Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 11. ADICIONE O 'isLoading' */}
        {isLoading ? (
          <p className="text-center">Carregando mensagens...</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`border rounded-lg p-4 space-y-2 ${
                  message.response ? "bg-muted/50" : "bg-background"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{message.subject}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {/* 12. ATUALIZE A CHAMADA DA FUNÇÃO */}
                      De: {getUserName(message)} • {new Date(message.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm mb-3">{message.message}</p>
                    
                    {message.response && (
                      <div className="bg-primary/10 rounded-lg p-3 mt-3">
                        <p className="text-sm font-semibold mb-1">Sua resposta:</p>
                        <p className="text-sm">{message.response}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Respondido em: {message.respondedAt && new Date(message.respondedAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {!message.response && (
                    // 13. CONTROLE O MODAL PELO ESTADO
                    <Dialog open={isModalOpen && selectedMessage?.id === message.id} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openResponseModal(message)} // <--- ATUALIZE O onClick
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Responder
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Responder Mensagem</DialogTitle>
                        </DialogHeader>
                        {/* 14. Garante que o modal tem os dados corretos */}
                        {selectedMessage && (
                          <div className="space-y-4">
                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-sm font-semibold mb-1">{selectedMessage.subject}</p>
                              <p className="text-sm">{selectedMessage.message}</p>
                            </div>
                            <div>
                              <Textarea
                                placeholder="Digite sua resposta..."
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                rows={5}
                              />
                            </div>
                            <Button 
                              className="w-full" 
                              variant="hero"
                              onClick={handleSendResponse} // <--- Botão agora chama a função da API
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Enviar Resposta
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessagesManagement;
