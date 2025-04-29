
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/dashboard/StatCard";
import { Bell, Clock, ShieldAlert, Users } from "lucide-react";
import { IncidentCard } from "@/components/incidents/IncidentCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Incidente } from "@/types/incident";

export default function Dashboard() {
  const navigate = useNavigate();
  const { perfil } = useAuth();
  
  const { data: incidentes = [], isLoading } = useQuery({
    queryKey: ['incidentes-recentes'],
    queryFn: async () => {
      const query = supabase
        .from('incidentes')
        .select('*')
        .order('criado_em', { ascending: false })
        .limit(3);
      
      // Se o usuário for do setor de Suporte, filtrar apenas os incidentes de suporte
      if (perfil?.setor === 'Suporte') {
        query.eq('setor', 'Suporte');
      }
      
      const { data, error } = await query;
      
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

  // Estatísticas
  const { data: estatisticas } = useQuery({
    queryKey: ['estatisticas-incidentes'],
    queryFn: async () => {
      // Em uma aplicação real, estes dados viriam da API
      const queryBuilder = supabase.from('incidentes').select('id, status, severidade, total_impactados');
      
      if (perfil?.setor === 'Suporte') {
        queryBuilder.eq('setor', 'Suporte');
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) {
        throw error;
      }
      
      const ativos = data.filter(inc => inc.status !== 'resolvido').length;
      const criticos = data.filter(inc => inc.severidade === 'critico').length;
      const totalImpactados = data.reduce((acc, inc) => acc + inc.total_impactados, 0);
      
      return { ativos, criticos, totalImpactados };
    },
    enabled: !!perfil
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {perfil?.setor === 'TI' 
              ? 'Monitore e gerencie incidentes de TI em toda a organização.'
              : 'Gerencie os incidentes de suporte da sua área.'}
          </p>
        </div>
        <Button onClick={() => navigate("/incidentes/novo")}>
          Criar Incidente
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Incidentes Ativos"
          value={estatisticas?.ativos || 0}
          icon={<Bell className="h-4 w-4 text-muted-foreground" />}
          description="Requerem atenção"
        />
        <StatCard
          title="Incidentes Críticos"
          value={estatisticas?.criticos || 0}
          icon={<ShieldAlert className="h-4 w-4 text-severity-critical" />}
          description="Alta prioridade"
        />
        <StatCard
          title="Usuários Impactados"
          value={(estatisticas?.totalImpactados || 0).toLocaleString()}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Em todos os sistemas"
        />
        <StatCard
          title="Tempo Médio Resolução"
          value="3h 24m"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          description="Últimos 7 dias"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Incidentes Recentes</h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/incidentes")}>
            Ver Todos
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : incidentes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {incidentes.map(incident => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground mb-4">Nenhum incidente encontrado.</p>
            <Button onClick={() => navigate("/incidentes/novo")}>
              Criar seu primeiro incidente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
