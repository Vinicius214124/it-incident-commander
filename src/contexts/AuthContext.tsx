
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { PerfilUsuario } from "@/types/incident";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  perfil: PerfilUsuario | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isTI: boolean;
  isSupport: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<PerfilUsuario>) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Usar setTimeout para evitar deadlock com callback Supabase
          setTimeout(async () => {
            await fetchPerfil(currentSession.user.id);
          }, 0);
        } else {
          setPerfil(null);
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchPerfil(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPerfil = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return;
      }

      if (data) {
        setPerfil({
          ...data,
          criado_em: new Date(data.criado_em),
          atualizado_em: new Date(data.atualizado_em)
        });
      }
    } catch (error) {
      console.error('Erro ao processar perfil:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao Sistema de Gerenciamento de Incidentes",
      });

      navigate('/');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente",
        variant: "destructive"
      });
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<PerfilUsuario>) => {
    try {
      // Incluir dados do usuário nos metadados
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            nome: userData.nome,
            sobrenome: userData.sobrenome,
            setor: userData.setor,
            cargo: userData.cargo
          }
        }
      });
      
      if (error) {
        throw error;
      }

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Você já pode fazer login no sistema",
      });

      navigate('/auth');
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Não foi possível completar o cadastro",
        variant: "destructive"
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setPerfil(null);
    navigate('/auth');
    toast({
      title: "Sessão encerrada",
      description: "Você saiu do sistema com sucesso",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        perfil,
        isLoading,
        isAuthenticated: !!user,
        isTI: perfil?.setor === 'TI',
        isSupport: perfil?.setor === 'Suporte',
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
