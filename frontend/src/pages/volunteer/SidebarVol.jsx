/* ═══════════════════════════════════════
   Sidebar do voluntário
═══════════════════════════════════════ */
import logoEllp from "../../assets/mascote-ellp.png";
import Avt from "../../components/Avt";

const NAV = [
  { key: "inicio",     label: "Início",            ico: "🏠" },
  { key: "atividades", label: "Minhas Atividades",  ico: "📋" },
  { key: "perfil",     label: "Meu Perfil",         ico: "👤" },
  { key: "termo",      label: "Gerar Termo",        ico: "📄" },
];

export default function SidebarVol({ page, setPage, user, onLogout }) {
  return (
    <aside className="sidebar">

      <div className="sb-brand">
        <div className="sb-logo-box">
          <img src={logoEllp} alt="ELLP Logo" className="sb-logo-img" />
        </div>
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
        {NAV.map(n => (
          <div
            key={n.key}
            className={`sb-item${page === n.key ? " active" : ""}`}
            onClick={() => setPage(n.key)}
          >
            <span className="sb-item__ico">{n.ico}</span>
            {n.label}
          </div>
        ))}
      </nav>

      <div className="sb-footer">
        <div className="sb-sair" onClick={onLogout}>
          <span>↪</span> Sair
        </div>
      </div>

    </aside>
  );
}
