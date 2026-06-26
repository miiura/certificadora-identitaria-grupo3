/* ═══════════════════════════════════════
   Sidebar do admin
═══════════════════════════════════════ */
import logoEllp from "../../assets/mascote-ellp.png";
import Avt from "../../components/Avt";

const NAV = [
  { key: "inicio",      label: "Início",                      ico: "🏠" },
  { key: "voluntarios", label: "Voluntários",                  ico: "👥" },
  { key: "acao",        label: "Dados da Ação Extensionista",  ico: "📊" },
  { key: "perfil",      label: "Meu Perfil",                   ico: "👤" },
];

export default function SidebarAdm({ page, setPage, user, onLogout, onNewVol }) {
  return (
    <aside className="sidebar sidebar--dark">

      <div className="sb-brand">
        <div className="sb-logo-box sb-logo-box--dark">
          <img src={logoEllp} alt="ELLP Logo" className="sb-logo-img" />
        </div>
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
        {NAV.map(n => (
          <div
            key={n.key}
            className={`sb-item sb-item--dark${page === n.key ? " active" : ""}`}
            onClick={() => setPage(n.key)}
          >
            <span className="sb-item__ico">{n.ico}</span>
            {n.label}
          </div>
        ))}
      </nav>

      <div className="sb-footer">
        <button className="btn btn-orange sb-new-vol" onClick={onNewVol}>
          + Novo Voluntário
        </button>
        <div className="sb-sair sb-sair--dark" onClick={onLogout}>
          <span>↪</span> Sair
        </div>
      </div>

    </aside>
  );
}
