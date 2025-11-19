import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  // 1. TROQUE 'email' por 'phone'
  const [phone, setPhone] = useState(""); 
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  // 2. REMOVA 'dateBirth'
  // const [dateBirth, setDateBirth] = useState(""); 
  
  // 3. TROQUE 'login' por 'signIn' e adicione 'signUp' (virão do novo AuthContext)
  const { signIn, signUp, isAuthenticated, user } = useAuth(); 
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.userType === "ADMIN" ? "/admin" : "/");
    }
  }, [isAuthenticated, navigate, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // 5. CHAME 'signIn' com 'phone'
    const success = await signIn({ phone, password }); 
    if (success) {
      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta ao UaiFood!",
      });
      // a navegação é feita pelo useEffect
    } else {
      toast({
        title: "Erro no login",
        description: "Telefone ou senha incorretos.",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // 6. CHAME 'signUp' com os dados corretos
    try {
      await signUp({ name, phone, password });
      toast({
        title: "Cadastro realizado!",
        description: "Você já pode fazer o login.",
      });
      // TODO: Limpar os campos ou mudar de aba
    } catch (error: any) {
       toast({
        title: "Erro no cadastro",
        // A mensagem de erro virá do backend (Ex: "Telefone já cadastrado")
        description: error.message || "Não foi possível criar a conta.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary" />
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              UaiFood
            </span>
          </Link>
          <CardTitle>Bem-vindo!</CardTitle>
          <CardDescription>Entre ou crie sua conta para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Telefone</Label>
                  <Input
                    id="login-phone"
                    type="tel" // Mude o tipo
                    placeholder="(31) 99999-9999" // Mude o placeholder
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome Completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={1}
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Telefone</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="(31) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                {/*
                <div className="space-y-2">
                  <Label htmlFor="signup-date">Data de Nascimento</Label>
                  <Input
                    id="signup-date"
                    type="date"
                    value={dateBirth}
                    onChange={(e) => setDateBirth(e.target.value)}
                    required
                  />
                </div>
                */}
                <Button type="submit" className="w-full" size="lg">
                  Criar Conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
