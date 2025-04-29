
import { useState } from "react";
import { IncidentTable } from "@/components/incidents/IncidentTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { Incidente, SeveridadeIncidente, StatusIncidente } from "@/types/incident";
import { StatusBadge } from "@/components/incidents/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function IncidentsList() {
  const navigate = useNavigate();
  const { perfil } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const { data: incidentes = [], isLoading } = useQuery({
    queryKey: ['incidentes', filterSeverity, filterStatus],
    queryFn: async () => {
      let query = supabase.from('incidentes').select('*');
      
      // Aplicar filtros
      if (filterSeverity !== 'all') {
        query = query.eq('severidade', filterSeverity);
      }
      
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }
      
      // Se for usuário de suporte, filtrar apenas os incidentes de suporte
      if (perfil?.setor === 'Suporte') {
        query = query.eq('setor', 'Suporte');
      }
      
      const { data, error } = await query.order('criado_em', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data.map(inc => ({
        ...inc,
        hora_inicio: new Date(inc.hora_inicio),
        hora_fim: inc.hora_fim ? new Date(inc.hora_fim) : undefined,
        criado_em: new Date(inc.criado_em),
        atualizado_em: new Date(inc.atualizado_em)
      })) as Incidente[];
    },
    enabled: !!perfil
  });
  
  const filteredIncidentes = incidentes.filter(incident => {
    const matchesSearch = 
      incident.empresa.toLowerCase().includes(searchTerm.toLowerCase()) || 
      incident.sistema.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesSearch;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Incidentes</h1>
          <p className="text-muted-foreground">Visualize e gerencie todos os incidentes de TI.</p>
        </div>
        <Button onClick={() => navigate("/incidentes/novo")}>
          Criar Incidente
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:flex-1">
          <Input 
            placeholder="Buscar incidentes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por severidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Severidades</SelectItem>
              <SelectItem value="critico">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity="critico" />
                  <span>Crítico</span>
                </div>
              </SelectItem>
              <SelectItem value="alto">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity="alto" />
                  <span>Alto</span>
                </div>
              </SelectItem>
              <SelectItem value="medio">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity="medio" />
                  <span>Médio</span>
                </div>
              </SelectItem>
              <SelectItem value="baixo">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity="baixo" />
                  <span>Baixo</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="aberto">
                <div className="flex items-center gap-2">
                  <StatusBadge status="aberto" />
                  <span>Aberto</span>
                </div>
              </SelectItem>
              <SelectItem value="em-progresso">
                <div className="flex items-center gap-2">
                  <StatusBadge status="em-progresso" />
                  <span>Em Progresso</span>
                </div>
              </SelectItem>
              <SelectItem value="resolvido">
                <div className="flex items-center gap-2">
                  <StatusBadge status="resolvido" />
                  <span>Resolvido</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <IncidentTable incidents={filteredIncidentes} />
      )}
    </div>
  );
}
