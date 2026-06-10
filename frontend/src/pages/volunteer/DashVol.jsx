/* ═══════════════════════════════════════
   Dashboard do voluntário
═══════════════════════════════════════ */
import logoEllp from "../../assets/mascote-ellp.png";
import Topbar from "../../components/Topbar";

export default function DashVol({ user, setPage }) {
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
            <button className="btn btn-dark btn-sm" onClick={() => setPage("perfil")}>
              Completar Perfil
            </button>
          </div>
        )}

        {/* Boas-vindas */}
        <div className="welcome-card">
          <div className="welcome-card__text">
            <h2 className="welcome-card__title">
              Bem-vindo ao Portal ELLP, {user.name.split(" ")[0]}!
            </h2>
            <p className="welcome-card__desc">
              O Projeto de Extensão ELLP tem como missão democratizar o ensino de lógica
              de programação para crianças e jovens, transformando o futuro através da
              educação tecnológica e criativa.
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
