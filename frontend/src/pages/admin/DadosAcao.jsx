/* ═══════════════════════════════════════
  Dados da Ação
═══════════════════════════════════════ */
import { useState } from "react";
import logoEllp from "../../assets/mascote-ellp.png";
import Topbar   from "../../components/Topbar";
import Badge    from "../../components/Badge";
import { MONTHS, YEARS } from "../../data/mockData";

export default function DadosAcao({ user, project, setProject, toast, volunteers }) {
  const [f, setF] = useState({ ...project });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));

  const ativos = volunteers.filter(v => v.status === "active").length;

  const salvar = () => {
    setProject(f);
    toast("Dados da ação salvos com sucesso!");
  };

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
                <div className="card-sub">
                  Gerencie as informações fundamentais da sua ação extensionista.
                </div>
              </div>
            </div>
            <div className="card-body">

              <div className="fg">
                <label className="flabel">Título da Ação</label>
                <input
                  className="finput finput--plain"
                  value={f.title}
                  onChange={e => s("title", e.target.value)}
                />
              </div>

              <div className="fg">
                <label className="flabel">Modalidade</label>
                <div className="radio-group">
                  {["Programa", "Projeto", "Evento", "Curso"].map(m => (
                    <label key={m} className={`radio-btn${f.modality === m ? " radio-btn--active" : ""}`}>
                      <input
                        type="radio"
                        name="modality"
                        value={m}
                        checked={f.modality === m}
                        onChange={() => s("modality", m)}
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </div>

              <div className="fg">
                <label className="flabel">Período de Vigência</label>
                <div className="vigencia-row">
                  <select className="fselect fselect--sm" value={f.startMonth} onChange={e => s("startMonth", e.target.value)}>
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                  <select className="fselect fselect--sm" value={f.startYear} onChange={e => s("startYear", e.target.value)}>
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                  <span className="vigencia-arrow">→</span>
                  <select className="fselect fselect--sm" value={f.endMonth} onChange={e => s("endMonth", e.target.value)}>
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                  <select className="fselect fselect--sm" value={f.endYear} onChange={e => s("endYear", e.target.value)}>
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div className="modal-foot" style={{ borderTop: "none", paddingLeft: 0 }}>
                <button className="btn btn-ghost" onClick={() => setF({ ...project })}>Descartar</button>
                <button className="btn btn-primary" onClick={salvar}>Salvar alterações</button>
              </div>

            </div>
          </div>

          {/* Sidebar de status */}
          <div className="acao-side">
            <div className="acao-mascot">
              <img src={logoEllp} alt="ELLP Logo" className="acao-mascot-img" />
            </div>
            <p className="acao-mascot__tip">
              <strong>Quase lá!</strong> Mantenha os dados da ação atualizados para que os
              voluntários possam gerar seus termos corretamente.
            </p>

            <div className="acao-status-card">
              <div className="acao-status-title">STATUS DO PROJETO</div>
              <div className="acao-status-row">
                <span>Estado Atual</span>
                <Badge status="active" />
              </div>
              <div className="acao-status-row">
                <span>Voluntários</span>
                <span className="acao-status-val">{ativos} Ativos</span>
              </div>
              <div className="acao-status-row">
                <span>Próxima Renovação</span>
                <span className="acao-status-val">Jan {parseInt(f.endYear) + 1}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
