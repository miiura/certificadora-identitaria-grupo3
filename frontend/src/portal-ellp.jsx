import { useState } from "react";
import "./portal-ellp.css";
import logoEllp from './assets/mascote-ellp.png';

/* ═══════════════════════════════════════════
   DADOS INICIAIS
═══════════════════════════════════════════ */
const MOCK_USERS = [
  { id: 1, role: "admin",     name: "Fabrício Custódio da Silva",  email: "fabricio@utfpr.edu.br", password: "admin123",  cpf: "999.999.999-99", dept: "DEPARTAMENTO-CP", phone: "(43) 99999-9999", avatar: "FC" },
  { id: 2, role: "volunteer", name: "Matheus José Rossieri",  email: "matheus@utfpr.edu.br", password: "vol123",    cpf: "123.***.***-89", course: "Engenharia de Software", period: "6º Período", ra: "2123456", address: "Rua Aleatória, 123", city: "Cornélio Procópio", state: "Paraná", phone: "(43) 00000-0000", birthdate: "01/01/2000", nationality: "Brasileira", status: "active", complete: true,  avatar: "MJ" },
  { id: 3, role: "volunteer", name: "Voluntário ELLP",    email: "voluntario@utfpr.edu.br", password: "vol456", cpf: "", course: "", period: "", ra: "", address: "", city: "", state: "", phone: "", birthdate: "", nationality: "", status: "active", complete: false, avatar: "VE" },
];

const MOCK_VOLUNTEERS = [
  { id: 2,  name: "Leda Miura", cpf: "123.456.789-00", course: "Análise e Desenvolvimento de Sistemas", bond: "DISCENTE", status: "active" },
  { id: 3,  name: "Kevin", cpf: "234.567.890-11", course: "Engenharia de Software",  bond: "DISCENTE", status: "active" },
  { id: 4,  name: "Lucas Gengivir", cpf: "345.678.901-22", course: "Análise e Desenvolvimento de Sistemas", bond: "DISCENTE", status: "inactive" },
  { id: 5,  name: "Alexis Liasch Tavares",  cpf: "456.789.012-33", course: "Análise e Desenvolvimento de Sistemas", bond: "EGRESSO", status: "active" },
];

const MOCK_PROJECT = {
  title: "ELLP",
  modality: "Projeto",
  startMonth: "Janeiro", startYear: "2026",
  endMonth: "Dezembro",  endYear: "2026",
  status: "Ativo",
};

const ACTIVITIES_EXAMPLE = [
  "Apoio pedagógico em oficinas de lógica para crianças do ensino fundamental",
  "Desenvolvimento de materiais didáticos utilizando Scratch e Python",
  "Auxílio na organização de eventos de robótica educacional",
  "Monitoria presencial e suporte técnico em laboratórios de informática",
  "",
];

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const YEARS  = ["2026","2027","2028","2029"];
const PERIODS = ["1º Período","2º Período","3º Período","4º Período","5º Período","6º Período","7º Período","8º Período","9º Período","10º Período"];
const COURSES = ["Ciência da Computação","Engenharia de Software","Sistemas de Informação","Tecnologia em ADS","Engenharia de Computação","Matemática","Física","Letras","Outro"];

/* Cores dinâmicas (usadas apenas inline em JS) */
const C_BLUE   = "#1A6FC4";
const C_GREEN  = "#16A34A";
const C_ORANGE = "#EA580C";
const C_RED    = "#DC2626";
const C_MUTED  = "#94A3B8";

let _nextId = 20;
const uid = () => ++_nextId;
const ini = n => n.split(" ").slice(0,2).map(x=>x[0]).join("").toUpperCase();
const AVT_COLORS = ["#1A6FC4","#7C3AED","#0891B2","#16A34A","#C2410C","#BE185D","#0F766E"];
const avtColor = n => AVT_COLORS[n.charCodeAt(0) % AVT_COLORS.length];

/* ═══════════════════════════════════════════
   COMPONENTES UTILITÁRIOS
═══════════════════════════════════════════ */
function Avt({ name, size=36, fontSize=13 }) {
  return (
    <div className="avt" style={{ width:size, height:size, fontSize, background:avtColor(name) }}>
      {ini(name)}
    </div>
  );
}

