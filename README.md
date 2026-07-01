# 🚀 Portal ELLP

O **Portal ELLP** é uma aplicação web desenvolvida para o gerenciamento e controle de voluntários vinculados ao projeto de extensão **Ensino Lúdico de Lógica de Programação (ELLP)** da UTFPR - Câmpus Cornélio Procópio. 

O sistema visa substituir processos manuais por uma solução digital, centralizando informações, promovendo eficiência administrativa e garantindo maior agilidade e precisão no preenchimento de termos de voluntariado.

* **Acesse o planejamento:** <https://docs.google.com/document/d/1IHckKJ0OoK6IOzt1yJcXd-NgYad67nbC-sKFsRNeL1k/edit?usp=sharing>
* **Acesse o cronogama:** <https://trello.com/invite/b/69fa9396393aff2348eaff53/ATTIe0af17447e7e3fef227e0b09e526c9719A31AAA4/certificadora-de-competenciasidjsgdgf>
* **Acesse o protótipo:** <https://www.figma.com/design/VGaBBQjMRWEabPjkqaNGZE/Untitled?node-id=0-1&t=SWGdFTGOA1hosOR8-1>

---

## 📄 **MANUAL DO USUÁRIO**
* **Acesse-o neste link:** <https://canva.link/4ux61kvu97hbd1w>

---

## ✨ Funcionalidades Principais

### 👥 Gestão de Usuários e Controle de Acesso
* **Múltiplos Perfis:** Diferentes níveis de acesso (`VOLUNTARIO`, `COORDENADOR` e `ADMIN`).
* **Cadastros Dinâmicos:** Formulários inteligentes que se adaptam ao perfil (ex: dados acadêmicos exigidos apenas para voluntários; alocação de departamento exclusiva para coordenadores).
* **Autenticação Segura:** Senhas criptografadas (bcrypt) e controle de sessões.

### 🎯 Gestão de Ações e Projetos
* **Vínculo de Responsáveis:** Atribuição de usuários com perfil de coordenador como responsáveis pela ação.
* **Acompanhamento de Atividades:** Registro detalhado da síntese de atividades a serem desenvolvidas por cada voluntário.

### 📄 Geração e Exportação de Documentos
* **Preenchimento Automatizado:** Geração do "Termo de Adesão para Voluntário" mesclando automaticamente os dados do sistema (instituição, ação, coordenador e voluntário logado).
* **Exportação Flexível:** * Download em formato `.docx` para edições manuais e ajustes finos.
  * Download em formato `.pdf` imutável.

### ⚙️ Painel Administrativo (Dashboard)
* **Gestão Centralizada:** Tela dedicada para administradores e coordenadores visualizarem toda a base de usuários.
* **Filtros Avançados:** Busca combinada permitindo filtrar usuários por um ou múltiplos cargos simultaneamente.
* **Pré-visualização e Ações Rápidas:** Capacidade de revisar dados, editar cronogramas de voluntários e emitir termos diretamente pela listagem, sem precisar navegar por múltiplas telas.

---

## ⚙️ Como executar o projeto localmente

### Pré-requisitos
Para rodar a aplicação, você precisará ter instalado em sua máquina:
* [Git](https://git-scm.com)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (com WSL2 habilitado no Windows)

### Passo a passo

1. **Clone o repositório na linha de comando (cmd, terminal, etc)**
   `git clone https://github.com/miiura/certificadora-identitaria-grupo3.git`

2. **Acesse a pasta do projeto**
   `cd certificadora-identitaria-grupo3`

3. **Suba os contêineres do Docker**
   O projeto já está configurado para subir o Banco de Dados e o Backend automaticamente com o comando:
   `docker-compose up --build`

4. **Acesse a aplicação através destes endereços**
   * Backend (API): `http://localhost:3000`
   * Banco de Dados: Porta `27017`
   * Frontend: `http://localhost:5173`
  
5. **Login de usuários -- Use-os para testar o sistema:**
   * Voluntário: `voluntario@ellp.com` -- `senha123`
   * Coordenador: `coordenador@ellp.com` -- `senha123` 
   * Admin: `admin@ellp.com` -- `admin`
   
  
---

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando a arquitetura de monorepo e a stack **MERN**, visando alta performance e escalabilidade:

* **Frontend:** React.js (Componentização e reatividade) - (v.^19.2.5, <https://pt-br.react.dev/versions>)
* **Backend:** Node.js com Express (APIs RESTful orientadas a eventos) - (node 18, 20, 22 ou superior, express v.^4.21.1, <https://nodejs.org/pt-br/download>, <https://expressjs.com/en/5x/starter/installing/>)
* **Banco de Dados:** MongoDB (NoSQL, flexibilidade na modelagem de dados) - (v.^9.6.1, <https://www.mongodb.com/pt-br/docs/manual/installation/>)
* **Geração de Documento:** Docxtemplater (v.3.69.0 - <https://www.npmjs.com/package/docxtemplater>) e LibreOffice (v.26.2.4 - <https://pt-br.libreoffice.org/baixar/>)
* **Infraestrutura e Deploy:** Docker e Docker Compose (Padronização de ambiente) - (v.4.80.0, imagem: node 20-alpine, suporta docker engine 20.10 ou superior, <https://www.docker.com/products/docker-desktop/>)
* **IDE/Ferramenta de codificação:** Visual Studio Code - (v.1.126.0/latest - <https://code.visualstudio.com/>)
* **Prototipação:** Figma - (<https://www.figma.com>)
* **Documentação/Planejamento:** Google Docs - (<https://docs.google.com>)
* **Cronograma/Organizador de Sprints:** Trello - (<https://trello.com>)

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
