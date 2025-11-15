// Em: frontend/src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// 1. Importamos o 'User' e 'UserType' corretos do seu arquivo 'types'
import { User, UserType } from "@/types"; 
// 2. Importamos a API
import { api } from "@/lib/api"; 

// 3. Tipos para os dados que o backend espera (com 'phone')
interface SignInData {
  phone: string;
  password: string;
}

interface SignUpData {
  name: string;
  phone: string;
  password: string;
}

// 4. Ajustamos o tipo do Contexto
interface AuthContextType {
  user: User | null;
  signIn: (data: SignInData) => Promise<boolean>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean; // Para sabermos quando a verificação inicial terminou
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 5. useEffect para carregar o token ao iniciar
  useEffect(() => {
    async function loadUserFromStorage() {
      const storedToken = localStorage.getItem("uaifood:token");

      if (storedToken) {
        // Se temos um token, configuramos o axios para usá-lo em todas as requisições
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        setToken(storedToken);
        
        // E buscamos os dados do usuário com a rota /me que criamos
        try {
          const response = await api.get('/users/me');
          // No backend, o model tem 'userType', mas no frontend o tipo é 'type'.
          // O seu 'index.ts' de tipos está diferente do seu backend.
          // Vamos assumir que a API retorna 'userType' como no backend
          const userData = response.data;
          
          // Ajuste rápido: O frontend espera 'type', mas o backend manda 'userType'
          // Vamos converter aqui para o 'Header.tsx' funcionar
          // A interface 'User' em 'frontend/src/types/index.ts' também está errada
          const formattedUser = {
            ...userData,
            type: userData.userType, 
          };

          setUser(formattedUser);
        } catch (error) {
          console.error("Token inválido ou expirado, fazendo logout:", error);
          signOut(); // Limpa o token inválido
        }
      }
      setIsLoading(false); // Terminamos a verificação inicial
    }

    loadUserFromStorage();
  }, []);

  // 6. Nova função de Login (SignIn)
  const signIn = async ({ phone, password }: SignInData): Promise<boolean> => {
    try {
      const response = await api.post('/users/login', {
        phone,
        password,
      });

      const { token: newToken } = response.data;

      localStorage.setItem("uaifood:token", newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);

      // Agora, busca os dados do usuário
      const userResponse = await api.get('/users/me');
      
      // Mesmo ajuste da Etapa 5
      const userData = userResponse.data;
      const formattedUser = {
        ...userData,
        type: userData.userType,
      };
      setUser(formattedUser);

      return true;
    } catch (error) {
      console.error("Erro no signIn:", error);
      return false;
    }
  };

  // 7. Nova função de Cadastro (SignUp)
  const signUp = async ({ name, phone, password }: SignUpData) => {
    try {
      await api.post('/users', {
        name,
        phone,
        password,
        userType: 'CLIENT', // 'userType' como o backend espera
      });
    } catch (error: any) {
      console.error('Erro no signUp:', error);
      if (error.response?.status === 409) {
        throw new Error('Este telefone já está cadastrado.');
      }
      throw new Error('Erro ao realizar cadastro.');
    }
  };

  // 8. Nova função de Logout (SignOut)
  const signOut = async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error("Erro no logout (backend):", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("uaifood:token");
      api.defaults.headers.common['Authorization'] = undefined;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!token,
        isAdmin: user?.userType === UserType.ADMIN, // O 'type' formatado
        isLoading,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};