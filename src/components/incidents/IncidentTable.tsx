
import { Incidente } from "@/types/incident";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "../ui/severity-badge";
import { StatusBadge } from "./StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface IncidentTableProps {
  incidents: Incidente[];
}

export function IncidentTable({ incidents }: IncidentTableProps) {
  const navigate = useNavigate();
  
  if (incidents.length === 0) {
    return <div className="text-center p-4">Nenhum incidente encontrado.</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left font-medium">Empresa / Sistema</th>
            <th className="py-2 px-4 text-left font-medium">Severidade</th>
            <th className="py-2 px-4 text-left font-medium">Status</th>
            <th className="py-2 px-4 text-left font-medium">Impacto</th>
            <th className="py-2 px-4 text-left font-medium">Início</th>
            <th className="py-2 px-4 text-left font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(incident => (
            <tr key={incident.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-4">
                <div>
                  <div className="font-medium">{incident.empresa}</div>
                  <div className="text-sm text-muted-foreground">{incident.sistema}</div>
                </div>
              </td>
              <td className="py-3 px-4">
                <SeverityBadge severity={incident.severidade} />
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={incident.status} />
              </td>
              <td className="py-3 px-4">
                {incident.total_impactados.toLocaleString()} usuários
              </td>
              <td className="py-3 px-4">
                {formatDistanceToNow(incident.hora_inicio, { locale: ptBR, addSuffix: true })}
              </td>
              <td className="py-3 px-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/incidentes/${incident.id}`)}
                >
                  Ver
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
