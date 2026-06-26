/* ═══════════════════════════════════════
  Dados da Ação Extensionista
═══════════════════════════════════════ */
import { useState, useEffect } from "react";
import logoEllp from "../../assets/mascote-ellp.png";
import Topbar  from "../../components/Topbar";
import Badge   from "../../components/Badge";
import { actionService } from "../../services/actionService";

const EMPTY = { title: "", modality: "Projeto", validity: { start: "", end: "" } };

export default function DadosAcao({ user, setProject, toast, volunteers }) {
  const [f, setF]           = useState(EMPTY);
  const [original, setOriginal] = useState(EMPTY);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  const s = (k, v) => setF(p => ({ ...p, [k]: v }));

  const ativos = volunteers.filter(v => v.status === "active").length;

  // ── Fetch on mount ───────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    actionService.getAction()
      .then(data => {
        if (cancelled) return;
        setF(data);
        setOriginal(data);
      })
      .catch(() => {
        if (cancelled) return;
        toast("Não foi possível carregar os dados da ação.", "⚠️");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // ── MM/YYYY mask for validity inputs ─────────────────────────
  const handleValidity = (key, raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 6);
    const masked = digits.length > 2
      ? digits.slice(0, 2) + '/' + digits.slice(2)
      : digits;
    setF(p => ({ ...p, validity: { ...p.validity, [key]: masked } }));
  };

  // ── Save ─────────────────────────────────────────────────────
  const salvar = async () => {
    setSaving(true);
    try {
      const updated = await actionService.updateAction({
        title:    f.title,
        modality: f.modality,
        validity: f.validity,
      });
      setOriginal(updated);
      setF(updated);
      if (setProject) setProject(updated);
      toast("Dados da ação salvos com sucesso!", "✅");
    } catch (err) {
      const msg = err.response?.data?.erro || "Erro ao salvar dados da ação.";
      toast(msg, "❌");
    } finally {
      setSaving(false);
    }
  };

  // Derive next-renewal year from validity.end ("MM/YYYY")
  const endParts = (f?.validity?.end || "").split("/");
  const nextYear = endParts[1] ? parseInt(endParts[1], 10) + 1 : "—";

  if (loading) {
    return (
      <div className="page-content">
        <Topbar user={user} title="Dados da Ação" />
        <div className="content" style={{ textAlign: "center", paddingTop: "3rem" }}>
          Carregando dados da ação…
        </div>
      </div>
    );
  }

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
                  value={f.title || ""}
                  onChange={e => s("title", e.target.value)}
                  placeholder="Ex: ELLP"
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
                  <input
                    className="finput finput--plain fselect--sm"
                    value={f.validity?.start || ""}
                    onChange={e => handleValidity("start", e.target.value)}
                    placeholder="MM/AAAA"
                    maxLength={7}
                  />
                  <span className="vigencia-arrow">→</span>
                  <input
                    className="finput finput--plain fselect--sm"
                    value={f.validity?.end || ""}
                    onChange={e => handleValidity("end", e.target.value)}
                    placeholder="MM/AAAA"
                    maxLength={7}
                  />
                </div>
              </div>

              <div className="modal-foot" style={{ borderTop: "none", paddingLeft: 0 }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => setF({ ...original })}
                  disabled={saving}
                >
                  Descartar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={salvar}
                  disabled={saving}
                >
                  {saving ? "Salvando…" : "Salvar alterações"}
                </button>
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
                <span className="acao-status-val">Jan {nextYear}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
