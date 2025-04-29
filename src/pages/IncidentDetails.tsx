
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { StatusBadge } from "@/components/incidents/StatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarPlus, ChevronLeft, FileText, MessageSquare, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Incidente } from "@/types/incident";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusIncidente } from "@/types/incident";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function IncidentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { data: incident, isLoading, refetch } = useQuery({
    queryKey: ['incident', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('incidentes')
        .select('*, perfis:perfis(*)')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) return null;
      
      return {
        ...data,
        hora_inicio: new Date(data.hora_inicio),
        hora_fim: data.hora_fim ? new Date(data.hora_fim) : undefined,
        criado_em: new Date(data.criado_em),
        atualizado_em: new Date(data.atualizado_em)
      } as Incidente & { perfis: any };
    },
    enabled: !!id
  });

  const updateIncidentStatus = async (newStatus: StatusIncidente) => {
    if (!incident || !user) return;
    
    setIsUpdating(true);
    try {
      // Se o status for resolvido e não houver hora de fim, definir a hora atual
      const updatedData: any = { 
        status: newStatus 
      };
      
      if (newStatus === 'resolvido' && !incident.hora_fim) {
        updatedData.hora_fim = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('incidentes')
        .update(updatedData)
        .eq('id', incident.id);
      
      if (error) throw error;
      
      toast({
        title: "Status atualizado",
        description: `O incidente foi atualizado para ${
          newStatus === 'aberto' ? 'Aberto' : 
          newStatus === 'em-progresso' ? 'Em Progresso' : 'Resolvido'
        }`
      });
      
      refetch();
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o status",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!incident) {
    return (
      <div className="text-center p-12">
        <h1 className="text-2xl font-bold mb-4">Incidente não encontrado</h1>
        <p className="mb-6">O incidente que você está procurando não existe ou foi removido.</p>
        <Button onClick={() => navigate("/incidentes")}>
          Voltar para Incidentes
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/incidentes")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Detalhes do Incidente</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Adicionar Comentário
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarPlus className="h-4 w-4" />
            Agendar Atualização
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div>
                  <div>{incident.empresa}</div>
                  <div className="text-sm text-muted-foreground">{incident.sistema}</div>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <SeverityBadge severity={incident.severidade} />
                  <StatusBadge status={incident.status} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Descrição</h3>
                  <p className="text-sm">{incident.descricao}</p>
                </div>
                
                {incident.acoes_resolucao && (
                  <div>
                    <h3 className="font-medium mb-1">Ações de Resolução</h3>
                    <p className="text-sm">{incident.acoes_resolucao}</p>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{incident.total_impactados.toLocaleString()} usuários impactados</span>
                </div>
              </div>

              {incident.status !== 'resolvido' && (
                <div className="border-t pt-4 mt-6">
                  <h3 className="font-medium mb-3">Atualizar Status</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Select
                        defaultValue={incident.status}
                        onValueChange={(value) => updateIncidentStatus(value as StatusIncidente)}
                        disabled={isUpdating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aberto">Aberto</SelectItem>
                          <SelectItem value="em-progresso">Em Progresso</SelectItem>
                          <SelectItem value="resolvido">Resolvido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      variant={incident.status === 'resolvido' ? "outline" : "default"}
                      onClick={() => updateIncidentStatus('resolvido')}
                      disabled={incident.status === 'resolvido' || isUpdating}
                      className="sm:w-auto w-full"
                    >
                      {isUpdating ? "Atualizando..." : "Marcar como Resolvido"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Linha do Tempo</CardTitle>
              <CardDescription>Histórico de atualizações e alterações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Incidente reportado</p>
                      <p className="text-xs text-muted-foreground">
                        {format(incident.criado_em, "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <p className="text-sm">
                      {incident.perfis?.nome || "Usuário"} criou este incidente com severidade <SeverityBadge severity={incident.severidade} />.
                    </p>
                  </div>
                </div>
                
                {incident.status === "em-progresso" && (
                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Status atualizado</p>
                        <p className="text-xs text-muted-foreground">
                          {format(incident.atualizado_em, "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <p className="text-sm">
                        Status alterado de <StatusBadge status="aberto" /> para <StatusBadge status="em-progresso" />.
                      </p>
                    </div>
                  </div>
                )}
                
                {incident.status === "resolvido" && (
                  <>
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Status atualizado</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(incident.hora_inicio.getTime() + 1800000), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        <p className="text-sm">
                          Status alterado de <StatusBadge status="aberto" /> para <StatusBadge status="em-progresso" />.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Incidente resolvido</p>
                          <p className="text-xs text-muted-foreground">
                            {format(incident.atualizado_em, "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        <p className="text-sm">
                          Status alterado de <StatusBadge status="em-progresso" /> para <StatusBadge status="resolvido" />.
                          Tempo de resolução: {format(incident.hora_inicio, "HH:mm", { locale: ptBR })} - {format(incident.hora_fim || new Date(), "HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Detalhes do Incidente</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-muted-foreground">ID</div>
                  <div className="col-span-2 font-mono">{incident.id}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-muted-foreground">Criado por</div>
                  <div className="col-span-2">{incident.perfis?.nome} {incident.perfis?.sobrenome || ''}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-muted-foreground">Criado em</div>
                  <div className="col-span-2">{format(incident.criado_em, "d 'de' MMMM 'de' yyyy HH:mm", { locale: ptBR })}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-muted-foreground">Setor</div>
                  <div className="col-span-2">{incident.setor}</div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-muted-foreground">Início</div>
                  <div className="col-span-2">{format(incident.hora_inicio, "d 'de' MMMM 'de' yyyy HH:mm", { locale: ptBR })}</div>
                </div>
                
                {incident.hora_fim && (
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-muted-foreground">Término</div>
                    <div className="col-span-2">{format(incident.hora_fim, "d 'de' MMMM 'de' yyyy HH:mm", { locale: ptBR })}</div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-muted-foreground">Duração</div>
                  <div className="col-span-2">
                    {incident.hora_fim ? 
                      formatDuration(incident.hora_inicio, incident.hora_fim) : 
                      "Em andamento"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sistemas Relacionados</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-2">
                <div className="p-2 bg-muted rounded-md">
                  <div className="font-medium">{incident.sistema}</div>
                  <div className="text-xs text-muted-foreground">Sistema principal afetado</div>
                </div>
                
                {incident.severidade === "critico" && (
                  <div className="p-2 bg-muted rounded-md">
                    <div className="font-medium">Serviço de Autenticação</div>
                    <div className="text-xs text-muted-foreground">Sistema secundário afetado</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function formatDuration(start: Date, end: Date): string {
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  } else if (minutes === 0) {
    return `${hours} hora${hours !== 1 ? 's' : ''}`;
  } else {
    return `${hours} hora${hours !== 1 ? 's' : ''} e ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  }
}
