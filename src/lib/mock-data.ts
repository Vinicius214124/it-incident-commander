
import { Incident, IncidentSeverity, IncidentStatus } from "@/types/incident";

export const mockIncidents: Incident[] = [
  {
    id: "1",
    company: "Acme Corporation",
    system: "Customer Portal",
    startTime: new Date("2025-04-28T08:30:00"),
    endTime: new Date("2025-04-28T11:45:00"),
    impactCount: 1250,
    description: "Customer portal experiencing slow response times affecting user login and account access. Initial investigation shows database connection pool saturation.",
    resolutionActions: "Increased connection pool size and optimized query for user authentication.",
    severity: "high",
    status: "resolved",
    createdBy: "John Doe",
    createdAt: new Date("2025-04-28T08:35:00"),
    updatedAt: new Date("2025-04-28T11:50:00")
  },
  {
    id: "2",
    company: "TechSolutions Inc",
    system: "Payment Gateway",
    startTime: new Date("2025-04-29T09:15:00"),
    impactCount: 3800,
    description: "Payment processing failures affecting all credit card transactions. Error logs show API timeouts to the payment processor.",
    severity: "critical",
    status: "open",
    createdBy: "Jane Smith",
    createdAt: new Date("2025-04-29T09:20:00"),
    updatedAt: new Date("2025-04-29T09:20:00")
  },
  {
    id: "3",
    company: "Global Logistics",
    system: "Tracking System",
    startTime: new Date("2025-04-27T14:10:00"),
    endTime: new Date("2025-04-27T15:30:00"),
    impactCount: 450,
    description: "Package tracking showing incorrect delivery status for international shipments.",
    resolutionActions: "Fixed timezone conversion issue in the tracking database.",
    severity: "medium",
    status: "resolved",
    createdBy: "Mike Johnson",
    createdAt: new Date("2025-04-27T14:15:00"),
    updatedAt: new Date("2025-04-27T15:35:00")
  },
  {
    id: "4",
    company: "HealthCare Services",
    system: "Patient Records",
    startTime: new Date("2025-04-29T07:30:00"),
    impactCount: 2200,
    description: "Intermittent access issues to patient records system. Staff reporting timeouts when accessing historical data.",
    severity: "high",
    status: "in-progress",
    createdBy: "Sarah Wilson",
    createdAt: new Date("2025-04-29T07:40:00"),
    updatedAt: new Date("2025-04-29T10:15:00")
  },
  {
    id: "5",
    company: "EduLearn Platform",
    system: "Video Conferencing",
    startTime: new Date("2025-04-28T13:20:00"),
    endTime: new Date("2025-04-28T13:55:00"),
    impactCount: 180,
    description: "Audio quality issues during live lectures.",
    resolutionActions: "Server bandwidth allocation increased.",
    severity: "low",
    status: "resolved",
    createdBy: "Robert Chen",
    createdAt: new Date("2025-04-28T13:25:00"),
    updatedAt: new Date("2025-04-28T14:00:00")
  }
];

export const getIncidentById = (id: string): Incident | undefined => {
  return mockIncidents.find(incident => incident.id === id);
};

export const getRecentIncidents = (limit: number = 3): Incident[] => {
  return [...mockIncidents]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
};

export const getActiveIncidents = (): Incident[] => {
  return mockIncidents.filter(incident => incident.status !== "resolved");
};

export const getSeverityCounts = (): Record<IncidentSeverity, number> => {
  return {
    critical: mockIncidents.filter(i => i.severity === "critical").length,
    high: mockIncidents.filter(i => i.severity === "high").length,
    medium: mockIncidents.filter(i => i.severity === "medium").length,
    low: mockIncidents.filter(i => i.severity === "low").length
  };
};

export const getStatusCounts = (): Record<IncidentStatus, number> => {
  return {
    open: mockIncidents.filter(i => i.status === "open").length,
    "in-progress": mockIncidents.filter(i => i.status === "in-progress").length,
    resolved: mockIncidents.filter(i => i.status === "resolved").length
  };
};

export const getTotalImpactedUsers = (): number => {
  return mockIncidents.reduce((sum, incident) => sum + incident.impactCount, 0);
};
