
import { getActiveIncidents, getRecentIncidents, getSeverityCounts, getStatusCounts, getTotalImpactedUsers } from "@/lib/mock-data";
import { StatCard } from "@/components/dashboard/StatCard";
import { Bell, Clock, ShieldAlert, Users } from "lucide-react";
import { IncidentCard } from "@/components/incidents/IncidentCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const recentIncidents = getRecentIncidents();
  const activeCount = getActiveIncidents().length;
  const severityCounts = getSeverityCounts();
  const statusCounts = getStatusCounts();
  const totalImpacted = getTotalImpactedUsers();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage IT incidents across your organization.</p>
        </div>
        <Button onClick={() => navigate("/incidents/new")}>
          Create Incident
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Incidents"
          value={activeCount}
          icon={<Bell className="h-4 w-4 text-muted-foreground" />}
          description="Requiring attention"
        />
        <StatCard
          title="Critical Issues"
          value={severityCounts.critical}
          icon={<ShieldAlert className="h-4 w-4 text-severity-critical" />}
          description="Highest priority"
        />
        <StatCard
          title="Users Impacted"
          value={totalImpacted.toLocaleString()}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Across all systems"
        />
        <StatCard
          title="Avg. Resolution Time"
          value="3h 24m"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          description="Last 7 days"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Incidents</h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/incidents")}>
            View All
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentIncidents.map(incident => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      </div>
    </div>
  );
}
