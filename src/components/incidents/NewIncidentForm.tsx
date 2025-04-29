
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SeveridadeIncidente, SetorIncidente } from "@/types/incident";

export function NewIncidentForm() {
  const { toast } = useToast();
  const { user, perfil } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [empresa, setEmpresa] = useState("");
  const [sistema, setSistema] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [severidade, setSeveridade] = useState<SeveridadeIncidente | "">("");
  const [totalImpactados, setTotalImpactados] = useState("");
  const [descricao, setDescricao] = useState("");
  const [acoesResolucao, setAcoesResolucao] = useState("");
  const [setor, setSetor] = useState<SetorIncidente | "">(perfil?.setor || "");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um incidente.",
        variant: "destructive"
      });
      return;
    }

    if (severidade === "" || setor === "") {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('incidentes')
        .insert({
          empresa,
          sistema,
          hora_inicio: horaInicio,
          hora_fim: horaFim || null,
          total_impactados: parseInt(totalImpactados, 10) || 0,
          descricao,
          acoes_resolucao: acoesResolucao || null,
          severidade,
          status: "aberto",
          setor,
          criado_por: user.id
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Incidente Criado",
        description: "O incidente foi registrado com sucesso.",
      });
      
      navigate("/incidentes");
    } catch (error: any) {
      console.error("Erro ao criar incidente:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o incidente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Incidente</CardTitle>
          <CardDescription>
            Registre um novo incidente em um sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input 
                id="empresa" 
                placeholder="Empresa afetada" 
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sistema">Sistema</Label>
              <Input 
                id="sistema" 
                placeholder="Sistema afetado" 
                value={sistema}
                onChange={(e) => setSistema(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horaInicio">Hora de Início</Label>
              <Input 
                id="horaInicio" 
                type="datetime-local" 
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horaFim">Hora de Término (Opcional)</Label>
              <Input 
                id="horaFim" 
                type="datetime-local" 
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severidade">Severidade</Label>
              <Select 
                value={severidade} 
                onValueChange={(value) => setSeveridade(value as SeveridadeIncidente)}
              >
                <SelectTrigger id="severidade">
                  <SelectValue placeholder="Selecione a severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critico">Crítico</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="medio">Médio</SelectItem>
                  <SelectItem value="baixo">Baixo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalImpactados">Usuários Impactados</Label>
              <Input 
                id="totalImpactados" 
                type="number" 
                min="0" 
                placeholder="Número de usuários afetados" 
                value={totalImpactados}
                onChange={(e) => setTotalImpactados(e.target.value)}
                required 
              />
            </div>
          </div>

          {perfil?.setor === 'TI' && (
            <div className="space-y-2">
              <Label htmlFor="setor">Setor Responsável</Label>
              <Select 
                value={setor} 
                onValueChange={(value) => setSetor(value as SetorIncidente)}
              >
                <SelectTrigger id="setor">
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TI">TI</SelectItem>
                  <SelectItem value="Suporte">Suporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea 
              id="descricao" 
              placeholder="Descrição detalhada do incidente..." 
              className="min-h-[100px]"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="acoesResolucao">Ações de Resolução (Opcional)</Label>
            <Textarea 
              id="acoesResolucao" 
              placeholder="Passos tomados para resolver o incidente..." 
              className="min-h-[100px]"
              value={acoesResolucao}
              onChange={(e) => setAcoesResolucao(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => navigate("/incidentes")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar Incidente"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
