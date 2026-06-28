/* ═══════════════════════════════════════
   Modal de cadastro e edição de voluntário
   Usado tanto em GerenciarVols quanto no
   botão rápido do DashAdm
═══════════════════════════════════════ */
import { useState } from "react";
import { COURSES, PERIODS } from "../data/mockData";
import { digits, fmtCpf, fmtPhone } from "../utils/masks";

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const MONTH_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const YEARS = ["2025","2026","2027","2028","2029"];
const toTotal = (year, month) => parseInt(year, 10) * 12 + month;
const dbToMap = (arr) => { const m = {}; (arr || []).forEach(({ activityIndex, months }) => { m[activityIndex] = months || []; }); return m; };
const mapToDb = (map) => Object.entries(map).filter(([, ms]) => ms.length > 0).map(([k, ms]) => ({ activityIndex: Number(k), months: ms }));

export default function VolModal({ mode, initial = {}, onSave, onClose, loading = false }) {
  const [f, setF] = useState({
    name: "", email: "", cpf: "", password: "",
    phone: "", birthdate: "", nationality: "",
    role: "VOLUNTARIO",
    bond: "DISCENTE", course: "", period: "", ra: "",
    address: "", city: "", state: "",
    department: "",
    status: "active",
    ...initial,
  });

  const s = (k, v) => setF(p => ({ ...p, [k]: v }));

  const handleRoleChange = (newRole) => {
    setF(p => ({
      ...p,
      role: newRole,
      ...(newRole !== "VOLUNTARIO" ? { bond: "DISCENTE", course: "", period: "", ra: "" } : {}),
      ...(newRole !== "COORDENADOR" ? { department: "" } : {}),
    }));
  };

  const isUtfpr = f.bond === "DISCENTE" || f.bond === "DOCENTE";

  // ── Activities & schedule state (VOLUNTARIO + edit mode only) ──
  const [activities, setActivities] = useState(() => {
    const acts = [...(initial.activities || [])];
    while (acts.length < 5) acts.push("");
    return acts.slice(0, 5);
  });
  const [startMonth, setStartMonth] = useState(() =>
    initial.periodStart ? parseInt(initial.periodStart.split('/')[0], 10) - 1 : 0
  );
  const [startYear, setStartYear]   = useState(() => initial.periodStart?.split('/')[1] || "2026");
  const [endMonth,   setEndMonth]   = useState(() =>
    initial.periodEnd ? parseInt(initial.periodEnd.split('/')[0], 10) - 1 : 11
  );
  const [endYear,   setEndYear]     = useState(() => initial.periodEnd?.split('/')[1] || "2026");
  const [schedule,  setSchedule]    = useState(() => dbToMap(initial.schedule));

  const handleCronoStart = (nm, ny) => {
    const ns = toTotal(ny, nm), et = toTotal(endYear, endMonth);
    let nem = endMonth, ney = endYear;
    if (et < ns) { nem = nm; ney = ny; }
    else if (et > ns + 11) { const max = ns + 11; ney = String(Math.floor(max / 12)); nem = max % 12; }
    setStartMonth(nm); setStartYear(ny); setEndMonth(nem); setEndYear(ney); setSchedule({});
  };
  const handleCronoEnd = (nm, ny) => {
    const st = toTotal(startYear, startMonth), nt = toTotal(ny, nm);
    if (nt < st || nt > st + 11) return;
    setEndMonth(nm); setEndYear(ny); setSchedule({});
  };
  const toggleMonth = (row, col) => {
    setSchedule(s => {
      const curr = s[row] || [];
      const next = curr.includes(col) ? curr.filter(x => x !== col) : [...curr, col];
      return { ...s, [row]: next };
    });
  };

  const colCount  = Math.max(1, toTotal(endYear, endMonth) - toTotal(startYear, startMonth) + 1);
  const activeActs = activities.filter(a => a.trim() !== "");
  const colHeaders = Array.from({ length: colCount }, (_, i) => {
    const t = toTotal(startYear, startMonth) + i;
    return `${MONTH_SHORT[t % 12]} ${Math.floor(t / 12)}`;
  });

  const handleBirthdate = (raw) => {
    const d = raw.replace(/\D/g, '').slice(0, 8);
    let masked = d;
    if (d.length > 4) masked = d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4);
    else if (d.length > 2) masked = d.slice(0, 2) + '/' + d.slice(2);
    s("birthdate", masked);
  };

  const handleSave = () => {
    if (!f.name || !f.cpf) return;
    if (mode === "new" && !f.email) return;
    const payload = { ...f };
    if (f.role === "VOLUNTARIO" && mode === "edit") {
      payload.activities  = activities;
      payload.periodStart = `${String(startMonth + 1).padStart(2, '0')}/${startYear}`;
      payload.periodEnd   = `${String(endMonth   + 1).padStart(2, '0')}/${endYear}`;
      payload.schedule    = mapToDb(schedule);
    }
    onSave(payload);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal-head">
          <div>
            <div className="modal-title">
              {mode === "new" ? "Novo Usuário" : "Editar Usuário"}
            </div>
            <div className="modal-sub">
              {mode === "new"
                ? "Preencha os dados do novo participante"
                : "Atualize os dados do usuário"}
            </div>
          </div>
          <button className="btn-x" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">

          {/* ── Dados de acesso ─────────────────────────────── */}
          <div className="section-divider">👤 Dados de Acesso</div>

          <div className="fg">
            <label className="flabel">Nome Completo *</label>
            <input
              className="finput finput--plain"
              value={f.name || ""}
              onChange={e => s("name", e.target.value)}
              placeholder="Nome completo"
            />
          </div>

          <div className="fg">
            <label className="flabel">E-mail {mode === "new" ? "*" : ""}</label>
            <input
              className="finput finput--plain"
              type="email"
              value={f.email || ""}
              onChange={e => s("email", e.target.value)}
              placeholder="email@utfpr.edu.br"
              readOnly={mode === "edit"}
              disabled={mode === "edit"}
              title={mode === "edit" ? "Para alterar o e-mail, acesse o perfil completo." : ""}
            />
          </div>

          <div className="fg2">
            <div className="fg">
              <label className="flabel">CPF *</label>
              <input
                className="finput finput--plain"
                value={fmtCpf(f.cpf)}
                onChange={e => s("cpf", digits(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                readOnly={mode === "edit"}
                disabled={mode === "edit"}
                title={mode === "edit" ? "Para alterar o CPF, acesse o perfil completo." : ""}
              />
            </div>
            <div className="fg">
              <label className="flabel">Telefone</label>
              <input
                className="finput finput--plain"
                value={fmtPhone(f.phone)}
                onChange={e => s("phone", digits(e.target.value))}
                placeholder="(43) 99999-9999"
                maxLength={15}
              />
            </div>
          </div>

          {mode === "new" && (
            <>
              <div className="fg">
                <label className="flabel">Senha inicial</label>
                <input
                  className="finput finput--plain"
                  type="password"
                  value={f.password || ""}
                  onChange={e => s("password", e.target.value)}
                  placeholder="Deixe em branco para usar o CPF como senha"
                />
              </div>

              <div className="fg">
                <label className="flabel">Perfil</label>
                <select
                  className="fselect"
                  value={f.role || "VOLUNTARIO"}
                  onChange={e => handleRoleChange(e.target.value)}
                >
                  <option value="VOLUNTARIO">Voluntário</option>
                  <option value="COORDENADOR">Coordenador</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {f.role === "COORDENADOR" && (
                <div className="fg">
                  <label className="flabel">Departamento</label>
                  <input
                    className="finput finput--plain"
                    value={f.department || ""}
                    onChange={e => s("department", e.target.value)}
                    placeholder="Ex: DACOM"
                  />
                </div>
              )}
            </>
          )}

          {/* ── Dados pessoais (edit only) ───────────────────── */}
          {mode === "edit" && (
            <>
              <div className="section-divider">🪪 Dados Pessoais</div>

              <div className="fg2">
                <div className="fg">
                  <label className="flabel">Data de Nascimento</label>
                  <input
                    className="finput finput--plain"
                    value={f.birthdate || ""}
                    onChange={e => handleBirthdate(e.target.value)}
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                  />
                </div>
                <div className="fg">
                  <label className="flabel">Nacionalidade</label>
                  <input
                    className="finput finput--plain"
                    value={f.nationality || ""}
                    onChange={e => s("nationality", e.target.value)}
                    placeholder="Brasileira"
                  />
                </div>
              </div>
            </>
          )}

          {/* ── Dados de coordenador — apenas quando role for COORDENADOR ── */}
          {f.role === "COORDENADOR" && mode === "edit" && (
            <>
              <div className="section-divider">🏛 Dados de Coordenador</div>
              <div className="fg">
                <label className="flabel">Departamento</label>
                <input
                  className="finput finput--plain"
                  value={f.department || ""}
                  onChange={e => s("department", e.target.value)}
                  placeholder="Ex: DACOM"
                />
              </div>
            </>
          )}

          {/* ── Dados acadêmicos — apenas quando role for VOLUNTARIO ── */}
          {f.role === "VOLUNTARIO" && (
            <>
              <div className="section-divider">🎓 Dados Acadêmicos</div>

              <div className="fg2">
                <div className="fg">
                  <label className="flabel">Vínculo</label>
                  <select
                    className="fselect"
                    value={f.bond || "DISCENTE"}
                    onChange={e => s("bond", e.target.value)}
                  >
                    {["DISCENTE", "DOCENTE", "EGRESSO", "TÉCNICO"].map(b => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="fg">
                  <label className="flabel">Curso</label>
                  <select
                    className="fselect"
                    value={f.course || ""}
                    onChange={e => s("course", e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {COURSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {mode === "edit" && (
                <div className="fg2">
                  <div className="fg">
                    <label className="flabel">Período</label>
                    <select
                      className="fselect"
                      value={f.period || ""}
                      onChange={e => s("period", e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      {PERIODS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  {isUtfpr && (
                    <div className="fg">
                      <label className="flabel">RA</label>
                      <input
                        className="finput finput--plain"
                        value={f.ra || ""}
                        onChange={e => s("ra", e.target.value)}
                        placeholder="Ex: 2123456"
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── Atividades e Cronograma — VOLUNTARIO + edição ── */}
          {f.role === "VOLUNTARIO" && mode === "edit" && (
            <>
              <div className="section-divider">📝 Síntese das Atividades</div>
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
                    placeholder={`Atividade ${i + 1}`}
                  />
                </div>
              ))}

              <div className="section-divider">📅 Cronograma de Execução</div>
              <div className="crono-period">
                <div>
                  <label className="flabel">Início do Período</label>
                  <div className="crono-selects">
                    <select className="fselect fselect--sm" value={startMonth}
                      onChange={e => handleCronoStart(parseInt(e.target.value, 10), startYear)}>
                      {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                    </select>
                    <select className="fselect fselect--sm" value={startYear}
                      onChange={e => handleCronoStart(startMonth, e.target.value)}>
                      {YEARS.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="flabel">Fim do Período</label>
                  <div className="crono-selects">
                    <select className="fselect fselect--sm" value={endMonth}
                      onChange={e => handleCronoEnd(parseInt(e.target.value, 10), endYear)}>
                      {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                    </select>
                    <select className="fselect fselect--sm" value={endYear}
                      onChange={e => handleCronoEnd(endMonth, e.target.value)}>
                      {YEARS.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="crono-table-wrap" style={{ marginTop: 12 }}>
                <table className="crono-table">
                  <thead>
                    <tr>
                      <th className="crono-th--act">Atividade</th>
                      {colHeaders.map((h, i) => <th key={i} className="crono-th--month">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {activeActs.length === 0 ? (
                      <tr>
                        <td colSpan={colCount + 1} style={{ textAlign: "center", color: "var(--muted)", padding: "0.5rem" }}>
                          Preencha as atividades acima para montar o cronograma.
                        </td>
                      </tr>
                    ) : activeActs.map((_, ri) => (
                      <tr key={ri}>
                        <td className="crono-td--act">Atividade {String(ri + 1).padStart(2, "0")}</td>
                        {Array.from({ length: colCount }, (_, ci) => (
                          <td key={ci} className="crono-td--circle">
                            <button
                              type="button"
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
            </>
          )}

          {/* ── Endereço — todos os roles, apenas edição ─────── */}
          {mode === "edit" && (
            <>
              <div className="section-divider">📍 Endereço</div>

              <div className="fg">
                <label className="flabel">Endereço</label>
                <input
                  className="finput finput--plain"
                  value={f.address || ""}
                  onChange={e => s("address", e.target.value)}
                  placeholder="Rua, número"
                />
              </div>

              <div className="fg2">
                <div className="fg">
                  <label className="flabel">Cidade</label>
                  <input
                    className="finput finput--plain"
                    value={f.city || ""}
                    onChange={e => s("city", e.target.value)}
                  />
                </div>
                <div className="fg">
                  <label className="flabel">Estado</label>
                  <input
                    className="finput finput--plain"
                    value={f.state || ""}
                    onChange={e => s("state", e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

        </div>

        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? "Salvando…" : (mode === "new" ? "Cadastrar" : "Salvar Alterações")}
          </button>
        </div>

      </div>
    </div>
  );
}
