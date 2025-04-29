
export type SeveridadeIncidente = "critico" | "alto" | "medio" | "baixo";

export type StatusIncidente = "aberto" | "em-progresso" | "resolvido";

export type SetorIncidente = "TI" | "Suporte";

export interface Incidente {
  id: string;
  empresa: string;
  sistema: string;
  hora_inicio: Date;
  hora_fim?: Date;
  total_impactados: number;
  descricao: string;
  acoes_resolucao?: string;
  severidade: SeveridadeIncidente;
  status: StatusIncidente;
  setor: SetorIncidente;
  criado_por: string;
  criado_em: Date;
  atualizado_em: Date;
}

export interface PerfilUsuario {
  id: string;
  nome: string;
  sobrenome: string;
  setor: SetorIncidente;
  cargo: string;
  criado_em: Date;
  atualizado_em: Date;
}