function Toast({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type || "default"}`}>
          <span>{t.icon}</span>{t.msg}
        </div>
      ))}
    </div>
  );
}

function Badge({ status }) {
  if (status === "active")   return <span className="badge badge--active"><span className="dot dot--on"/>Ativo</span>;
  if (status === "inactive") return <span className="badge badge--inactive"><span className="dot dot--off"/>Inativo</span>;
  return null;
}

/* ═══════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════ */
function Login({ onLogin }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error,    setError]    = useState("");

  const submit = () => {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!user) { setError("E-mail ou senha incorretos."); return; }
    onLogin(user);
  };

  return (
    <div className="login-root">
      {/* Lado esquerdo — ilustração */}
      <div className="login-left">
        <div className="login-left__inner">
          <div className="login-mascot">
            <img src={logoEllp} alt="ELLP Logo" className="login-mascot-img" />
          </div>
          <div className="login-project-label">PROJETO DE EXTENSÃO DA UNIVERSIDADE</div>
          <div className="login-project-sub">ENGAJAMENTO DIGITAL</div>
          <h2 className="login-welcome">Bem-vindo ao Portal ELLP</h2>
          <p className="login-desc">Sistema de Gestão de Voluntários</p>
          <div className="login-dots">
            <span className="login-dot login-dot--off" />
            <span className="login-dot login-dot--on" />
            <span className="login-dot login-dot--off" />
          </div>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="login-right">
        <div className="login-card">
          <h1 className="login-card__title">Acessar Conta</h1>
          <p className="login-card__sub">Entre com suas credenciais acadêmicas</p>

          {error && <div className="login-error">{error}</div>}

          <div className="fg">
            <label className="flabel">Email</label>
            <div className="finput-wrap">
              <span>✉</span>
              <input
                className="finput"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && submit()}
              />
            </div>
          </div>

          <div className="fg">
            <div className="flabel-row">
              <label className="flabel">Senha</label>
              <span className="login-forgot">Esqueceu a senha?</span>
            </div>
            <div className="finput-wrap">
              <span>🔒︎</span>
              <input
                className="finput"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && submit()}
              />
            </div>
          </div>

          <label className="login-remember">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
            Lembrar de mim
          </label>

          <button className="login-btn" onClick={submit}>Entrar →</button>

          <p className="login-signup">
            Não possui uma conta? <span className="login-signup__link">Solicitar acesso</span>
          </p>

          <div className="login-footer">
            <span>© 2026 PORTAL ELLP</span>
            <span>🔒︎ LOGIN SEGURO</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SIDEBAR — VOLUNTÁRIO
═══════════════════════════════════════════ */
const VOL_NAV = [
  { key: "inicio",       label: "Início",           ico: "🏠" },
  { key: "atividades",   label: "Minhas Atividades", ico: "📋" },
  { key: "perfil",       label: "Meu Perfil",        ico: "👤" },
  { key: "termo",        label: "Gerar Termo",       ico: "📄" },
];

function SidebarVol({ page, setPage, user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo-box"><div className="sb-logo-inner" /></div>
        <div className="sb-brand-text">
          <div className="sb-brand-text__name">ELLP</div>
          <div className="sb-brand-text__sub">Ensino de Lógica de Programação</div>
        </div>
      </div>

      <div className="sb-user">
        <Avt name={user.name} size={32} fontSize={12} />
        <div>
          <div className="sb-user__name">{user.name}</div>
          <div className="sb-user__role">Voluntário</div>
        </div>
      </div>

      <nav className="sb-nav">
        {VOL_NAV.map(n => (
          <div key={n.key} className={`sb-item${page === n.key ? " active" : ""}`} onClick={() => setPage(n.key)}>
            <span className="sb-item__ico">{n.ico}</span>{n.label}
          </div>
        ))}
      </nav>

      <div className="sb-footer">
        <div className="sb-sair" onClick={onLogout}><span>↪</span> Sair</div>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════
   SIDEBAR — ADMIN
═══════════════════════════════════════════ */
const ADM_NAV = [
  { key: "inicio",       label: "Início",                  ico: "🏠" },
  { key: "voluntarios",  label: "Voluntários",             ico: "👥" },
  { key: "acao",         label: "Dados da Ação Extensionista", ico: "📊" },
  { key: "perfil",       label: "Meu Perfil",              ico: "👤" },
];

function SidebarAdm({ page, setPage, user, onLogout }) {
  return (
    <aside className="sidebar sidebar--dark">
      <div className="sb-brand">
        <div className="sb-logo-box sb-logo-box--dark"><div className="sb-logo-inner" /></div>
        <div className="sb-brand-text">
          <div className="sb-brand-text__name sb-brand-text__name--dark">Gestor ELLP</div>
          <div className="sb-brand-text__sub sb-brand-text__sub--dark">Painel Administrativo</div>
        </div>
      </div>

      <div className="sb-user sb-user--dark">
        <Avt name={user.name} size={32} fontSize={12} />
        <div>
          <div className="sb-user__name sb-user__name--dark">{user.name}</div>
          <div className="sb-user__role sb-user__role--dark">Administrador</div>
        </div>
      </div>

      <nav className="sb-nav">
        {ADM_NAV.map(n => (
          <div key={n.key} className={`sb-item sb-item--dark${page === n.key ? " active" : ""}`} onClick={() => setPage(n.key)}>
            <span className="sb-item__ico">{n.ico}</span>{n.label}
          </div>
        ))}
      </nav>

      <div className="sb-footer">
        <button className="btn btn-orange sb-new-vol" onClick={() => setPage("voluntarios")}>
          + Novo Voluntário
        </button>
        <div className="sb-sair sb-sair--dark" onClick={onLogout}><span>↪</span> Sair</div>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════ */
function Topbar({ user, title }) {
  return (
    <header className="topbar">
      <div className="topbar__title">{title}</div>
      <div className="topbar__right">
        <button className="topbar__bell">🔔</button>
        <Avt name={user.name} size={34} fontSize={13} />
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD — VOLUNTÁRIO
═══════════════════════════════════════════ */
function DashVol({ user, setPage }) {
  const incomplete = !user.complete;

  return (
    <div className="page-content">
      <Topbar user={user} title="Painel do Voluntário" />
      <div className="content">

        {/* Banner de perfil incompleto */}
        {incomplete && (
          <div className="alert alert--warning">
            <span>⚠</span>
            <span>Seu cadastro está incompleto. Preencha seus dados antes de continuar.</span>
            <button className="btn btn-dark btn-sm" onClick={() => setPage("perfil")}>Completar Perfil</button>
          </div>
        )}

        {/* Boas-vindas */}
        <div className="welcome-card">
          <div className="welcome-card__text">
            <h2 className="welcome-card__title">Bem-vindo ao Portal ELLP, {user.name.split(" ")[0]}!</h2>
            <p className="welcome-card__desc">
              O Projeto de Extensão ELLP tem como missão democratizar o ensino de lógica de programação para crianças e jovens, transformando o futuro através da educação tecnológica e criativa.
            </p>
            <button className="btn btn-orange" onClick={() => setPage("termo")}>
              📄 Gerar Termo de Voluntariado
            </button>
          </div>
          <div className="welcome-card__mascot">
            <img src={logoEllp} alt="ELLP Logo" className="welcome-card__img" />
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="mini-stats">
          <div className="mini-stat">
            <div className="mini-stat__tag mini-stat__tag--blue">Próxima Oficina</div>
            <div className="mini-stat__ico">📅</div>
            <div className="mini-stat__val">15/Out</div>
            <div className="mini-stat__sub">Quinta-feira, às 14:00</div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat__tag mini-stat__tag--green">Progresso</div>
            <div className="mini-stat__ico">✅</div>
            <div className="mini-stat__val">12</div>
            <div className="mini-stat__sub">Oficinas realizadas este ano</div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat__tag mini-stat__tag--purple">Comunidade</div>
            <div className="mini-stat__ico">👥</div>
            <div className="mini-stat__val">48</div>
            <div className="mini-stat__sub">Voluntários ativos no projeto</div>
          </div>
        </div>

        {/* Próxima missão */}
        <div className="mission-card">
          <div className="mission-card__left">
            <div className="mission-card__header">
              <h3 className="mission-card__title">Sua próxima missão</h3>
            </div>
            <p className="mission-card__name">Oficina de Scratch: Criando seu primeiro jogo.</p>
            <p className="mission-card__loc">Local: Laboratório de Informática II, Bloco B.</p>
            <div className="mission-card__actions">
              <button className="btn btn-outline-white btn-sm">Visualizar Roteiro</button>
              <button className="btn btn-orange btn-sm">Confirmar Presença</button>
            </div>
          </div>
          <div className="mission-card__right">
            <div className="mission-quote">
              <div className="mission-mascot">
                <img src={logoEllp} alt="ELLP Logo" className="mission-mascot-img" />
              </div>
              <p className="mission-quote__text">"Mudar o mundo começa com uma linha de código."</p>
              <p className="mission-quote__sub">Obrigado por fazer parte do ELLP!</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD — ADMIN
═══════════════════════════════════════════ */
function DashAdm({ user, setPage, volunteers, setModalNewVol }) {
  const ativos   = volunteers.filter(v => v.status === "active").length;
  const inativos = volunteers.filter(v => v.status === "inactive").length;

  return (
    <div className="page-content">
      <Topbar user={user} title="Gerenciador ELLP" />
      <div className="content">

        {/* Boas-vindas admin */}
        <div className="adm-welcome">
          <div>
            <h2 className="adm-welcome__title">Olá, {user.name.split(" ")[0]}! 👋</h2>
            <p className="adm-welcome__sub">Bem-vindo de volta ao portal de gestão. O projeto ELLP continua crescendo graças ao seu acompanhamento.</p>
            <div className="adm-welcome__actions">
              <button className="btn btn-primary" onClick={() => setModalNewVol(true)}>+ Novo Voluntário</button>
              <button className="btn btn-orange" onClick={() => setPage("acao")}>✏ Editar Ação</button>
            </div>
          </div>
          <div className="adm-welcome__mascot">
            <img src={logoEllp} alt="ELLP Logo" className="adm-welcome__img" />
          </div>
        </div>

        {/* Stats principais */}
        <div className="adm-stats">
          <div className="adm-stat-card adm-stat-card--wide">
            <div className="adm-stat-card__header">
              <span className="adm-stat-card__title">Voluntários Engajados</span>
              <span className="adm-stat-card__ico">👥</span>
            </div>
            <div className="adm-stat-card__main">
              <span className="adm-stat-big">{volunteers.length}</span>
              <span className="adm-stat-label"> Total Registrados</span>
            </div>
            <div className="adm-stat-row">
              <div className="adm-stat-sub">
                <span className="adm-stat-sub__val" style={{ color: C_BLUE }}>{ativos}</span>
                <span className="adm-stat-sub__lbl">Ativos</span>
                <div className="adm-stat-bar" style={{ background: C_BLUE }} />
              </div>
              <div className="adm-stat-sub">
                <span className="adm-stat-sub__val" style={{ color: C_RED }}>{inativos}</span>
                <span className="adm-stat-sub__lbl">Inativos</span>
                <div className="adm-stat-bar" style={{ background: C_RED }} />
              </div>
            </div>
          </div>

          <div className="adm-stat-card adm-stat-card--blue">
            <div className="adm-stat-card__title adm-stat-card__title--light">Coordenadores</div>
            <div className="adm-stat-big adm-stat-big--white">08</div>
            <div className="adm-stat-label adm-stat-label--light">Membros da equipe gestora</div>
            <button className="btn btn-outline-white btn-sm adm-stat-card__btn" onClick={() => setPage("voluntarios")}>
              Ver lista completa
            </button>
          </div>
        </div>

        {/* Ações rápidas + Gráfico */}
        <div className="adm-bottom">
          <div className="card">
            <div className="card-header"><div className="card-title">⚡ Ações Rápidas</div></div>
            <div className="adm-quick-list">
              {[
                { label: "Ver Voluntários",       action: () => setPage("voluntarios") },
                { label: "Dados da Ação",         action: () => setPage("acao") },
                { label: "Comunicados",           action: () => {} },
              ].map(item => (
                <div key={item.label} className="adm-quick-item" onClick={item.action}>
                  <span>{item.label}</span>
                  <span className="adm-quick-item__arrow">›</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">📈 Tendência de Engajamento</div>
              <span className="card-header__sub">Últimos 6 meses</span>
            </div>
            <div className="adm-chart">
              {[30,45,40,60,80,95].map((h, i) => (
                <div key={i} className="adm-chart__col">
                  <div
                    className="adm-chart__bar"
                    style={{ height: `${h}%`, background: i === 5 ? C_BLUE : "#BFDBFE" }}
                  />
                  <span className="adm-chart__lbl">
                    {["Jan","Fev","Mar","Abr","Mai","Jun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   VOLUNTÁRIOS (admin)
═══════════════════════════════════════════ */
function GerenciarVols({ user, volunteers, setVolunteers, toast, modalNew, setModalNew }) {
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState([]);
  const [editVol,  setEditVol]  = useState(null);

  const filtered = volunteers.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.cpf.includes(search)
  );

  const toggleSelect = id => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const inativar = id => {
    setVolunteers(vs => vs.map(v => v.id === id ? { ...v, status: v.status === "active" ? "inactive" : "active" } : v));
    toast("Status do voluntário atualizado", "🔄");
  };

  const excluir = id => {
    setVolunteers(vs => vs.filter(v => v.id !== id));
    toast("Voluntário excluído", "🗑️");
  };

  const salvarNovo = data => {
    setVolunteers(vs => [...vs, { ...data, id: uid(), status: "active" }]);
    setModalNew(false);
    toast("Voluntário cadastrado com sucesso!", "🎉");
  };

  const salvarEdicao = data => {
    setVolunteers(vs => vs.map(v => v.id === data.id ? { ...v, ...data } : v));
    setEditVol(null);
    toast("Dados atualizados com sucesso!", "✎");
  };

  return (
    <div className="page-content">
      <Topbar user={user} title="Voluntários" />
      <div className="content">
        <div className="vols-header">
          <div>
            <h2 className="page-title">Voluntários</h2>
            <p className="page-sub">Gerencie os participantes do projeto</p>
          </div>
        </div>

        {/* Busca */}
        <div className="vols-search-bar">
          <div className="search-wrap">
            <span className="search-icon">🔍︎</span>
            <input
              placeholder="Nome ou CPF"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-sm">Filtrar</button>
        </div>

        {/* Barra de seleção */}
        {selected.length > 0 && (
          <div className="vols-selection-bar">
            <span>{selected.length} voluntário(s) selecionado(s)</span>
            <div className="vols-selection-bar__actions">
              <button className="btn btn-outline btn-sm" onClick={() => {}}>Ver Informações</button>
              <button className="btn btn-outline btn-sm" onClick={() => {}}>Gerar Termo</button>
              <button className="btn btn-warning btn-sm" onClick={() => { selected.forEach(inativar); setSelected([]); }}>Inativar</button>
              <button className="btn btn-danger btn-sm" onClick={() => { selected.forEach(excluir); setSelected([]); }}>Excluir</button>
            </div>
          </div>
        )}

        {/* Tabela */}
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(v=>v.id) : [])} /></th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Curso</th>
                  <th>Vínculo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id} className={selected.includes(v.id) ? "tr--selected" : ""}>
                    <td><input type="checkbox" checked={selected.includes(v.id)} onChange={() => toggleSelect(v.id)} /></td>
                    <td>
                      <div className="td-name">
                        <Avt name={v.name} size={30} fontSize={11} />
                        {v.name}
                      </div>
                    </td>
                    <td className="td-muted">{v.cpf}</td>
                    <td className="td-muted">{v.course}</td>
                    <td><span className={`bond-tag bond-tag--${v.bond?.toLowerCase()}`}>{v.bond}</span></td>
                    <td><Badge status={v.status} /></td>
                    <td>
                      <div className="td-actions">
                        <button className="btn-icon" title="Editar" onClick={() => setEditVol(v)}>✎</button>
                        <button className="btn-icon" title={v.status === "active" ? "Inativar" : "Reativar"} onClick={() => inativar(v.id)}>
                          {v.status === "active" ? "⏸" : "▶"}
                        </button>
                        <button className="btn-icon btn-icon--danger" title="Excluir" onClick={() => excluir(v.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <span>Exibindo {filtered.length} de {volunteers.length} voluntários</span>
            <div className="pagination">
              <button className="pg-btn">‹</button>
              <button className="pg-btn pg-btn--active">1</button>
              <button className="pg-btn">2</button>
              <button className="pg-btn">3</button>
              <button className="pg-btn">›</button>
            </div>
          </div>
        </div>

      </div>

      {modalNew  && <VolModal mode="new"  onSave={salvarNovo}  onClose={() => setModalNew(false)} />}
      {editVol   && <VolModal mode="edit" initial={editVol} onSave={salvarEdicao} onClose={() => setEditVol(null)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MODAL NOVO / EDITAR VOLUNTÁRIO
═══════════════════════════════════════════ */
function VolModal({ mode, initial = {}, onSave, onClose }) {
  const [f, setF] = useState({
    name:"", cpf:"", course:"", bond:"DISCENTE", status:"active", ...initial
  });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="modal-title">{mode === "new" ? "Novo Voluntário" : "Editar Voluntário"}</div>
            <div className="modal-sub">{mode === "new" ? "Preencha os dados do novo participante" : "Atualize os dados do voluntário"}</div>
          </div>
          <button className="btn-x" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="fg">
            <label className="flabel">Nome Completo *</label>
            <input className="finput finput--plain" value={f.name} onChange={e=>s("name",e.target.value)} placeholder="Nome completo" />
          </div>
          <div className="fg2">
            <div className="fg">
              <label className="flabel">CPF *</label>
              <input className="finput finput--plain" value={f.cpf} onChange={e=>s("cpf",e.target.value)} placeholder="000.000.000-00" />
            </div>
            <div className="fg">
              <label className="flabel">Vínculo</label>
              <select className="fselect" value={f.bond} onChange={e=>s("bond",e.target.value)}>
                {["DISCENTE","DOCENTE","EGRESSO","TÉCNICO"].map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div className="fg">
            <label className="flabel">Curso</label>
            <select className="fselect" value={f.course} onChange={e=>s("course",e.target.value)}>
              <option value="">Selecione...</option>
              {COURSES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => { if(f.name && f.cpf){ onSave(f); } }}>
            {mode === "new" ? "Cadastrar" : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DADOS DA AÇÃO EXTENSIONISTA (admin)
═══════════════════════════════════════════ */
function DadosAcao({ user, project, setProject, toast, volunteers }) {
  const [f, setF] = useState({ ...project });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));

  const salvar = () => {
    setProject(f);
    toast("Dados da ação salvos com sucesso!");
  };

  const ativos = volunteers.filter(v => v.status === "active").length;

  return (
    <div className="page-content">
      <Topbar user={user} title="Dados da Ação" />
      <div className="content">
        <div className="acao-grid">

          {/* Formulário principal */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">⚙ Configurações do Projeto</div>
                <div className="card-sub">Gerencie as informações fundamentais da sua ação extensionista.</div>
              </div>
            </div>
            <div className="card-body">
              <div className="fg">
                <label className="flabel">Título da Ação</label>
                <input className="finput finput--plain" value={f.title} onChange={e=>s("title",e.target.value)} />
              </div>
              <div className="fg">
                <label className="flabel">Modalidade</label>
                <div className="radio-group">
                  {["Programa","Projeto","Evento","Curso"].map(m => (
                    <label key={m} className={`radio-btn${f.modality === m ? " radio-btn--active" : ""}`}>
                      <input type="radio" name="modality" value={m} checked={f.modality===m} onChange={()=>s("modality",m)} />
                      {m}
                    </label>
                  ))}
                </div>
              </div>
              <div className="fg">
                <label className="flabel">Período de Vigência</label>
                <div className="vigencia-row">
                  <select className="fselect fselect--sm" value={f.startMonth} onChange={e=>s("startMonth",e.target.value)}>
                    {MONTHS.map(m=><option key={m}>{m}</option>)}
                  </select>
                  <select className="fselect fselect--sm" value={f.startYear} onChange={e=>s("startYear",e.target.value)}>
                    {YEARS.map(y=><option key={y}>{y}</option>)}
                  </select>
                  <span className="vigencia-arrow">→</span>
                  <select className="fselect fselect--sm" value={f.endMonth} onChange={e=>s("endMonth",e.target.value)}>
                    {MONTHS.map(m=><option key={m}>{m}</option>)}
                  </select>
                  <select className="fselect fselect--sm" value={f.endYear} onChange={e=>s("endYear",e.target.value)}>
                    {YEARS.map(y=><option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-foot" style={{ borderTop: "none", paddingLeft: 0 }}>
                <button className="btn btn-ghost" onClick={() => setF({ ...project })}>Descartar</button>
                <button className="btn btn-primary" onClick={salvar}>Salvar alterações</button>
              </div>
            </div>
          </div>

          {/* Status sidebar */}
          <div className="acao-side">
            <div className="acao-mascot">
              <img src={logoEllp} alt="ELLP Logo" className="acao-mascot-img" />
            </div>
            <p className="acao-mascot__tip">
              <strong>Quase lá!</strong> Mantenha os dados da ação atualizados para que os voluntários possam gerar seus termos corretamente.
            </p>
            <div className="acao-status-card">
              <div className="acao-status-title">STATUS DO PROJETO</div>
              <div className="acao-status-row">
                <span>Estado Atual</span>
                <span className="badge badge--active">Ativo</span>
              </div>
              <div className="acao-status-row">
                <span>Voluntários</span>
                <span className="acao-status-val">{ativos} Ativos</span>
              </div>
              <div className="acao-status-row">
                <span>Próxima Renovação</span>
                <span className="acao-status-val">Jan {parseInt(f.endYear)+1}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PERFIL — VOLUNTÁRIO
═══════════════════════════════════════════ */
function PerfilVol({ user, setUser, toast }) {
  const [f, setF] = useState({ ...user });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  const isUtfpr = f.bond === "DISCENTE" || f.bond === "DOCENTE";

  const salvar = () => {
    const completo = f.name && f.cpf && f.birthdate && f.course && f.email;
    setUser({ ...f, complete: !!completo });
    toast("Perfil atualizado! Suas alterações foram salvas com sucesso.", "✅");
  };

  return (
    <div className="page-content">
      <Topbar user={user} title="Meu Perfil" />
      <div className="content">
        <div className="perfil-grid">

          {/* Coluna esquerda */}
          <div className="perfil-left">
            <div className="card perfil-avatar-card">
              <div className="perfil-avatar-wrap">
                <Avt name={f.name || "?"} size={80} fontSize={28} />
              </div>
              <div className="perfil-avatar-name">{f.name || "—"}</div>
              {/* TODO: exibir cargo real */}
            </div>

            <div className="card perfil-status-card">
              <div className="perfil-status-title">Status do Voluntariado</div>
              <div className="perfil-status-badge">
                <span className="dot dot--on" /> Ativo
              </div>
              <p className="perfil-status-desc">
                Suas informações acadêmicas são usadas para a emissão automática de termos e certificados. Mantenha-as sempre atualizadas.
              </p>

              {/* Mascote */}
              <div className="perfil-mascot-wrap">
                <div className="perfil-mascot">
                  <img src={logoEllp} alt="ELLP Logo" className="perfil-mascot-img" />
                </div>
                <p className="perfil-mascot__title">Precisa de ajuda?</p>
                <p className="perfil-mascot__sub">Se houver erros nos seus dados que não podem ser alterados, entre em contato com o coordenador do projeto.</p>
              </div>

              <button className="btn btn-orange btn-block" onClick={() => toast("Termo sendo gerado...", "📄")}>
                📄 Gerar Termo de Voluntariado
              </button>
            </div>
          </div>

          {/* Coluna direita */}
          <div className="card perfil-form-card">
            <div className="card-header">
              <div className="card-title">👤 Informações Pessoais</div>
            </div>
            <div className="card-body">
              <div className="fg2">
                <div className="fg">
                  <label className="flabel">Nome Completo</label>
                  <input className="finput finput--plain" value={f.name} onChange={e=>s("name",e.target.value)} />
                </div>
                <div className="fg">
                  <label className="flabel">CPF</label>
                  <input className="finput finput--plain" value={f.cpf || ""} onChange={e=>s("cpf",e.target.value)} placeholder="000.000.000-00" />
                </div>
              </div>
              <div className="fg2">
                <div className="fg">
                  <label className="flabel">Data de Nascimento</label>
                  <input className="finput finput--plain" value={f.birthdate || ""} onChange={e=>s("birthdate",e.target.value)} placeholder="DD/MM/AAAA" />
                </div>
                <div className="fg">
                  <label className="flabel">Nacionalidade</label>
                  <input className="finput finput--plain" value={f.nationality || ""} onChange={e=>s("nationality",e.target.value)} />
                </div>
              </div>

              <div className="section-divider">🎓 Dados Acadêmicos</div>

              <div className="fg perfil-utfpr-row">
                <label className="flabel">Aluno UTFPR?</label>
                <div className="radio-inline">
                  <label><input type="radio" checked={isUtfpr} onChange={()=>s("bond","DISCENTE")} /> Sim</label>
                  <label><input type="radio" checked={!isUtfpr} onChange={()=>s("bond","EGRESSO")} /> Não</label>
                </div>
              </div>
              <div className="fg2">
                <div className="fg">
                  <label className="flabel">Curso</label>
                  <select className="fselect" value={f.course||""} onChange={e=>s("course",e.target.value)}>
                    <option value="">Selecione...</option>
                    {COURSES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label className="flabel">Período</label>
                  <select className="fselect" value={f.period||""} onChange={e=>s("period",e.target.value)}>
                    <option value="">Selecione...</option>
                    {PERIODS.map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              {isUtfpr && (
                <div className="fg">
                  <label className="flabel">RA (Registro Acadêmico)</label>
                  <input
                    className={`finput finput--plain${!f.ra ? " finput--error" : ""}`}
                    value={f.ra || ""}
                    onChange={e=>s("ra",e.target.value)}
                    placeholder="Ex: 2123456"
                  />
                  {!f.ra && <span className="finput-error-msg">O RA é obrigatório para alunos UTFPR</span>}
                </div>
              )}

              <div className="section-divider">📞 Informações de Contato</div>

              <div className="fg2">
                <div className="fg">
                  <label className="flabel">Endereço</label>
                  <input className="finput finput--plain" value={f.address||""} onChange={e=>s("address",e.target.value)} placeholder="Rua, número" />
                </div>
                <div className="fg">
                  <label className="flabel">Cidade</label>
                  <input className="finput finput--plain" value={f.city||""} onChange={e=>s("city",e.target.value)} />
                </div>
              </div>
              <div className="fg2">
                <div className="fg">
                  <label className="flabel">Estado</label>
                  <input className="finput finput--plain" value={f.state||""} onChange={e=>s("state",e.target.value)} />
                </div>
                <div className="fg">
                  <label className="flabel">Telefone</label>
                  <input className="finput finput--plain" value={f.phone||""} onChange={e=>s("phone",e.target.value)} placeholder="(43) 99999-9999" />
                </div>
              </div>
              <div className="fg">
                <label className="flabel">Email</label>
                <input className="finput finput--plain" value={f.email||""} onChange={e=>s("email",e.target.value)} />
              </div>

              <div className="perfil-form-actions">
                <button className="btn btn-ghost" onClick={() => setF({...user})}>Descartar</button>
                <button className="btn btn-primary" onClick={salvar}>Salvar alterações</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PERFIL — ADMIN
═══════════════════════════════════════════ */
function PerfilAdm({ user, setUser, toast }) {
  const [f, setF] = useState({ ...user });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));

  const salvar = () => {
    setUser({ ...f });
    toast("Alterações salvas com sucesso!", "✅");
  };

  return (
    <div className="page-content">
      <Topbar user={user} title="Meu Perfil" />
      <div className="content">
        <div className="breadcrumb">
          <span>Administrador</span>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__cur">Meu Perfil</span>
        </div>

        <div className="perfil-adm-grid">

          {/* Avatar card */}
          <div className="card perfil-adm-avatar-card">
            <Avt name={f.name} size={80} fontSize={28} />
            <div className="perfil-adm-name">{f.name}</div>
            <div className="perfil-adm-role">Coordenador Extensionista</div>
            <span className="perfil-adm-verified">✓ Perfil Verificado</span>

            <div className="perfil-adm-tip">
              <div>
                <div className="perfil-adm-tip__title">Dicas do Robô</div>
                <p className="perfil-adm-tip__text">"Mantenha seus dados de contato sempre atualizados para facilitar a comunicação com os voluntários!"</p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div>
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Dados de Coordenação</div>
                  <div className="card-sub">Gerencie suas informações profissionais e de contato departamental.</div>
                </div>
              </div>
              <div className="card-body">
                <div className="fg2">
                  <div className="fg">
                    <label className="flabel">Nome Completo</label>
                    <input className="finput finput--plain" value={f.name} onChange={e=>s("name",e.target.value)} />
                  </div>
                  <div className="fg">
                    <label className="flabel">CPF</label>
                    <input className="finput finput--plain" value={f.cpf||""} onChange={e=>s("cpf",e.target.value)} />
                  </div>
                </div>
                <div className="fg2">
                  <div className="fg">
                    <label className="flabel">Departamento</label>
                    <input className="finput finput--plain" value={f.dept||""} onChange={e=>s("dept",e.target.value)} />
                  </div>
                  <div className="fg">
                    <label className="flabel">Telefone</label>
                    <input className="finput finput--plain" value={f.phone||""} onChange={e=>s("phone",e.target.value)} />
                  </div>
                </div>
                <div className="fg">
                  <label className="flabel">E-mail Institucional</label>
                  <input className="finput finput--plain" value={f.email||""} onChange={e=>s("email",e.target.value)} />
                </div>

                <div className="perfil-adm-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => {}}>🕐 Ver Histórico</button>
                  <button className="btn btn-primary" onClick={salvar}>Salvar alterações</button>
                </div>
              </div>
            </div>

            <div className="perfil-adm-security">
              <span>ℹ</span>
              <div>
                <div className="perfil-adm-security__title">Segurança da Conta</div>
                <p className="perfil-adm-security__sub">Para alterar seu CPF ou Departamento Principal, entre em contato com o suporte técnico da universidade.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MINHAS ATIVIDADES (voluntário)
═══════════════════════════════════════════ */
function MinhasAtividades({ user, toast }) {
  const [activities, setActivities] = useState([...ACTIVITIES_EXAMPLE]);
  const [startMonth, setStartMonth] = useState("Março");
  const [startYear,  setStartYear]  = useState("2026");
  const [endMonth,   setEndMonth]   = useState("Julho");
  const [endYear,    setEndYear]    = useState("2026");

  /* Cronograma: atividade × mês (0-11) */
  const [schedule, setSchedule] = useState({
    0: [2,3,4],
    1: [2,3,4],
    2: [2,3,4,5,6],
  });

  const toggleMonth = (row, col) => {
    setSchedule(s => {
      const curr = s[row] || [];
      const next = curr.includes(col) ? curr.filter(x=>x!==col) : [...curr, col];
      return { ...s, [row]: next };
    });
  };

  const activeActs = activities.filter(a => a.trim() !== "");

  return (
    <div className="page-content">
      <Topbar user={user} title="Minhas Atividades" />
      <div className="content">

        <div className="card ativ-header-card">
          <div className="ativ-header">
            <div className="ativ-header__ico">📋</div>
            <div>
              <div className="card-title">Gestão de Plano de Trabalho</div>
              <div className="card-sub">Organize suas contribuições e defina o cronograma de atividades para o semestre.</div>
            </div>
          </div>
        </div>

        {/* Síntese */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📝 Síntese das Atividades</div>
            <span className="card-header__sub card-header__sub--required">Obrigatório 5 itens</span>
          </div>
          <div className="card-body">
            {activities.map((act, i) => (
              <div key={i} className="ativ-row">
                <span className="ativ-row__num">{i+1}</span>
                <input
                  className="finput finput--plain ativ-row__input"
                  value={act}
                  onChange={e => {
                    const next = [...activities];
                    next[i] = e.target.value;
                    setActivities(next);
                  }}
                  placeholder={`Ex: ${["Preparação de material didático sobre Lógica de Programação","Realização de oficinas práticas de Scratch com alunos do fundamental","Suporte técnico e mentoria em projetos de extensão","",""][i]}`}
                />
              </div>
            ))}
            <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => toast("Atividades salvas!", "✅")}>
              Salvar Atividades
            </button>
          </div>
        </div>

        {/* Cronograma */}
        <div className="card">
          <div className="card-header"><div className="card-title">📅 Cronograma de Execução</div></div>
          <div className="card-body">
            <div className="crono-period">
              <div>
                <label className="flabel">Início do Período</label>
                <div className="crono-selects">
                  <select className="fselect fselect--sm" value={startMonth} onChange={e=>setStartMonth(e.target.value)}>
                    {MONTHS.map(m=><option key={m}>{m}</option>)}
                  </select>
                  <select className="fselect fselect--sm" value={startYear} onChange={e=>setStartYear(e.target.value)}>
                    {YEARS.map(y=><option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="flabel">Fim do Período</label>
                <div className="crono-selects">
                  <select className="fselect fselect--sm" value={endMonth} onChange={e=>setEndMonth(e.target.value)}>
                    {MONTHS.map(m=><option key={m}>{m}</option>)}
                  </select>
                  <select className="fselect fselect--sm" value={endYear} onChange={e=>setEndYear(e.target.value)}>
                    {YEARS.map(y=><option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="crono-table-wrap">
              <table className="crono-table">
                <thead>
                  <tr>
                    <th className="crono-th--act">Atividade</th>
                    {Array.from({length:12},(_,i)=>(
                      <th key={i} className="crono-th--month">{String(i+1).padStart(2,"0")}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeActs.map((act, ri) => (
                    <tr key={ri}>
                      <td className="crono-td--act">Atividade {String(ri+1).padStart(2,"0")}</td>
                      {Array.from({length:12},(_,ci)=>(
                        <td key={ci} className="crono-td--circle">
                          <button
                            className={`crono-circle${(schedule[ri]||[]).includes(ci) ? " crono-circle--on" : ""}`}
                            onClick={() => toggleMonth(ri, ci)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="crono-hint">ⓘ Clique nos círculos para marcar/desmarcar os meses de execução.</p>
            <div style={{ textAlign:"right", marginTop:12 }}>
              <button className="btn btn-primary btn-sm" onClick={() => toast("Cronograma salvo!", "✅")}>Salvar Cronograma</button>
            </div>
          </div>
        </div>

        {/* Mascote */}
        <div className="ativ-mascot-wrap">
          <div className="ativ-mascot">
             <img src={logoEllp} alt="ELLP Logo" className="ativ-mascot-img" />
          </div>
          <p className="ativ-mascot__title">Quase lá!</p>
          <p className="ativ-mascot__sub">Complete seu plano de trabalho para que o coordenador possa validar suas atividades e gerar seu termo de compromisso.</p>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   GERAR TERMO (voluntário)
═══════════════════════════════════════════ */
function GerarTermo({ user, project, toast }) {
  const incomplete = !user.cpf || !user.birthdate;

  const termDate = new Date().toLocaleDateString("pt-BR", { day:"2-digit", month:"long", year:"numeric" });

  return (
    <div className="page-content">
      <Topbar user={user} title="Gerar Termo de Voluntariado" />
      <div className="content">

        {incomplete && (
          <div className="alert alert--warning">
            <span>⚠</span>
            <div>
              <strong>Campos Pendentes</strong>
              <div>Seu perfil ainda possui informações incompletas (CPF e Data de Nascimento). Complete os dados no seu perfil para que o termo seja gerado com validade jurídica.</div>
            </div>
            <button className="btn btn-dark btn-sm">Corrigir Agora</button>
          </div>
        )}

        <div className="termo-layout">

          {/* Preview do termo */}
          <div className="termo-doc card">
            <div className="termo-doc__inner">
              <h2 className="termo-title">TERMO DE ADESÃO AO SERVIÇO VOLUNTÁRIO</h2>
              <p className="termo-subtitle">PROJETO ELLP - ENSINO LÚDICO DE LÓGICA E PROGRAMAÇÃO</p>

              <div className="termo-section">
                <div className="termo-section__title">1. DADOS DO PROJETO</div>
                <div className="termo-project-row">
                  <div><span className="termo-lbl">Título:</span><br/><span className="termo-val">{project.title}</span></div>
                  <div><span className="termo-lbl">Modalidade:</span><br/><span className="termo-val">Projeto de Extensão</span></div>
                  <div><span className="termo-lbl">Vigência:</span><br/><span className="termo-val">{project.startMonth?.slice(0,3)}/{project.startYear} – {project.endMonth?.slice(0,3)}/{project.endYear}</span></div>
                </div>
              </div>

              <div className="termo-section">
                <div className="termo-section__title">2. DADOS DO VOLUNTÁRIO</div>
                <table className="termo-table">
                  <tbody>
                    <tr><td className="termo-table__lbl">Nome Completo</td><td>{user.name}</td></tr>
                    <tr><td className="termo-table__lbl">CPF / RG</td><td className={!user.cpf ? "termo-missing" : ""}>{user.cpf || "Não informado"}</td></tr>
                    <tr><td className="termo-table__lbl">Curso / Matrícula</td><td>{user.course ? `${user.course} – ${user.ra || ""}` : "—"}</td></tr>
                    <tr><td className="termo-table__lbl">Endereço</td><td>{user.address ? `${user.address}, ${user.city}` : "—"}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="termo-section">
                <div className="termo-section__title">3. SÍNTESE DAS ATIVIDADES</div>
                {ACTIVITIES_EXAMPLE.filter(a=>a).map((a,i) => (
                  <div key={i} className="termo-activity">• {a};</div>
                ))}
              </div>

              <div className="termo-section">
                <div className="termo-section__title">4. PLANO DE TRABALHO E CARGA HORÁRIA</div>
                <table className="termo-table termo-table--schedule">
                  <thead>
                    <tr><th>Dia da Semana</th><th>Manhã</th><th>Tarde</th><th>Noite</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Terça-feira</td><td>-</td><td>14:00 – 18:00</td><td>-</td></tr>
                    <tr><td>Quinta-feira</td><td>-</td><td>14:00 – 18:00</td><td>-</td></tr>
                    <tr className="termo-table__total"><td colSpan={4} style={{textAlign:"right"}}>Total Semanal: 08 Horas</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="termo-section">
                <div className="termo-section__title">5. COORDENAÇÃO DO PROJETO</div>
                <div className="termo-coord">
                  <div>Coordenador Responsável: Fabrício Custódio da Silva</div>
                  <div>Departamento: Departamento de Análise e Desenvolvimento de Sistemas</div>
                  <div>Instituição: Centro de Ensino Superior de Cornélio Procópio</div>
                </div>
              </div>

              <div className="termo-assinaturas">
                <div className="termo-ass">
                  <div className="termo-ass__line" />
                  <div className="termo-ass__name">{user.name}</div>
                  <div className="termo-ass__role">VOLUNTÁRIO</div>
                </div>
                <div className="termo-ass">
                  <div className="termo-ass__line" />
                  <div className="termo-ass__name">Fabrício Custódio da Silva</div>
                  <div className="termo-ass__role">COORDENADOR DO PROJETO</div>
                </div>
              </div>

              <div className="termo-footer">Documento gerado eletronicamente em {termDate}.</div>
            </div>
          </div>

          {/* Ações */}
          <div className="termo-actions">
            <div className="card termo-actions-card">
              <div className="card-header"><div className="card-title">Ações do Termo</div></div>
              <div className="card-body">
                <p className="termo-actions__desc">Revise todos os dados antes de realizar o download. O arquivo PDF será gerado com as informações atuais do sistema.</p>
                <button className="btn btn-orange btn-block" onClick={() => toast("PDF sendo gerado...", "📄")}>
                  ⬇ Baixar PDF
                </button>
                <button className="btn btn-outline btn-block" style={{ marginTop: 8 }} onClick={() => {}}>
                  ✏ Editar Perfil
                </button>
                <div className="termo-actions__tags">
                  <span>🏛 Modelo Padrão Institucional</span>
                  <span>✍ Assinatura Digital Integrada</span>
                </div>
              </div>
            </div>

            <div className="card termo-tip-card">
              <div className="termo-tip">
                <div className="termo-tip__ico">
                  <img src={logoEllp} alt="ELLP Logo" className="termo-tip-img" />
                </div>
                <div>
                  <div className="termo-tip__title">Dica do ELLP!</div>
                  <p className="termo-tip__text">Lembre-se de anexar o termo assinado na seção "Meus Documentos" para validação das suas horas.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Botão fixo na base */}
        <div className="termo-bottom-btn">
          <button className="btn btn-orange" onClick={() => toast("Termo gerado!", "📄")}>
            📄 Gerar Termo
          </button>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════ */
export default function App() {
  const [user,       setUser]       = useState(null);
  const [page,       setPage]       = useState("inicio");
  const [toasts,     setToasts]     = useState([]);
  const [volunteers, setVolunteers] = useState(MOCK_VOLUNTEERS);
  const [project,    setProject]    = useState(MOCK_PROJECT);
  const [modalNewVol, setModalNewVol] = useState(false);

  const toast = (msg, icon = "✓", type = "default") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, icon, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  };

  const logout = () => { setUser(null); setPage("inicio"); };

  if (!user) {
    return (
      <>
        <Login onLogin={u => { setUser(u); setPage("inicio"); }} />
        <Toast toasts={toasts} />
      </>
    );
  }

  /* ── VOLUNTÁRIO ── */
  if (user.role === "volunteer") {
    const volPages = {
      inicio:     <DashVol user={user} setPage={setPage} />,
      atividades: <MinhasAtividades user={user} toast={toast} />,
      perfil:     <PerfilVol user={user} setUser={u => setUser({...user,...u})} toast={toast} />,
      termo:      <GerarTermo user={user} project={project} toast={toast} />,
    };
    return (
      <>
        <div className="app">
          <SidebarVol page={page} setPage={setPage} user={user} onLogout={logout} />
          <div className="main">{volPages[page] || volPages.inicio}</div>
        </div>
        <Toast toasts={toasts} />
      </>
    );
  }

  /* ── ADMIN ── */
  const salvarNovo = data => {
    setVolunteers(vs => [...vs, { ...data, id: uid(), status: "active" }]);
    setModalNewVol(false);
    toast("Voluntário cadastrado com sucesso!", "🎉");
  };

  const admPages = {
    inicio:      <DashAdm user={user} setPage={setPage} volunteers={volunteers} setModalNewVol={setModalNewVol} />,
    voluntarios: <GerenciarVols user={user} volunteers={volunteers} setVolunteers={setVolunteers} toast={toast} modalNew={modalNewVol} setModalNew={setModalNewVol} />,
    acao:        <DadosAcao user={user} project={project} setProject={setProject} toast={toast} volunteers={volunteers} />,
    perfil:      <PerfilAdm user={user} setUser={u => setUser({...user,...u})} toast={toast} />,
  };

  return (
    <>
      <div className="app">
        <SidebarAdm page={page} setPage={setPage} user={user} onLogout={logout} />
        <div className="main">{admPages[page] || admPages.inicio}</div>
      </div>
      {modalNewVol && <VolModal mode="new" onSave={salvarNovo} onClose={() => setModalNewVol(false)} />}
      <Toast toasts={toasts} />
    </>
  );
}
