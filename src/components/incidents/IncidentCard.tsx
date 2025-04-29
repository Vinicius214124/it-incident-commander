
import { Incidente } from "@/types/incident";
import { SeverityBadge } from "../ui/severity-badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IncidentCardProps {
  incident: Incidente;
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{incident.empresa}</h3>
            <p className="text-sm text-muted-foreground">{incident.sistema}</p>
          </div>
          <SeverityBadge severity={incident.severidade} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-2 text-sm">{incident.descricao}</p>
        <div className="flex items-center gap-1 mt-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{incident.total_impactados.toLocaleString()} usuários impactados</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(incident.hora_inicio, { locale: ptBR, addSuffix: true })}
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(`/incidentes/${incident.id}`)}
        >
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
