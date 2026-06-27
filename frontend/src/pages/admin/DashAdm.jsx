/* ═══════════════════════════════════════
   Dashboard do admin
═══════════════════════════════════════ */
import logoEllp from "../../assets/mascote-ellp.png";
import Topbar from "../../components/Topbar";

const C_BLUE = "#1A6FC4";
const C_RED  = "#DC2626";

export default function DashAdm({ user, setPage, volunteers, setModalNewVol }) {
  const ativos   = volunteers.filter(v => v.status === "active").length;
  const inativos = volunteers.filter(v => v.status === "inactive").length;

  return (
    <div className="page-content">
      <Topbar user={user} title="Gerenciador ELLP" />
      <div className="content">

        {/* Boas-vindas */}
        <div className="adm-welcome">
          <div>
            <h2 className="adm-welcome__title">Olá, {user.name.split(" ")[0]}! 👋</h2>
            <p className="adm-welcome__sub">
              Bem-vindo de volta ao portal de gestão. O projeto ELLP continua crescendo
              graças ao seu acompanhamento.
            </p>
            <div className="adm-welcome__actions">
              <button className="btn btn-primary" onClick={() => setModalNewVol(true)}>
                + Novo Usuário
              </button>
              <button className="btn btn-orange" onClick={() => setPage("acao")}>
                ✏ Editar Ação
              </button>
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
            <button
              className="btn btn-outline-white btn-sm adm-stat-card__btn"
              onClick={() => setPage("voluntarios")}
            >
              Ver lista completa
            </button>
          </div>
        </div>

        {/* Ações rápidas + Gráfico */}
        <div className="adm-bottom">
          <div className="card">
            <div className="card-header">
              <div className="card-title">⚡ Ações Rápidas</div>
            </div>
            <div className="adm-quick-list">
              {[
                { label: "Ver Voluntários", action: () => setPage("voluntarios") },
                { label: "Dados da Ação",   action: () => setPage("acao") },
                { label: "Comunicados",     action: () => {} },
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
              {[30, 45, 40, 60, 80, 95].map((h, i) => (
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
