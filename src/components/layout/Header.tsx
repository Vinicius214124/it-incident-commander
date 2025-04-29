
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      
      <div className="flex-1">
        <h1 className="text-xl font-semibold">IT Incident Commander</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <form className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search incidents..."
            className="w-64 pl-8"
          />
        </form>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              <span className="sr-only">Notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Notifications</h4>
                <Button variant="ghost" size="sm" className="text-xs">Mark all as read</Button>
              </div>
              <div className="space-y-2">
                <div className="bg-muted/50 p-2 rounded-md text-sm">
                  <p className="font-medium">New critical incident</p>
                  <p className="text-xs text-muted-foreground">TechSolutions Inc - Payment Gateway</p>
                  <p className="text-xs text-primary">5 minutes ago</p>
                </div>
                <div className="bg-muted/50 p-2 rounded-md text-sm">
                  <p className="font-medium">Incident status updated</p>
                  <p className="text-xs text-muted-foreground">HealthCare Services - Patient Records</p>
                  <p className="text-xs text-primary">35 minutes ago</p>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <ThemeToggle />
      </div>
    </header>
  );
}
