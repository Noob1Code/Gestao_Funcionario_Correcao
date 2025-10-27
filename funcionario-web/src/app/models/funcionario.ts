export interface Funcionario {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  salario: number;
  dataAdmissao: string; // ISO yyyy-MM-dd
  ativo: boolean;
}
