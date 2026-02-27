export interface AlunoDTO {
  nome: string;
  sobrenome: string;
  cpf: string;
  dataNascimento: Date;
  celular: string;
  senha: string;
  statusAluno: string;
  endereco?: string;
  email?: string;
}