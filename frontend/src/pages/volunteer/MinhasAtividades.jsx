/* ═══════════════════════════════════════
   Gestão de atividades do voluntário:
═══════════════════════════════════════ */
import { useState } from "react";
import logoEllp from "../../assets/mascote-ellp.png";
import Topbar from "../../components/Topbar";
import { ACTIVITIES_EXAMPLE, MONTHS, YEARS } from "../../data/mockData";

export default function MinhasAtividades({ user, toast }) {
  const [activities, setActivities] = useState([...ACTIVITIES_EXAMPLE]);
  const [startMonth, setStartMonth] = useState("Março");
  const [startYear,  setStartYear]  = useState("2026");
  const [endMonth,   setEndMonth]   = useState("Julho");
  const [endYear,    setEndYear]    = useState("2026");

  /* Cronograma: índice da atividade → array de meses marcados (0-11) */
  const [schedule, setSchedule] = useState({
    0: [2, 3, 4],
    1: [2, 3, 4],
    2: [2, 3, 4, 5, 6],
  });

  const toggleMonth = (row, col) => {
    setSchedule(s => {
      const curr = s[row] || [];
      const next = curr.includes(col)
        ? curr.filter(x => x !== col)
        : [...curr, col];
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
              <div className="card-sub">
                Organize suas contribuições e defina o cronograma de atividades para o semestre.
              </div>
            </div>
          </div>
        </div>

        {/* Síntese das atividades */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📝 Síntese das Atividades</div>
            <span className="card-header__sub card-header__sub--required">Obrigatório 5 itens</span>
          </div>
          <div className="card-body">
            {activities.map((act, i) => (
              <div key={i} className="ativ-row">
                <span className="ativ-row__num">{i + 1}</span>
                <input
                  className="finput finput--plain ativ-row__input"
                  value={act}
                  onChange={e => {
                    const next = [...activities];
                    next[i] = e.target.value;
                    setActivities(next);
                  }}
                  placeholder={`Ex: ${[
                    "Preparação de material didático sobre Lógica de Programação",
                    "Realização de oficinas práticas de Scratch com alunos do fundamental",
                    "Suporte técnico e mentoria em projetos de extensão",
                    "", "",
                  ][i]}`}
                />
              </div>
            ))}
            <button
              className="btn btn-primary btn-sm"
              style={{ marginTop: 16 }}
              onClick={() => toast("Atividades salvas!", "✅")}
            >
              Salvar Atividades
            </button>
          </div>
        </div>

        {/* Cronograma */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📅 Cronograma de Execução</div>
          </div>
          <div className="card-body">

            <div className="crono-period">
              <div>
                <label className="flabel">Início do Período</label>
                <div className="crono-selects">
                  <select className="fselect fselect--sm" value={startMonth} onChange={e => setStartMonth(e.target.value)}>
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                  <select className="fselect fselect--sm" value={startYear} onChange={e => setStartYear(e.target.value)}>
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="flabel">Fim do Período</label>
                <div className="crono-selects">
                  <select className="fselect fselect--sm" value={endMonth} onChange={e => setEndMonth(e.target.value)}>
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                  <select className="fselect fselect--sm" value={endYear} onChange={e => setEndYear(e.target.value)}>
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="crono-table-wrap">
              <table className="crono-table">
                <thead>
                  <tr>
                    <th className="crono-th--act">Atividade</th>
                    {Array.from({ length: 12 }, (_, i) => (
                      <th key={i} className="crono-th--month">
                        {String(i + 1).padStart(2, "0")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeActs.map((_, ri) => (
                    <tr key={ri}>
                      <td className="crono-td--act">Atividade {String(ri + 1).padStart(2, "0")}</td>
                      {Array.from({ length: 12 }, (_, ci) => (
                        <td key={ci} className="crono-td--circle">
                          <button
                            className={`crono-circle${(schedule[ri] || []).includes(ci) ? " crono-circle--on" : ""}`}
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

            <div style={{ textAlign: "right", marginTop: 12 }}>
              <button className="btn btn-primary btn-sm" onClick={() => toast("Cronograma salvo!", "✅")}>
                Salvar Cronograma
              </button>
            </div>
          </div>
        </div>

        {/* Mascote motivacional */}
        <div className="ativ-mascot-wrap">
          <div className="ativ-mascot">
            <img src={logoEllp} alt="ELLP Logo" className="ativ-mascot-img" />
          </div>
          <p className="ativ-mascot__title">Quase lá!</p>
          <p className="ativ-mascot__sub">
            Complete seu plano de trabalho para que o coordenador possa validar suas
            atividades e gerar seu termo de compromisso.
          </p>
        </div>

      </div>
    </div>
  );
}
