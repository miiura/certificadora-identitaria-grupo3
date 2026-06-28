# 🚀 Portal ELLP

O **Portal ELLP** é uma aplicação web desenvolvida para o gerenciamento e controle de voluntários vinculados ao projeto de extensão **Ensino Lúdico de Lógica de Programação (ELLP)** da UTFPR - Câmpus Cornélio Procópio. 

O sistema visa substituir processos manuais por uma solução digital, centralizando informações, promovendo eficiência administrativa e garantindo maior agilidade e precisão no preenchimento de termos de voluntariado.

**Acesse o planejamento:** https://docs.google.com/document/d/1IHckKJ0OoK6IOzt1yJcXd-NgYad67nbC-sKFsRNeL1k/edit?usp=sharing <br>
**Acesse o protótipo:** https://www.figma.com/design/VGaBBQjMRWEabPjkqaNGZE/Untitled?node-id=0-1&t=SWGdFTGOA1hosOR8-1

---

## ✨ Funcionalidades Principais

### 👥 Gestão de Usuários e Controle de Acesso
* **Múltiplos Perfis:** Diferentes níveis de acesso (`VOLUNTARIO`, `COORDENADOR` e `ADMIN`).
* **Cadastros Dinâmicos:** Formulários inteligentes que se adaptam ao perfil (ex: dados acadêmicos exigidos apenas para voluntários; alocação de departamento exclusiva para coordenadores).
* **Autenticação Segura:** Senhas criptografadas (bcrypt) e controle de sessões.

### 🎯 Gestão de Ações e Projetos
* **Vínculo de Responsáveis:** Atribuição de usuários com perfil de coordenador como responsáveis pela ação.
* **Acompanhamento de Atividades:** Registro detalhado da síntese de atividades a serem desenvolvidas por cada voluntário.

### 📅 Cronogramas Dinâmicos
* **Matriz de Execução:** Interface interativa para o cruzamento visual entre atividades e meses nos quais a atividade será realizada.

### 📄 Geração e Exportação de Documentos
* **Preenchimento Automatizado:** Geração do "Termo de Adesão para Voluntário" mesclando automaticamente os dados do sistema (instituição, ação, coordenador e voluntário logado).
* **Exportação Flexível:** * Download em formato `.docx` para edições manuais e ajustes finos.
  * Download em formato `.pdf` imutável.

### ⚙️ Painel Administrativo (Dashboard)
* **Gestão Centralizada:** Tela dedicada para administradores e coordenadores visualizarem toda a base de usuários.
* **Filtros Avançados:** Busca combinada permitindo filtrar usuários por um ou múltiplos cargos simultaneamente.
* **Pré-visualização e Ações Rápidas:** Capacidade de revisar dados, editar cronogramas de voluntários e emitir termos diretamente pela listagem, sem precisar navegar por múltiplas telas.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando a arquitetura de monorepo e a stack **MERN**, visando alta performance e escalabilidade:

* **Frontend:** React.js (Componentização e reatividade)
* **Backend:** Node.js com Express (APIs RESTful orientadas a eventos)
* **Banco de Dados:** MongoDB (NoSQL, flexibilidade na modelagem de dados)
* **Infraestrutura e Deploy:** Docker e Docker Compose (Padronização de ambiente)
* **Prototipação:** Figma

---

## ⚙️ Como executar o projeto localmente

### Pré-requisitos
Para rodar a aplicação, você precisará ter instalado em sua máquina:
* [Git](https://git-scm.com)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (com WSL2 habilitado no Windows)

### Passo a passo

1. **Clone o repositório**
   `git clone https://github.com/miiura/certificadora-identitaria-grupo3.git`

2. **Acesse a pasta do projeto**
   `cd certificadora-identitaria-grupo3`

3. **Suba os contêineres do Docker**
   O projeto já está configurado para subir o Banco de Dados e o Backend automaticamente com o comando:
   `docker-compose up --build`

4. **Acesse a aplicação**
   * Backend (API): `http://localhost:3000`
   * Banco de Dados: Porta `27017`
   * Frontend: `http://localhost:5173`

---

## 📁 Estrutura do Repositório

/<br>
├── /backend          # Código-fonte da API (Node.js/Express)<br>
├── /frontend         # Código-fonte da Interface (React)<br>
├── docker-compose.yml # Orquestração dos serviços<br>
└── README.md         # Documentação do projeto<br>

---

## 👥 Equipe de Desenvolvimento (Grupo 3)

| Integrante | Função |
| :--- | :--- |
| **Fabrício Custódio da Silva** | Front-end |
| **Leda Alexandre Miura** | UX/UI, Banco de Dados, Comunicação |
| **Matheus José Rossieri** | Front-end |
| **Kevin Luiz Botelho Lima** | Back-end |
| **Lucas C. B. C. Genvigir** | UX/UI, Banco de Dados |
| **Alexis Liasch Tavares** | Back-end |

---
*Projeto desenvolvido como requisito acadêmico (2026).*
