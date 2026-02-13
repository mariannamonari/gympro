import type { AlunoDTO } from "../interface/AlunoDTO.js";
import DataBaseModel from "./DatabaseModel.js";

const database = new DataBaseModel().pool;

class Aluno {
  private idAluno: number = 0;
  private nome: string;
  private sobrenome: string;
  private cpf: string;
  private dataNascimento?: Date;
  private celular: string;
  private email: string;
  private endereco?: string;
  private senha: string;
  private statusAluno: string;

  constructor(
    _nome: string,
    _sobrenome: string,
    _cpf: string,
    _dataNascimento: Date | undefined,
    _celular: string,
    _email: string,
    _endereco: string | undefined,
    _senha: string,
    _statusAluno: string
  ) {
    this.nome = _nome;
    this.sobrenome = _sobrenome;
    this.cpf = _cpf;
    this.dataNascimento = _dataNascimento;
    this.celular = _celular;
    this.email = _email;
    this.endereco = _endereco;
    this.senha = _senha;
    this.statusAluno = _statusAluno;
  }

  public getIdAluno(): number {
    return this.idAluno;
  }
  public setIdAluno(idAluno: number): void {
    this.idAluno = idAluno;
  }

  public getNome(): string {
    return this.nome;
  }
  public setNome(nome: string): void {
    this.nome = nome;
  }

  public getSobrenome(): string {
    return this.sobrenome;
  }
  public setSobrenome(sobrenome: string): void {
    this.sobrenome = sobrenome;
  }

  public getCpf(): string {
    return this.cpf;
  }
  public setCpf(cpf: string): void {
    this.cpf = cpf;
  }

  public getDataNascimento(): Date | undefined {
    return this.dataNascimento;
  }
  public setDataNascimento(dataNascimento: Date | undefined): void {
    this.dataNascimento = dataNascimento;
  }

  public getCelular(): string {
    return this.celular;
  }
  public setCelular(celular: string): void {
    this.celular = celular;
  }

  public getEmail(): string {
    return this.email;
  }
  public setEmail(email: string): void {
    this.email = email;
  }

  public getEndereco(): string | undefined {
    return this.endereco;
  }
  public setEndereco(endereco: string | undefined): void {
    this.endereco = endereco;
  }

  public getSenha(): string {
    return this.senha;
  }
  public setSenha(senha: string): void {
    this.senha = senha;
  }

  public getStatusAluno(): string {
    return this.statusAluno;
  }
  public setStatusAluno(statusAluno: string): void {
    this.statusAluno = statusAluno;
  }

  // ============================
  // LISTAR TODOS (ordenado)
  // ============================
  static async listarAlunos(): Promise<Array<Aluno> | null> {
    try {
      const lista: Array<Aluno> = [];

      const query = `SELECT * FROM Aluno ORDER BY nome ASC;`;
      const respostaBD = await database.query(query);

      respostaBD.rows.forEach((alunoBD: any) => {
        const novoAluno = new Aluno(
          alunoBD.nome,
          alunoBD.sobrenome,
          alunoBD.cpf,
          alunoBD.data_nascimento,
          alunoBD.celular,
          alunoBD.email,
          alunoBD.endereco,
          alunoBD.senha,
          alunoBD.status_aluno
        );

        // ⚠️ no teu SQL é id_aluno
        novoAluno.setIdAluno(alunoBD.id_aluno);

        lista.push(novoAluno);
      });

      return lista;
    } catch (error) {
      console.error(`Erro ao listar alunos. ${error}`);
      return null;
    }
  }

  // ============================
  // CADASTRAR
  // ============================
  static async cadastrarAluno(aluno: AlunoDTO): Promise<boolean> {
    try {
      const query = `
        INSERT INTO Aluno (nome, sobrenome, cpf, data_nascimento, endereco, email, celular, senha, status_aluno)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, 'ATIVO'))
        RETURNING id_aluno;
      `;

      const respostaBD = await database.query(query, [
        aluno.nome.toUpperCase(),
        aluno.sobrenome.toUpperCase(),
        aluno.cpf,
        aluno.dataNascimento ?? null,
        aluno.endereco ?? null,
        aluno.email,
        aluno.celular,
        aluno.senha,
        aluno.statusAluno ?? "ATIVO",
      ]);

      if (respostaBD.rows.length > 0) {
        console.info(`Aluno cadastrado com sucesso. ID: ${respostaBD.rows[0].id_aluno}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Erro ao cadastrar aluno. ${error}`);
      return false;
    }
  }

  // ============================
  // LISTAR 1 POR ID
  // ============================
  static async listarAluno(idAluno: number): Promise<Aluno | null> {
    try {
      const query = `SELECT * FROM Aluno WHERE id_aluno=$1;`;
      const respostaBD = await database.query(query, [idAluno]);

      if (respostaBD.rowCount && respostaBD.rowCount > 0) {
        const alunoBD = respostaBD.rows[0];

        const aluno = new Aluno(
          alunoBD.nome,
          alunoBD.sobrenome,
          alunoBD.cpf,
          alunoBD.data_nascimento,
          alunoBD.celular,
          alunoBD.email,
          alunoBD.endereco,
          alunoBD.senha,
          alunoBD.status_aluno
        );

        aluno.setIdAluno(alunoBD.id_aluno);
        return aluno;
      }

      return null;
    } catch (error) {
      console.error(`Erro ao buscar aluno no banco. ${error}`);
      return null;
    }
  }
}

export default Aluno;
