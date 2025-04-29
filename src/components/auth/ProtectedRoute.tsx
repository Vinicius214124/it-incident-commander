
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = {
  requiredSetor?: "TI" | "Suporte";
};

export function ProtectedRoute({ requiredSetor }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, perfil } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Verifica acesso por setor quando necessário
  if (requiredSetor && perfil?.setor !== requiredSetor && perfil?.setor !== 'TI') {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <Outlet />;
}
