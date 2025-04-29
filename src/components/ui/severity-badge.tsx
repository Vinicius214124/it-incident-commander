
import { cn } from "@/lib/utils";
import { IncidentSeverity } from "@/types/incident";

interface SeverityBadgeProps {
  severity: IncidentSeverity;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <span className={cn(
      `severity-badge-${severity}`,
      className
    )}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}
