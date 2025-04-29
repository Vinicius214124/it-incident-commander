
import { Incident } from "@/types/incident";
import { SeverityBadge } from "../ui/severity-badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IncidentCardProps {
  incident: Incident;
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{incident.company}</h3>
            <p className="text-sm text-muted-foreground">{incident.system}</p>
          </div>
          <SeverityBadge severity={incident.severity} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-2 text-sm">{incident.description}</p>
        <div className="flex items-center gap-1 mt-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{incident.impactCount.toLocaleString()} users impacted</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(incident.startTime, { addSuffix: true })}
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(`/incidents/${incident.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
