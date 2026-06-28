/* ═══════════════════════════════════════
   Perfil do admin
═══════════════════════════════════════ */
import { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import Avt from "../../components/Avt";
import { userService } from "../../services/userService";
import { digits, fmtCpf, fmtPhone } from "../../utils/masks";

export default function PerfilAdm({ user, setUser, toast }) {
  const [f, setF] = useState(null);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const s = (k, v) => setF(p => ({ ...p, [k]: v }));

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
        const fallback = { ...user };
        setF(fallback);
        setOriginal(fallback);
        toast("Não foi possível carregar o perfil completo.", "⚠️");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [user.id]);

  // ── Birthdate auto-mask: "01012000" → "01/01/2000" ──────────
  const handleBirthdate = (raw) => {
    const d = raw.replace(/\D/g, '').slice(0, 8);
    let masked = d;
    if (d.length > 4) masked = d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4);
    else if (d.length > 2) masked = d.slice(0, 2) + '/' + d.slice(2);
    s("birthdate", masked);
  };

  // ── Save changes ─────────────────────────────────────────────
  const salvar = async () => {
    if (!f) return;
    setSaving(true);
    try {
      const updated = await userService.updateProfile(user.id, {
        name: f.name,
        phone: f.phone,
        birthdate: f.birthdate,
        nationality: f.nationality,
        address: f.address,
        city: f.city,
        state: f.state,
        ...(f.role === 'COORDENADOR' ? { department: f.department } : {}),
      });

      setOriginal(updated);
      setF(updated);

      setUser(prev => ({
        ...prev,
        name: updated.name,
        avatar: updated.name
          .split(" ")
          .map(w => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      }));

      toast("Perfil atualizado com sucesso!", "✅");
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

        <div className="breadcrumb">
          <span>Administrador</span>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__cur">Meu Perfil</span>
        </div>

        <div className="perfil-adm-grid">

          {/* ── Card de avatar ── */}
          <div className="card perfil-adm-avatar-card">
            <Avt name={f.name || "?"} size={80} fontSize={28} />
            <div className="perfil-adm-name">{f.name || "—"}</div>
            <div className="perfil-adm-role">Administrador</div>
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

          {/* ── Formulário ── */}
          <div>
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">👤 Dados do Administrador</div>
                  <div className="card-sub">
                    Gerencie suas informações pessoais e de contato.
                  </div>
                </div>
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

                <div className="fg2">
                  <div className="fg">
                    <label className="flabel">CPF</label>
                    <input
                      className="finput finput--plain"
                      value={fmtCpf(f.cpf)}
                      readOnly
                      disabled
                      title="O CPF não pode ser alterado. Entre em contato com o suporte."
                    />
                  </div>
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
                </div>

                <div className="fg2">
                  <div className="fg">
                    <label className="flabel">E-mail</label>
                    <input
                      className="finput finput--plain"
                      value={f.email || ""}
                      readOnly
                      disabled
                      title="Para alterar o e-mail, entre em contato com o suporte."
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

                {f?.role === 'COORDENADOR' && (
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

                <div className="perfil-adm-actions">
                  {/* <button
                    className="btn btn-ghost"
                    onClick={() => setF({ ...original })}
                    disabled={saving}
                  >
                    Descartar
                  </button> */}
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

            <div className="perfil-adm-security">
              <span>ℹ</span>
              <div>
                <div className="perfil-adm-security__title">Segurança da Conta</div>
                <p className="perfil-adm-security__sub">
                  Para alterar seu CPF ou e-mail, entre em contato com o suporte técnico da universidade.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
