# 🚀 Portal ELLP

O **Portal ELLP** é uma aplicação web desenvolvida para o gerenciamento e controle de voluntários vinculados ao projeto de extensão **Ensino Lúdico de Lógica de Programação (ELLP)** da UTFPR - Câmpus Cornélio Procópio. 

O sistema visa substituir processos manuais por uma solução digital, centralizando informações, promovendo eficiência administrativa e garantindo a rastreabilidade das atividades dos voluntários.

---

## ✨ Funcionalidades Principais

* **Gestão de Voluntários:** Cadastro, edição, inativação lógica e registro de datas de ingresso e desligamento.
* **Gestão de Oficinas:** Cadastro e detalhamento de oficinas realizadas pelo projeto.
* **Controle de Participação:** Associação de voluntários às oficinas em que atuaram.
* **Histórico e Relatórios:** Consulta do histórico completo de atividades do voluntário.
* **Emissão de Documentos:** Geração automática do Termo de Voluntariado em PDF.
* **Segurança:** Autenticação de usuários via JWT e controle de níveis de acesso (Administrador/Comum).

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
   * Frontend: *(Em breve)*

---

## 📁 Estrutura do Repositório

/
├── /backend          # Código-fonte da API (Node.js/Express)
├── /frontend         # Código-fonte da Interface (React)
├── docker-compose.yml # Orquestração dos serviços
└── README.md         # Documentação do projeto

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