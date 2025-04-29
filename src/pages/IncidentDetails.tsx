
import { useParams, useNavigate } from "react-router-dom";
import { getIncidentById } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { StatusBadge } from "@/components/incidents/StatusBadge";
import { format } from "date-fns";
import { CalendarPlus, ChevronLeft, FileText, MessageSquare, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function IncidentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const incident = getIncidentById(id || "");
  
  if (!incident) {
    return (
      <div className="text-center p-12">
        <h1 className="text-2xl font-bold mb-4">Incident not found</h1>
        <p className="mb-6">The incident you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/incidents")}>
          Back to Incidents
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/incidents")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Incident Details</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Add Comment
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarPlus className="h-4 w-4" />
            Schedule Update
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div>
                  <div>{incident.company}</div>
                  <div className="text-sm text-muted-foreground">{incident.system}</div>
                </div>
                <div className="flex gap-2">
                  <SeverityBadge severity={incident.severity} />
                  <StatusBadge status={incident.status} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Description</h3>
                <p className="text-sm">{incident.description}</p>
              </div>
              
              {incident.resolutionActions && (
                <div>
                  <h3 className="font-medium mb-1">Resolution Actions</h3>
                  <p className="text-sm">{incident.resolutionActions}</p>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{incident.impactCount.toLocaleString()} users impacted</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>History of updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Incident reported</p>
                      <p className="text-xs text-muted-foreground">
                        {format(incident.createdAt, "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <p className="text-sm">
                      {incident.createdBy} created this incident with severity <SeverityBadge severity={incident.severity} />.
                    </p>
                  </div>
                </div>
                
                {incident.status === "in-progress" && (
                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Status updated</p>
                        <p className="text-xs text-muted-foreground">
                          {format(incident.updatedAt, "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <p className="text-sm">
                        Status changed from <StatusBadge status="open" /> to <StatusBadge status="in-progress" />.
                      </p>
                    </div>
                  </div>
                )}
                
                {incident.status === "resolved" && (
                  <>
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Status updated</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(incident.startTime.getTime() + 1800000), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                        <p className="text-sm">
                          Status changed from <StatusBadge status="open" /> to <StatusBadge status="in-progress" />.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Incident resolved</p>
                          <p className="text-xs text-muted-foreground">
                            {format(incident.updatedAt, "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                        <p className="text-sm">
                          Status changed from <StatusBadge status="in-progress" /> to <StatusBadge status="resolved" />.
                          Resolution time: {format(incident.startTime, "h:mm a")} - {format(incident.endTime || new Date(), "h:mm a")}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Incident Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-muted-foreground">ID</div>
                  <div className="col-span-2 font-mono">{incident.id}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-muted-foreground">Created by</div>
                  <div className="col-span-2">{incident.createdBy}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-muted-foreground">Created at</div>
                  <div className="col-span-2">{format(incident.createdAt, "MMM d, yyyy h:mm a")}</div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-muted-foreground">Start time</div>
                  <div className="col-span-2">{format(incident.startTime, "MMM d, yyyy h:mm a")}</div>
                </div>
                
                {incident.endTime && (
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-muted-foreground">End time</div>
                    <div className="col-span-2">{format(incident.endTime, "MMM d, yyyy h:mm a")}</div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-muted-foreground">Duration</div>
                  <div className="col-span-2">
                    {incident.endTime ? 
                      formatDuration(incident.startTime, incident.endTime) : 
                      "Ongoing"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Related Systems</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-2">
                <div className="p-2 bg-muted rounded-md">
                  <div className="font-medium">{incident.system}</div>
                  <div className="text-xs text-muted-foreground">Primary affected system</div>
                </div>
                
                {incident.severity === "critical" && (
                  <div className="p-2 bg-muted rounded-md">
                    <div className="font-medium">Authentication Service</div>
                    <div className="text-xs text-muted-foreground">Secondary affected system</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function formatDuration(start: Date, end: Date): string {
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else if (minutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
}
