
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShieldX, Home } from "lucide-react";

export default function AcessoNegado() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <ShieldX className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Você não tem permissão para acessar esta página. 
        Entre em contato com o administrador do sistema se acredita que isso é um erro.
      </p>
      <Button 
        onClick={() => navigate("/")} 
        className="flex items-center gap-2"
      >
        <Home className="h-4 w-4" />
        Voltar para a página inicial
      </Button>
    </div>
  );
}
