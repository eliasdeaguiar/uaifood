import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";

// --- COMPONENTE AUXILIAR DE SENHA ---
const PasswordInput = ({ 
  id, 
  value, 
  onChange, 
  show, 
  setShow, 
  placeholder 
}: { 
  id: string, 
  value: string, 
  onChange: (val: string) => void, 
  show: boolean, 
  setShow: (val: boolean) => void,
  placeholder: string
}) => (
  <div className="relative">
    <Input 
      id={id} 
      type={show ? "text" : "password"} 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      required 
      minLength={6}
      placeholder={placeholder}
      className="pr-10" 
    />
    <button
      type="button"
      onClick={() => setShow(!show)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      tabIndex={-1} 
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  </div>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  // Estados de Dados
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  
  const [loginPassword, setLoginPassword] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados de Visibilidade
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  // Limpa campos ao abrir
  useEffect(() => {
    if (isOpen) {
      setPhone("");
      setLoginPassword("");
      setSignupPassword("");
      setConfirmPassword("");
      setName("");
      setShowLoginPass(false);
      setShowSignupPass(false);
      setShowConfirmPass(false);
    }
  }, [isOpen]);

  // --- FUNÇÃO MÁGICA DE FORMATAÇÃO DE TELEFONE ---
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
    
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

    // Aplica a máscara progressiva: (XX) XXXXX XXXX
    if (value.length > 7) {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2 $3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else if (value.length > 0) {
      value = value.replace(/^(\d{0,2})/, "($1");
    }
    
    setPhone(value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Remove a formatação antes de enviar pro backend (envia só números: 31999999999)
    const cleanPhone = phone.replace(/\D/g, "");
    
    const success = await signIn({ phone: cleanPhone, password: loginPassword });
    if (success) {
      toast({ title: "Login realizado!", description: "Bem-vindo de volta!" });
      onClose();
    } else {
      toast({ title: "Erro no login", description: "Telefone ou senha incorretos.", variant: "destructive" });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    try {
      await signUp({ name, phone: cleanPhone, password: signupPassword });
      toast({ title: "Cadastro realizado!", description: "Faça login para continuar." });
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Acessar Conta</DialogTitle>
          <DialogDescription className="text-center">
            Entre ou cadastre-se para fazer seus pedidos
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="modal-login-phone">Telefone</Label>
                <Input 
                  id="modal-login-phone" 
                  type="tel" 
                  placeholder="(31) 99999 9999" 
                  value={phone} 
                  onChange={handlePhoneChange} // <--- USA A NOVA FUNÇÃO
                  required 
                  maxLength={16} // Limite visual com a máscara
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-login-password">Senha</Label>
                <PasswordInput 
                  id="modal-login-password"
                  value={loginPassword}
                  onChange={setLoginPassword}
                  show={showLoginPass}
                  setShow={setShowLoginPass}
                  placeholder="Sua senha"
                />
              </div>
              <Button type="submit" className="w-full" variant="hero">Entrar</Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="modal-signup-name">Nome Completo</Label>
                <Input 
                  id="modal-signup-name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-signup-phone">Telefone</Label>
                <Input 
                  id="modal-signup-phone" 
                  type="tel" 
                  value={phone} 
                  onChange={handlePhoneChange} // <--- USA A MESMA FUNÇÃO (estado compartilhado de telefone)
                  required 
                  placeholder="(31) 99999 9999"
                  maxLength={16}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-signup-password">Senha</Label>
                <PasswordInput 
                  id="modal-signup-password"
                  value={signupPassword}
                  onChange={setSignupPassword}
                  show={showSignupPass}
                  setShow={setShowSignupPass}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-signup-confirm">Confirmar Senha</Label>
                <PasswordInput 
                  id="modal-signup-confirm"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  show={showConfirmPass}
                  setShow={setShowConfirmPass}
                  placeholder="Digite a senha novamente"
                />
              </div>
              <Button type="submit" className="w-full" variant="hero">Criar Conta</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}