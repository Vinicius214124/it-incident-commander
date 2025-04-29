
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SidebarNav } from "./SidebarNav";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { perfil } = useAuth();
  
  return (
    <div
      className={cn(
        "flex flex-col border-r bg-sidebar h-screen sticky top-0 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <span className="font-bold">
              {perfil?.setor === 'TI' ? 'Comandante TI' : 'Suporte'}
            </span>
          </div>
        )}
        {collapsed && (
          <ShieldAlert className="h-6 w-6 mx-auto text-primary" />
        )}
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <SidebarNav collapsed={collapsed} />
      </div>
      
      <div className="mt-auto border-t p-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
    </div>
  );
}

function ShieldAlert(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}
