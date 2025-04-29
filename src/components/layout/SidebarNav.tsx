
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import {
  Bell,
  Calendar,
  FileText,
  Home,
  Settings,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "../ui/severity-badge";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
}

export function SidebarNav({ collapsed, className, ...props }: SidebarNavProps) {
  const activeIncidents = 3; // This would come from a context/state in real app

  return (
    <nav className={cn("flex flex-col gap-2", className)} {...props}>
      <NavItem to="/" icon={Home} collapsed={collapsed}>
        Dashboard
      </NavItem>
      
      <NavItem 
        to="/incidents" 
        icon={Bell} 
        badge={activeIncidents > 0} 
        badgeContent={activeIncidents} 
        collapsed={collapsed}
      >
        Incidents
      </NavItem>
      
      <NavItem to="/calendar" icon={Calendar} collapsed={collapsed}>
        Calendar
      </NavItem>
      
      <NavItem to="/reports" icon={FileText} collapsed={collapsed}>
        Reports
      </NavItem>
      
      <div className="h-px bg-sidebar-border my-2" />
      
      <NavItem to="/settings" icon={Settings} collapsed={collapsed}>
        Settings
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
