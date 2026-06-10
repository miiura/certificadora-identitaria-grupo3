/* ═══════════════════════════════════════
  Perfil do voluntário
═══════════════════════════════════════ */
import { useState } from "react";
import logoEllp from "../../assets/mascote-ellp.png";
import Topbar from "../../components/Topbar";
import Avt from "../../components/Avt";
import { COURSES, PERIODS } from "../../data/mockData";

export default function PerfilVol({ user, setUser, toast }) {
  const [f, setF] = useState({ ...user });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));

  const isUtfpr = f.bond === "DISCENTE" || f.bond === "DOCENTE";

  const salvar = () => {
    const completo = f.name && f.cpf && f.birthdate && f.course && f.email;
    setUser({ ...f, complete: !!completo });
    toast("Perfil atualizado! Suas alterações foram salvas com sucesso.", "✅");
  };

  return (
    <div className="page-content">
      <Topbar user={user} title="Meu Perfil" />
      <div className="content">
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
                  <input className="finput finput--plain" value={f.name} onChange={e => s("name", e.target.value)} />
                </div>
                <div className="fg">
                  <label className="flabel">CPF</label>
                  <input className="finput finput--plain" value={f.cpf || ""} onChange={e => s("cpf", e.target.value)} placeholder="000.000.000-00" />
                </div>
              </div>

              <div className="fg2">
                <div className="fg">
                  <label className="flabel">Data de Nascimento</label>
                  <input className="finput finput--plain" value={f.birthdate || ""} onChange={e => s("birthdate", e.target.value)} placeholder="DD/MM/AAAA" />
                </div>
                <div className="fg">
                  <label className="flabel">Nacionalidade</label>
                  <input className="finput finput--plain" value={f.nationality || ""} onChange={e => s("nationality", e.target.value)} />
                </div>
              </div>

              <div className="section-divider">🎓 Dados Acadêmicos</div>

              <div className="fg perfil-utfpr-row">
                <label className="flabel">Aluno UTFPR?</label>
                <div className="radio-inline">
                  <label><input type="radio" checked={isUtfpr}  onChange={() => s("bond", "DISCENTE")} /> Sim</label>
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
                  <input className="finput finput--plain" value={f.address || ""} onChange={e => s("address", e.target.value)} placeholder="Rua, número" />
                </div>
                <div className="fg">
                  <label className="flabel">Cidade</label>
                  <input className="finput finput--plain" value={f.city || ""} onChange={e => s("city", e.target.value)} />
                </div>
              </div>

              <div className="fg2">
                <div className="fg">
                  <label className="flabel">Estado</label>
                  <input className="finput finput--plain" value={f.state || ""} onChange={e => s("state", e.target.value)} />
                </div>
                <div className="fg">
                  <label className="flabel">Telefone</label>
                  <input className="finput finput--plain" value={f.phone || ""} onChange={e => s("phone", e.target.value)} placeholder="(43) 99999-9999" />
                </div>
              </div>

              <div className="fg">
                <label className="flabel">Email</label>
                <input className="finput finput--plain" value={f.email || ""} onChange={e => s("email", e.target.value)} />
              </div>

              <div className="perfil-form-actions">
                <button className="btn btn-ghost" onClick={() => setF({ ...user })}>Descartar</button>
                <button className="btn btn-primary" onClick={salvar}>Salvar alterações</button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
