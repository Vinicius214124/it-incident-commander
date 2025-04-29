
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden">
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
          <Sidebar />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
