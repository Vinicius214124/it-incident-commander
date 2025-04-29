
import { useState } from "react";
import { mockIncidents } from "@/lib/mock-data";
import { IncidentTable } from "@/components/incidents/IncidentTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { IncidentSeverity, IncidentStatus } from "@/types/incident";
import { StatusBadge } from "@/components/incidents/StatusBadge";

export default function IncidentsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const filteredIncidents = mockIncidents.filter(incident => {
    const matchesSearch = 
      incident.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
      incident.system.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSeverity = filterSeverity === "all" || incident.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || incident.status === filterStatus;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Incidents</h1>
          <p className="text-muted-foreground">View and manage all IT incidents.</p>
        </div>
        <Button onClick={() => navigate("/incidents/new")}>
          Create Incident
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:flex-1">
          <Input 
            placeholder="Search incidents..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity="critical" />
                  <span>Critical</span>
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity="high" />
                  <span>High</span>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity="medium" />
                  <span>Medium</span>
                </div>
              </SelectItem>
              <SelectItem value="low">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity="low" />
                  <span>Low</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">
                <div className="flex items-center gap-2">
                  <StatusBadge status="open" />
                  <span>Open</span>
                </div>
              </SelectItem>
              <SelectItem value="in-progress">
                <div className="flex items-center gap-2">
                  <StatusBadge status="in-progress" />
                  <span>In Progress</span>
                </div>
              </SelectItem>
              <SelectItem value="resolved">
                <div className="flex items-center gap-2">
                  <StatusBadge status="resolved" />
                  <span>Resolved</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <IncidentTable incidents={filteredIncidents} />
    </div>
  );
}
