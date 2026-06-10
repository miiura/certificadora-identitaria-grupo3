/* ═══════════════════════════════════════
   Modal de cadastro e edição de voluntário
   Usado tanto em GerenciarVols quanto no
   botão rápido do DashAdm
═══════════════════════════════════════ */
import { useState } from "react";
import { COURSES } from "../data/mockData";

export default function VolModal({ mode, initial = {}, onSave, onClose }) {
  const [f, setF] = useState({
    name: "", cpf: "", course: "", bond: "DISCENTE", status: "active",
    ...initial,
  });

  const s = (k, v) => setF(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (f.name && f.cpf) onSave(f);
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
          <div className="fg">
            <label className="flabel">Nome Completo *</label>
            <input
              className="finput finput--plain"
              value={f.name}
              onChange={e => s("name", e.target.value)}
              placeholder="Nome completo"
            />
          </div>

          <div className="fg2">
            <div className="fg">
              <label className="flabel">CPF *</label>
              <input
                className="finput finput--plain"
                value={f.cpf}
                onChange={e => s("cpf", e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="fg">
              <label className="flabel">Vínculo</label>
              <select
                className="fselect"
                value={f.bond}
                onChange={e => s("bond", e.target.value)}
              >
                {["DISCENTE", "DOCENTE", "EGRESSO", "TÉCNICO"].map(b => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="fg">
            <label className="flabel">Curso</label>
            <select
              className="fselect"
              value={f.course}
              onChange={e => s("course", e.target.value)}
            >
              <option value="">Selecione...</option>
              {COURSES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {mode === "new" ? "Cadastrar" : "Salvar Alterações"}
          </button>
        </div>

      </div>
    </div>
  );
}
