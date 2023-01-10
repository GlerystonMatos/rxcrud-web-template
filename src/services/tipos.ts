import { RouteComponentProps } from 'react-router';

/* Entidades */

export interface ApiError {
    title: string;
    errors: string[];
    Mensagem: string;
}

export interface FormExclusao {
}

export interface FormLogin {
    senha: string;
    usuario: string;
}

export interface Permissoes {
    id: string;
    nome: string;
    grupo: string;
    ordem: string;
    chave: string;
}

export interface PerfilUsuario {
    id: string;
    idPerfil: string;
    idUsuario: string;
}

export interface PerfilPermissao {
    id?: string;
    idPerfil: string;
    idPermissao: string;
}

export interface Usuario {
    id: string;
    nome: string;
    email: string;
    senha: string;
    nomeAcesso: string;
}

export interface Estado {
    id: string;
    uf: string;
    descricao: string;
}

export interface Perfil {
    id: string;
    nome: string;
}

/* Navegação */

interface Listagem {
    pagina: string;
}

interface Exclusao {
    id: string;
}

interface Cadastro {
    id: string;
    action: '' | 'view';
}

interface Acesso {
    acao: '' | 'acessobloqueado';
}

export interface ListagemProps extends RouteComponentProps<Listagem> {
}

export interface ExclusaoProps extends RouteComponentProps<Exclusao> {
}

export interface CadastroProps extends RouteComponentProps<Cadastro> {
}

export interface AcessoProps extends RouteComponentProps<Acesso> {
}