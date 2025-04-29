
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import {
  Bell,
  Calendar,
  FileText,
  Home,
  Settings,
  ShieldAlert,
  Users,
  LineChart
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
}

export function SidebarNav({ collapsed, className, ...props }: SidebarNavProps) {
  const { perfil } = useAuth();
  const isTI = perfil?.setor === 'TI';
  
  // Número de incidentes ativos - em uma aplicação real, isso viria da API
  const activeIncidents = 3;

  return (
    <nav className={cn("flex flex-col gap-2", className)} {...props}>
      <NavItem to="/dashboard" icon={Home} collapsed={collapsed}>
        Dashboard
      </NavItem>
      
      <NavItem 
        to="/incidentes" 
        icon={Bell} 
        badge={activeIncidents > 0} 
        badgeContent={activeIncidents} 
        collapsed={collapsed}
      >
        Incidentes
      </NavItem>
      
      {/* Área TI - acessível apenas para usuários de TI */}
      {isTI && (
        <>
          <NavItem to="/usuarios" icon={Users} collapsed={collapsed}>
            Usuários
          </NavItem>
          
          <NavItem to="/estatisticas" icon={LineChart} collapsed={collapsed}>
            Estatísticas
          </NavItem>
        </>
      )}
      
      <NavItem to="/calendario" icon={Calendar} collapsed={collapsed}>
        Calendário
      </NavItem>
      
      <NavItem to="/relatorios" icon={FileText} collapsed={collapsed}>
        Relatórios
      </NavItem>
      
      <div className="h-px bg-sidebar-border my-2" />
      
      <NavItem to="/configuracoes" icon={Settings} collapsed={collapsed}>
        Configurações
      </NavItem>
    </nav>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  collapsed?: boolean;
  badge?: boolean;
  badgeContent?: number;
}

function NavItem({ to, icon: Icon, children, collapsed, badge, badgeContent }: NavItemProps) {
  return (
    <NavLink to={to} className={({ isActive }) => cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
      isActive 
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
    )}>
      <div className="relative">
        <Icon size={20} />
        {badge && badgeContent && !collapsed && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold">
            {badgeContent}
          </span>
        )}
        {badge && badgeContent && collapsed && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </div>
      {!collapsed && <span>{children}</span>}
    </NavLink>
  );
}
