import { useState } from "react";
import { mockMessages, mockUsers } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MessagesManagement = () => {
  const [messages] = useState(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<typeof mockMessages[0] | null>(null);
  const [response, setResponse] = useState("");

  const getUserName = (userId: string) => {
    return mockUsers.find(u => u.id === userId)?.name || "Usuário desconhecido";
  };

  const handleSendResponse = () => {
    toast({
      title: "Resposta enviada!",
      description: "O cliente receberá sua resposta por email.",
    });
    setResponse("");
    setSelectedMessage(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mensagens dos Clientes</CardTitle>
      </CardHeader>
      <CardContent>
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
                    De: {getUserName(message.userId)} • {new Date(message.createdAt).toLocaleDateString('pt-BR')}
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedMessage(message)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Responder
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Responder Mensagem</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm font-semibold mb-1">{message.subject}</p>
                          <p className="text-sm">{message.message}</p>
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
                          onClick={handleSendResponse}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Resposta
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagesManagement;
