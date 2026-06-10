/* ═══════════════════════════════════════════════════════════════
   Dados provisórios enquanto o backend (MongoDB) não está integrado.

   QUANDO O BACKEND ESTIVER PRONTO:
   - Remover esse arquivo
   - Substituir os imports de mockData por chamadas à API (fetch/axios)
   - Os componentes que usam esses dados não precisam mudar
═══════════════════════════════════════════════════════════════ */

export const MOCK_USERS = [
  {
    id: 1,
    role: "admin",
    name: "Fabrício Custódio da Silva",
    email: "fabricio@utfpr.edu.br",
    password: "admin123",
    cpf: "999.999.999-99",
    dept: "DEPARTAMENTO-CP",
    phone: "(43) 99999-9999",
    avatar: "FC",
  },
  {
    id: 2,
    role: "volunteer",
    name: "Matheus José Rossieri",
    email: "matheus@utfpr.edu.br",
    password: "vol123",
    cpf: "123.***.***-89",
    course: "Engenharia de Software",
    period: "6º Período",
    ra: "2123456",
    address: "Rua Aleatória, 123",
    city: "Cornélio Procópio",
    state: "Paraná",
    phone: "(43) 00000-0000",
    birthdate: "01/01/2000",
    nationality: "Brasileira",
    status: "active",
    complete: true,
    avatar: "MJ",
  },
  {
    id: 3,
    role: "volunteer",
    name: "Voluntário ELLP",
    email: "voluntario@utfpr.edu.br",
    password: "vol456",
    cpf: "",
    course: "",
    period: "",
    ra: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    birthdate: "",
    nationality: "",
    status: "active",
    complete: false,
    avatar: "VE",
  },
];

export const MOCK_VOLUNTEERS = [
  { id: 2, name: "Leda Miura",            cpf: "123.456.789-00", course: "Análise e Desenvolvimento de Sistemas", bond: "DISCENTE", status: "active"   },
  { id: 3, name: "Kevin",                 cpf: "234.567.890-11", course: "Engenharia de Software",                bond: "DISCENTE", status: "active"   },
  { id: 4, name: "Lucas Gengivir",        cpf: "345.678.901-22", course: "Análise e Desenvolvimento de Sistemas", bond: "DISCENTE", status: "inactive" },
  { id: 5, name: "Alexis Liasch Tavares", cpf: "456.789.012-33", course: "Análise e Desenvolvimento de Sistemas", bond: "EGRESSO",  status: "active"   },
];

export const MOCK_PROJECT = {
  title:      "ELLP",
  modality:   "Projeto",
  startMonth: "Janeiro",
  startYear:  "2026",
  endMonth:   "Dezembro",
  endYear:    "2026",
  status:     "Ativo",
};

export const ACTIVITIES_EXAMPLE = [
  "Apoio pedagógico em oficinas de lógica para crianças do ensino fundamental",
  "Desenvolvimento de materiais didáticos utilizando Scratch e Python",
  "Auxílio na organização de eventos de robótica educacional",
  "Monitoria presencial e suporte técnico em laboratórios de informática",
  "",
];

/* ── Constantes de formulários ── */
export const MONTHS  = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
export const YEARS   = ["2026","2027","2028","2029"];
export const PERIODS = ["1º Período","2º Período","3º Período","4º Período","5º Período","6º Período","7º Período","8º Período","9º Período","10º Período"];
export const COURSES = ["Ciência da Computação","Engenharia de Software","Sistemas de Informação","Tecnologia em ADS","Engenharia de Computação","Matemática","Física","Letras","Outro"];

/* ── Utilitários de ID (enquanto sem banco) ── */
let _nextId = 20;
export const uid = () => ++_nextId;
