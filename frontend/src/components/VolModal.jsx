/* ═══════════════════════════════════════
   Modal de cadastro e edição de voluntário
   Usado tanto em GerenciarVols quanto no
   botão rápido do DashAdm
═══════════════════════════════════════ */
import { useState } from "react";
import { COURSES, PERIODS } from "../data/mockData";

export default function VolModal({ mode, initial = {}, onSave, onClose, loading = false }) {
  const [f, setF] = useState({
    name: "", email: "", cpf: "", password: "",
    phone: "", birthdate: "", nationality: "",
    bond: "DISCENTE", course: "", period: "", ra: "",
    address: "", city: "", state: "",
    status: "active",
    ...initial,
  });

  const s = (k, v) => setF(p => ({ ...p, [k]: v }));

  const isUtfpr = f.bond === "DISCENTE" || f.bond === "DOCENTE";

  const handleBirthdate = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    let masked = digits;
    if (digits.length > 4) masked = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
    else if (digits.length > 2) masked = digits.slice(0, 2) + '/' + digits.slice(2);
    s("birthdate", masked);
  };

  const handleSave = () => {
    if (!f.name || !f.cpf) return;
    if (mode === "new" && !f.email) return;
    onSave(f);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal-head">
          <div>
            <div className="modal-title">
              {mode === "new" ? "Novo Voluntário" : "Editar Voluntário"}
            </div>
            <div className="modal-sub">
              {mode === "new"
                ? "Preencha os dados do novo participante"
                : "Atualize os dados do voluntário"}
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
                value={f.cpf || ""}
                onChange={e => s("cpf", e.target.value)}
                placeholder="000.000.000-00"
                readOnly={mode === "edit"}
                disabled={mode === "edit"}
                title={mode === "edit" ? "Para alterar o CPF, acesse o perfil completo." : ""}
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

          {mode === "new" && (
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

          {/* ── Dados acadêmicos — apenas VOLUNTARIO (ou novo cadastro) ── */}
          {(mode === "new" || f.role === "VOLUNTARIO") && (
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
