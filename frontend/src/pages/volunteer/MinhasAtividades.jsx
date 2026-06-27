/* ═══════════════════════════════════════
   Gestão de atividades do voluntário
═══════════════════════════════════════ */
import { useState, useEffect } from "react";
import logoEllp from "../../assets/mascote-ellp.png";
import Topbar from "../../components/Topbar";
import { userService } from "../../services/userService";

const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];
const MONTH_SHORT = [
  "Jan","Fev","Mar","Abr","Mai","Jun",
  "Jul","Ago","Set","Out","Nov","Dez",
];
const YEARS = ["2025","2026","2027","2028","2029"];

// Total de meses desde o ano 0 — usado para comparar e calcular intervalos
const toTotal = (year, month) => parseInt(year, 10) * 12 + month;

// DB → mapa {activityIndex: months[]}
const dbToMap = (arr) => {
  const map = {};
  (arr || []).forEach(({ activityIndex, months }) => {
    map[activityIndex] = months || [];
  });
  return map;
};

// Mapa {activityIndex: months[]} → formato DB
const mapToDb = (map) =>
  Object.entries(map)
    .filter(([, months]) => months.length > 0)
    .map(([k, months]) => ({ activityIndex: Number(k), months }));

export default function MinhasAtividades({ user, toast }) {
  const [activities, setActivities] = useState(["", "", "", "", ""]);
  const [startMonth, setStartMonth] = useState(0);
  const [startYear,  setStartYear]  = useState("2026");
  const [endMonth,   setEndMonth]   = useState(11);
  const [endYear,    setEndYear]    = useState("2026");
  const [schedule,   setSchedule]   = useState({});
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);

  // ── Fetch dados do voluntário no mount ───────────────────────
  useEffect(() => {
    let cancelled = false;
    userService.getProfile(user.id)
      .then(data => {
        if (cancelled) return;

        const acts = [...(data.activities || [])];
        while (acts.length < 5) acts.push("");
        setActivities(acts.slice(0, 5));

        if (data.periodStart) {
          const [mm, yyyy] = data.periodStart.split('/');
          setStartMonth(parseInt(mm, 10) - 1);
          setStartYear(yyyy);
        }
        if (data.periodEnd) {
          const [mm, yyyy] = data.periodEnd.split('/');
          setEndMonth(parseInt(mm, 10) - 1);
          setEndYear(yyyy);
        }

        setSchedule(dbToMap(data.schedule));
      })
      .catch(() => {
        if (!cancelled) toast("Não foi possível carregar as atividades.", "⚠️");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [user.id]);

  // ── Handlers do período ──────────────────────────────────────
  const handleStartChange = (newMonth, newYear) => {
    const newStartTotal = toTotal(newYear, newMonth);
    const endTotal      = toTotal(endYear, endMonth);

    let newEndMonth = endMonth;
    let newEndYear  = endYear;

    if (endTotal < newStartTotal) {
      // Fim ficou antes do início: iguala ao início
      newEndMonth = newMonth;
      newEndYear  = newYear;
    } else if (endTotal > newStartTotal + 11) {
      // Fim excede 12 meses: recalcula
      const max = newStartTotal + 11;
      newEndYear  = String(Math.floor(max / 12));
      newEndMonth = max % 12;
    }

    setStartMonth(newMonth);
    setStartYear(newYear);
    setEndMonth(newEndMonth);
    setEndYear(newEndYear);
    setSchedule({});
  };

  const handleEndChange = (newMonth, newYear) => {
    const startTotal = toTotal(startYear, startMonth);
    const newTotal   = toTotal(newYear, newMonth);
    // Intervalo inválido: antes do início ou além de 12 meses
    if (newTotal < startTotal || newTotal > startTotal + 11) return;
    setEndMonth(newMonth);
    setEndYear(newYear);
    setSchedule({});
  };

  // ── Toggle de círculo no cronograma ─────────────────────────
  const toggleMonth = (row, col) => {
    setSchedule(s => {
      const curr = s[row] || [];
      const next = curr.includes(col)
        ? curr.filter(x => x !== col)
        : [...curr, col];
      return { ...s, [row]: next };
    });
  };

  // ── Salvar tudo ──────────────────────────────────────────────
  const salvar = async () => {
    setSaving(true);
    try {
      await userService.updateProfile(user.id, {
        activities,
        periodStart: `${String(startMonth + 1).padStart(2, '0')}/${startYear}`,
        periodEnd:   `${String(endMonth   + 1).padStart(2, '0')}/${endYear}`,
        schedule: mapToDb(schedule),
      });
      toast("Plano de trabalho salvo com sucesso!", "✅");
    } catch (err) {
      const msg = err.response?.data?.erro || "Erro ao salvar.";
      toast(msg, "❌");
    } finally {
      setSaving(false);
    }
  };

  // ── Derivados ────────────────────────────────────────────────
  const colCount  = Math.max(1, toTotal(endYear, endMonth) - toTotal(startYear, startMonth) + 1);
  const activeActs = activities.filter(a => a.trim() !== "");

  // Cabeçalhos dinâmicos: "Jan 2026", "Fev 2026", …
  const colHeaders = Array.from({ length: colCount }, (_, i) => {
    const t = toTotal(startYear, startMonth) + i;
    return `${MONTH_SHORT[t % 12]} ${Math.floor(t / 12)}`;
  });

  if (loading) {
    return (
      <div className="page-content">
        <Topbar user={user} title="Minhas Atividades" />
        <div className="content" style={{ textAlign: "center", paddingTop: "3rem" }}>
          Carregando atividades…
        </div>
      </div>
    );
  }

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

        {/* ── Síntese das atividades ─────────────────────── */}
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
              onClick={salvar}
              disabled={saving}
            >
              {saving ? "Salvando…" : "Salvar Atividades"}
            </button>
          </div>
        </div>

        {/* ── Cronograma de execução ─────────────────────── */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📅 Cronograma de Execução</div>
          </div>
          <div className="card-body">

            <div className="crono-period">
              <div>
                <label className="flabel">Início do Período</label>
                <div className="crono-selects">
                  <select
                    className="fselect fselect--sm"
                    value={startMonth}
                    onChange={e => handleStartChange(parseInt(e.target.value, 10), startYear)}
                  >
                    {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                  </select>
                  <select
                    className="fselect fselect--sm"
                    value={startYear}
                    onChange={e => handleStartChange(startMonth, e.target.value)}
                  >
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="flabel">Fim do Período</label>
                <div className="crono-selects">
                  <select
                    className="fselect fselect--sm"
                    value={endMonth}
                    onChange={e => handleEndChange(parseInt(e.target.value, 10), endYear)}
                  >
                    {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                  </select>
                  <select
                    className="fselect fselect--sm"
                    value={endYear}
                    onChange={e => handleEndChange(endMonth, e.target.value)}
                  >
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
                    {colHeaders.map((h, i) => (
                      <th key={i} className="crono-th--month">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeActs.length === 0 ? (
                    <tr>
                      <td colSpan={colCount + 1} style={{ textAlign: "center", color: "var(--muted)", padding: "1rem" }}>
                        Preencha ao menos uma atividade acima para montar o cronograma.
                      </td>
                    </tr>
                  ) : activeActs.map((_, ri) => (
                    <tr key={ri}>
                      <td className="crono-td--act">Atividade {String(ri + 1).padStart(2, "0")}</td>
                      {Array.from({ length: colCount }, (_, ci) => (
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
              <button
                className="btn btn-primary btn-sm"
                onClick={salvar}
                disabled={saving}
              >
                {saving ? "Salvando…" : "Salvar Cronograma"}
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
