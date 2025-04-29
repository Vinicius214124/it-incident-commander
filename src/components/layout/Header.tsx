
import { Bell, Menu, Search, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { user, perfil, signOut } = useAuth();
  
  const getInitials = () => {
    if (!perfil) return "??";
    return `${perfil.nome.charAt(0)}${perfil.sobrenome.charAt(0)}`.toUpperCase();
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Alternar menu lateral</span>
      </Button>
      
      <div className="flex-1">
        <h1 className="text-xl font-semibold">Comandante de Incidentes de TI</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <form className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar incidentes..."
            className="w-64 pl-8"
          />
        </form>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              <span className="sr-only">Notificações</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Notificações</h4>
                <Button variant="ghost" size="sm" className="text-xs">Marcar como lido</Button>
              </div>
              <div className="space-y-2">
                <div className="bg-muted/50 p-2 rounded-md text-sm">
                  <p className="font-medium">Novo incidente crítico</p>
                  <p className="text-xs text-muted-foreground">TechSolutions Inc - Gateway de Pagamento</p>
                  <p className="text-xs text-primary">5 minutos atrás</p>
                </div>
                <div className="bg-muted/50 p-2 rounded-md text-sm">
                  <p className="font-medium">Status do incidente atualizado</p>
                  <p className="text-xs text-muted-foreground">Serviços de Saúde - Registros de Pacientes</p>
                  <p className="text-xs text-primary">35 minutos atrás</p>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {perfil && (
                  <>
                    <p className="font-medium">{`${perfil.nome} ${perfil.sobrenome}`}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                    <p className="text-xs font-medium text-primary">
                      {perfil.setor} - {perfil.cargo}
                    </p>
                  </>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
