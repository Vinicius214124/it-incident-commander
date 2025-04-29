
import { cn } from "@/lib/utils";
import { StatusIncidente } from "@/types/incident";

interface StatusBadgeProps {
  status: StatusIncidente;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "aberto":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "em-progresso":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "resolvido":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "aberto":
        return "Aberto";
      case "em-progresso":
        return "Em Progresso";
      case "resolvido":
        return "Resolvido";
    }
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-xs font-medium",
      getStatusStyles(),
      className
    )}>
      {getStatusLabel()}
    </span>
  );
}
