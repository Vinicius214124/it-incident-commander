
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-6xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
      <p className="text-muted-foreground mb-8 max-w-md text-center">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Button onClick={() => navigate("/")}>
        Voltar para o início
      </Button>
    </div>
  );
}
