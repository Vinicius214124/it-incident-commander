
import { cn } from "@/lib/utils";
import { SeveridadeIncidente } from "@/types/incident";

interface SeverityBadgeProps {
  severity: SeveridadeIncidente;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const getSeverityStyles = () => {
    switch (severity) {
      case "critico":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "alto":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "medio":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "baixo":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    }
  };

  const getSeverityLabel = () => {
    switch (severity) {
      case "critico":
        return "Crítico";
      case "alto":
        return "Alto";
      case "medio":
        return "Médio";
      case "baixo":
        return "Baixo";
    }
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-xs font-medium",
      getSeverityStyles(),
      className
    )}>
      {getSeverityLabel()}
    </span>
  );
}
