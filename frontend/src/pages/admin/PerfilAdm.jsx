/* ═══════════════════════════════════════
   Perfil do admin
═══════════════════════════════════════ */
import { useState } from "react";
import Topbar from "../../components/Topbar";
import Avt    from "../../components/Avt";

export default function PerfilAdm({ user, setUser, toast }) {
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

          {/* Card de avatar */}
          <div className="card perfil-adm-avatar-card">
            <Avt name={f.name} size={80} fontSize={28} />
            <div className="perfil-adm-name">{f.name}</div>
            <div className="perfil-adm-role">Coordenador Extensionista</div>
            <span className="perfil-adm-verified">✓ Perfil Verificado</span>

            <div className="perfil-adm-tip">
              <div>
                <div className="perfil-adm-tip__title">Dicas do Robô</div>
                <p className="perfil-adm-tip__text">
                  "Mantenha seus dados de contato sempre atualizados para facilitar
                  a comunicação com os voluntários!"
                </p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div>
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Dados de Coordenação</div>
                  <div className="card-sub">
                    Gerencie suas informações profissionais e de contato departamental.
                  </div>
                </div>
              </div>
              <div className="card-body">

                <div className="fg2">
                  <div className="fg">
                    <label className="flabel">Nome Completo</label>
                    <input className="finput finput--plain" value={f.name} onChange={e => s("name", e.target.value)} />
                  </div>
                  <div className="fg">
                    <label className="flabel">CPF</label>
                    <input className="finput finput--plain" value={f.cpf || ""} onChange={e => s("cpf", e.target.value)} />
                  </div>
                </div>

                <div className="fg2">
                  <div className="fg">
                    <label className="flabel">Departamento</label>
                    <input className="finput finput--plain" value={f.dept || ""} onChange={e => s("dept", e.target.value)} />
                  </div>
                  <div className="fg">
                    <label className="flabel">Telefone</label>
                    <input className="finput finput--plain" value={f.phone || ""} onChange={e => s("phone", e.target.value)} />
                  </div>
                </div>

                <div className="fg">
                  <label className="flabel">E-mail Institucional</label>
                  <input className="finput finput--plain" value={f.email || ""} onChange={e => s("email", e.target.value)} />
                </div>

                <div className="perfil-adm-actions">
                  <button className="btn btn-ghost btn-sm">🕐 Ver Histórico</button>
                  <button className="btn btn-primary" onClick={salvar}>Salvar alterações</button>
                </div>

              </div>
            </div>

            <div className="perfil-adm-security">
              <span>ℹ</span>
              <div>
                <div className="perfil-adm-security__title">Segurança da Conta</div>
                <p className="perfil-adm-security__sub">
                  Para alterar seu CPF ou Departamento Principal, entre em contato com
                  o suporte técnico da universidade.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
