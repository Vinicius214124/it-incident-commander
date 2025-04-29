
import { Incident } from "@/types/incident";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "../ui/severity-badge";
import { StatusBadge } from "./StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface IncidentTableProps {
  incidents: Incident[];
}

export function IncidentTable({ incidents }: IncidentTableProps) {
  const navigate = useNavigate();
  
  if (incidents.length === 0) {
    return <div className="text-center p-4">No incidents found.</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left font-medium">Company / System</th>
            <th className="py-2 px-4 text-left font-medium">Severity</th>
            <th className="py-2 px-4 text-left font-medium">Status</th>
            <th className="py-2 px-4 text-left font-medium">Impact</th>
            <th className="py-2 px-4 text-left font-medium">Started</th>
            <th className="py-2 px-4 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(incident => (
            <tr key={incident.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-4">
                <div>
                  <div className="font-medium">{incident.company}</div>
                  <div className="text-sm text-muted-foreground">{incident.system}</div>
                </div>
              </td>
              <td className="py-3 px-4">
                <SeverityBadge severity={incident.severity} />
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={incident.status} />
              </td>
              <td className="py-3 px-4">
                {incident.impactCount.toLocaleString()} users
              </td>
              <td className="py-3 px-4">
                {formatDistanceToNow(incident.startTime, { addSuffix: true })}
              </td>
              <td className="py-3 px-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
