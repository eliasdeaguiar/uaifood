import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({ title: "Erro", description: "Você precisa estar logado para enviar uma mensagem.", variant: "destructive" });
      navigate('/auth');
      return;
    }

    try {
      await api.post('/messages', { subject, message });
      toast({ title: "Mensagem enviada com sucesso!" });
      setSubject("");
      setMessage("");
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error);
      toast({ title: "Erro ao enviar mensagem", description: error.response?.data?.error, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8 flex justify-center items-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Fale Conosco</CardTitle>
            <CardDescription>Tem alguma dúvida, sugestão ou reclamação? Mande para nós!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Dúvida sobre pedido"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem aqui..."
                  rows={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full" variant="hero">
                Enviar Mensagem
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;