/* ═══════════════════════════════════════
  Perfil do voluntário
═══════════════════════════════════════ */
import { useState, useEffect } from "react";
import logoEllp from "../../assets/mascote-ellp.png";
import Topbar from "../../components/Topbar";
import Avt from "../../components/Avt";
import { COURSES, PERIODS } from "../../data/mockData";
import { userService } from "../../services/userService";

export default function PerfilVol({ user, setUser, toast }) {
  const [f, setF]           = useState(null);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  const s = (k, v) => setF(p => ({ ...p, [k]: v }));

  const isAdmin = user.role === "admin";

  // ── Fetch full profile on mount ──────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    userService.getProfile(user.id)
      .then(data => {
        if (cancelled) return;
        setF(data);
        setOriginal(data);
      })
      .catch(() => {
        if (cancelled) return;
        // Fallback: use whatever came from the auth token
        const fallback = { ...user, bond: "DISCENTE" };
        setF(fallback);
        setOriginal(fallback);
        toast("Não foi possível carregar o perfil completo.", "⚠️");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [user.id]);

  const isUtfpr = f && (f.bond === "DISCENTE" || f.bond === "DOCENTE");

  // ── Birthdate auto-mask: "01012000" → "01/01/2000" ──────────
  const handleBirthdate = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    let masked = digits;
    if (digits.length > 4) masked = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
    else if (digits.length > 2) masked = digits.slice(0, 2) + '/' + digits.slice(2);
    s("birthdate", masked);
  };

  // ── Save changes ─────────────────────────────────────────────
  const salvar = async () => {
    if (!f) return;
    setSaving(true);
    try {
      const updated = await userService.updateProfile(user.id, {
        name:        f.name,
        phone:       f.phone,
        birthdate:   f.birthdate,
        nationality: f.nationality,
        bond:        f.bond,
        course:      f.course,
        period:      f.period,
        ra:          f.ra,
        address:     f.address,
        city:        f.city,
        state:       f.state,
      });

      setOriginal(updated);
      setF(updated);

      // Sync name/avatar back into the top-level auth state so the Topbar updates
      setUser({
        name: updated.name,
        avatar: updated.name
          .split(" ")
          .map(w => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      });

      toast("Perfil atualizado! Suas alterações foram salvas com sucesso.", "✅");
    } catch (err) {
      const msg = err.response?.data?.erro || "Erro ao salvar alterações.";
      toast(msg, "❌");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-content">
        <Topbar user={user} title="Meu Perfil" />
        <div className="content" style={{ textAlign: "center", paddingTop: "3rem" }}>
          Carregando perfil…
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Topbar user={user} title="Meu Perfil" />
      <div className="content">

        {/* ── Admin banner (shown when an admin views this page) ── */}
        {isAdmin && (
          <div className="info-banner info-banner--warn" style={{ marginBottom: "1rem" }}>
            <span>🛡️</span>
            <span>Você está visualizando este perfil como <strong>Administrador</strong>. Alterações aqui afetam diretamente o cadastro do voluntário.</span>
          </div>
        )}

        <div className="perfil-grid">

          {/* ── Coluna esquerda ── */}
          <div className="perfil-left">

            <div className="card perfil-avatar-card">
              <div className="perfil-avatar-wrap">
                <Avt name={f.name || "?"} size={80} fontSize={28} />
              </div>
              <div className="perfil-avatar-name">{f.name || "—"}</div>
            </div>

            <div className="card perfil-status-card">
              <div className="perfil-status-title">Status do Voluntariado</div>
              <div className="perfil-status-badge">
                <span className="dot dot--on" /> Ativo
              </div>
              <p className="perfil-status-desc">
                Suas informações acadêmicas são usadas para a emissão automática de termos
                e certificados. Mantenha-as sempre atualizadas.
              </p>

              <div className="perfil-mascot-wrap">
                <div className="perfil-mascot">
                  <img src={logoEllp} alt="ELLP Logo" className="perfil-mascot-img" />
                </div>
                <p className="perfil-mascot__title">Precisa de ajuda?</p>
                <p className="perfil-mascot__sub">
                  Se houver erros nos seus dados que não podem ser alterados, entre em
                  contato com o coordenador do projeto.
                </p>
              </div>

              <button
                className="btn btn-orange btn-block"
                onClick={() => toast("Termo sendo gerado...", "📄")}
              >
                📄 Gerar Termo de Voluntariado
              </button>
            </div>

          </div>

          {/* ── Coluna direita: formulário ── */}
          <div className="card perfil-form-card">
            <div className="card-header">
              <div className="card-title">👤 Informações Pessoais</div>
            </div>
            <div className="card-body">

              <div className="fg2">
                <div className="fg">
                  <label className="flabel">Nome Completo</label>
                  <input
                    className="finput finput--plain"
                    value={f.name || ""}
                    onChange={e => s("name", e.target.value)}
                  />
                </div>
                <div className="fg">
                  <label className="flabel">CPF</label>
                  {/* CPF is sensitive — volunteers cannot edit it; admins can */}
                  <input
                    className="finput finput--plain"
                    value={f.cpf || ""}
                    readOnly={!isAdmin}
                    disabled={!isAdmin}
                    onChange={e => s("cpf", e.target.value)}
                    title={isAdmin ? "" : "O CPF não pode ser alterado. Entre em contato com o suporte."}
                  />
                </div>
              </div>

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
                  />
                </div>
              </div>

              <div className="section-divider">🎓 Dados Acadêmicos</div>

              <div className="fg perfil-utfpr-row">
                <label className="flabel">Aluno UTFPR?</label>
                <div className="radio-inline">
                  <label><input type="radio" checked={!!isUtfpr}  onChange={() => s("bond", "DISCENTE")} /> Sim</label>
                  <label><input type="radio" checked={!isUtfpr} onChange={() => s("bond", "EGRESSO")}  /> Não</label>
                </div>
              </div>

              <div className="fg2">
                <div className="fg">
                  <label className="flabel">Curso</label>
                  <select className="fselect" value={f.course || ""} onChange={e => s("course", e.target.value)}>
                    <option value="">Selecione...</option>
                    {COURSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label className="flabel">Período</label>
                  <select className="fselect" value={f.period || ""} onChange={e => s("period", e.target.value)}>
                    <option value="">Selecione...</option>
                    {PERIODS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {isUtfpr && (
                <div className="fg">
                  <label className="flabel">RA (Registro Acadêmico)</label>
                  <input
                    className={`finput finput--plain${!f.ra ? " finput--error" : ""}`}
                    value={f.ra || ""}
                    onChange={e => s("ra", e.target.value)}
                    placeholder="Ex: 2123456"
                  />
                  {!f.ra && <span className="finput-error-msg">O RA é obrigatório para alunos UTFPR</span>}
                </div>
              )}

              <div className="section-divider">📞 Informações de Contato</div>

              <div className="fg2">
                <div className="fg">
                  <label className="flabel">Endereço</label>
                  <input
                    className="finput finput--plain"
                    value={f.address || ""}
                    onChange={e => s("address", e.target.value)}
                    placeholder="Rua, número"
                  />
                </div>
                <div className="fg">
                  <label className="flabel">Cidade</label>
                  <input
                    className="finput finput--plain"
                    value={f.city || ""}
                    onChange={e => s("city", e.target.value)}
                  />
                </div>
              </div>

              <div className="fg2">
                <div className="fg">
                  <label className="flabel">Estado</label>
                  <input
                    className="finput finput--plain"
                    value={f.state || ""}
                    onChange={e => s("state", e.target.value)}
                  />
                </div>
                <div className="fg">
                  <label className="flabel">Telefone</label>
                  <input
                    className="finput finput--plain"
                    value={f.phone || ""}
                    onChange={e => s("phone", e.target.value)}
                    placeholder="(43) 99999-9999"
                  />
                </div>
              </div>

              <div className="fg">
                <label className="flabel">Email</label>
                {/* Email changes require re-verification — volunteers cannot edit it */}
                <input
                  className="finput finput--plain"
                  value={f.email || ""}
                  readOnly
                  disabled
                  title="Para alterar o e-mail, entre em contato com o suporte."
                />
              </div>

              <div className="perfil-form-actions">
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

        </div>
      </div>
    </div>
  );
}
