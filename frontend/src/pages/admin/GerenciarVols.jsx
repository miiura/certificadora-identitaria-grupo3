/* ═══════════════════════════════════════
   Gerenciamento de Voluntários
═══════════════════════════════════════ */
import { useState } from "react";
import Topbar    from "../../components/Topbar";
import Avt       from "../../components/Avt";
import Badge     from "../../components/Badge";
import VolModal  from "../../components/VolModal";
import { uid }   from "../../data/mockData";

export default function GerenciarVols({
  user, volunteers, setVolunteers, toast, modalNew, setModalNew,
}) {
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState([]);
  const [editVol,  setEditVol]  = useState(null);

  const filtered = volunteers.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) || v.cpf.includes(search)
  );

  const toggleSelect = id =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const inativar = id => {
    setVolunteers(vs =>
      vs.map(v => v.id === id ? { ...v, status: v.status === "active" ? "inactive" : "active" } : v)
    );
    toast("Status do voluntário atualizado");
  };

  const excluir = id => {
    setVolunteers(vs => vs.filter(v => v.id !== id));
    toast("Voluntário excluído");
  };

  const salvarNovo = data => {
    setVolunteers(vs => [...vs, { ...data, id: uid(), status: "active" }]);
    setModalNew(false);
    toast("Voluntário cadastrado com sucesso!");
  };

  const salvarEdicao = data => {
    setVolunteers(vs => vs.map(v => v.id === data.id ? { ...v, ...data } : v));
    setEditVol(null);
    toast("Dados atualizados com sucesso!");
  };

  return (
    <div className="page-content">
      <Topbar user={user} title="Voluntários" />
      <div className="content">

        <div className="vols-header">
          <h2 className="page-title">Voluntários</h2>
          <p className="page-sub">Gerencie os participantes do projeto</p>
        </div>

        {/* Barra de busca */}
        <div className="vols-search-bar">
          <div className="search-wrap">
            <span className="search-icon">🔍︎</span>
            <input
              placeholder="Nome ou CPF"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-sm">Filtrar</button>
        </div>

        {/* Barra de seleção múltipla */}
        {selected.length > 0 && (
          <div className="vols-selection-bar">
            <span>{selected.length} voluntário(s) selecionado(s)</span>
            <div className="vols-selection-bar__actions">
              <button className="btn btn-outline btn-sm">Ver Informações</button>
              <button className="btn btn-outline btn-sm">Gerar Termo</button>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => { selected.forEach(inativar); setSelected([]); }}
              >
                Inativar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => { selected.forEach(excluir); setSelected([]); }}
              >
                Excluir
              </button>
            </div>
          </div>
        )}

        {/* Tabela */}
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={e => setSelected(e.target.checked ? filtered.map(v => v.id) : [])}
                    />
                  </th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Curso</th>
                  <th>Vínculo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id} className={selected.includes(v.id) ? "tr--selected" : ""}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(v.id)}
                        onChange={() => toggleSelect(v.id)}
                      />
                    </td>
                    <td>
                      <div className="td-name">
                        <Avt name={v.name} size={30} fontSize={11} />
                        {v.name}
                      </div>
                    </td>
                    <td className="td-muted">{v.cpf}</td>
                    <td className="td-muted">{v.course}</td>
                    <td>
                      <span className={`bond-tag bond-tag--${v.bond?.toLowerCase()}`}>
                        {v.bond}
                      </span>
                    </td>
                    <td><Badge status={v.status} /></td>
                    <td>
                      <div className="td-actions">
                        <button className="btn-icon" title="Editar" onClick={() => setEditVol(v)}>✎</button>
                        <button
                          className="btn-icon"
                          title={v.status === "active" ? "Inativar" : "Reativar"}
                          onClick={() => inativar(v.id)}
                        >
                          {v.status === "active" ? "⏸" : "▶"}
                        </button>
                        <button
                          className="btn-icon btn-icon--danger"
                          title="Excluir"
                          onClick={() => excluir(v.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>Exibindo {filtered.length} de {volunteers.length} voluntários</span>
            <div className="pagination">
              <button className="pg-btn">‹</button>
              <button className="pg-btn pg-btn--active">1</button>
              <button className="pg-btn">2</button>
              <button className="pg-btn">3</button>
              <button className="pg-btn">›</button>
            </div>
          </div>
        </div>

      </div>

      {modalNew && <VolModal mode="new"  onSave={salvarNovo}  onClose={() => setModalNew(false)} />}
      {editVol  && <VolModal mode="edit" initial={editVol} onSave={salvarEdicao} onClose={() => setEditVol(null)} />}
    </div>
  );
}
