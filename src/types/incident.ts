
export type IncidentSeverity = "critical" | "high" | "medium" | "low";

export type IncidentStatus = "open" | "in-progress" | "resolved";

export interface Incident {
  id: string;
  company: string;
  system: string;
  startTime: Date;
  endTime?: Date;
  impactCount: number;
  description: string;
  resolutionActions?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
