/* ═══════════════════════════════════════
   Gerenciamento de Voluntários
═══════════════════════════════════════ */
import { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import Avt from "../../components/Avt";
import Badge from "../../components/Badge";
import VolModal from "../../components/VolModal";
import { userService } from "../../services/userService";

const ROLE_LABEL = {
  ADMIN:       { label: "Admin",       cls: "bond-tag bond-tag--egresso" },
  COORDENADOR: { label: "Coordenador", cls: "bond-tag bond-tag--docente"  },
  VOLUNTARIO:  { label: "Voluntário",  cls: "bond-tag bond-tag--discente" },
};

export default function GerenciarVols({
  user, volunteers, setVolunteers, toast, modalNew, setModalNew,
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [editVol, setEditVol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const filtered = volunteers.filter(v =>
    (v.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (v.cpf || "").includes(search)
  );

  // ── Fetch list on mount ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    userService.listVolunteers()
      .then(data => {
        if (!cancelled) setVolunteers(data);
      })
      .catch(() => {
        if (!cancelled) toast("Não foi possível carregar a lista de voluntários.", "❌");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const toggleSelect = id =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  // Status toggle is local-only (no backend status field yet)
  const inativar = id => {
    setVolunteers(vs =>
      vs.map(v => v.id === id ? { ...v, status: v.status === "active" ? "inactive" : "active" } : v)
    );
    toast("Status do voluntário atualizado");
  };

  // ── Delete ───────────────────────────────────────────────────
  const excluir = async (id) => {
    try {
      await userService.deleteVolunteer(id);
      setVolunteers(vs => vs.filter(v => v.id !== id));
      setSelected(s => s.filter(x => x !== id));
      toast("Voluntário excluído com sucesso.");
    } catch (err) {
      const msg = err.response?.data?.erro || "Erro ao excluir voluntário.";
      toast(msg, "❌");
    }
  };

  // ── Create ───────────────────────────────────────────────────
  const salvarNovo = async (data) => {
    setSaving(true);
    try {
      const novo = await userService.createVolunteer(data);
      setVolunteers(vs => [...vs, novo]);
      setModalNew(false);
      toast("Voluntário cadastrado com sucesso!");
    } catch (err) {
      const msg = err.response?.data?.erro || "Erro ao cadastrar voluntário.";
      toast(msg, "❌");
    } finally {
      setSaving(false);
    }
  };

  // ── Edit ─────────────────────────────────────────────────────
  const salvarEdicao = async (data) => {
    setSaving(true);
    try {
      const updated = await userService.updateProfile(data.id, {
        name:        data.name,
        phone:       data.phone,
        birthdate:   data.birthdate,
        nationality: data.nationality,
        bond:        data.bond,
        course:      data.course,
        period:      data.period,
        ra:          data.ra,
        address:     data.address,
        city:        data.city,
        state:       data.state,
        department:  data.department,
      });
      setVolunteers(vs => vs.map(v => v.id === updated.id ? { ...v, ...updated } : v));
      setEditVol(null);
      toast("Dados atualizados com sucesso!");
    } catch (err) {
      const msg = err.response?.data?.erro || "Erro ao atualizar voluntário.";
      toast(msg, "❌");
    } finally {
      setSaving(false);
    }
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
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>Carregando voluntários…</div>
          ) : (
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
                    <th>Cargo</th>
                    <th>CPF</th>
                    <th>Curso</th>
                    <th>Vínculo</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", color: "var(--muted)" }}>
                        Nenhum voluntário encontrado.
                      </td>
                    </tr>
                  ) : filtered.map(v => (
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
                      <td>
                        {v.role && (
                          <span className={(ROLE_LABEL[v.role] || ROLE_LABEL.VOLUNTARIO).cls}>
                            {(ROLE_LABEL[v.role] || { label: v.role }).label}
                          </span>
                        )}
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
          )}

          <div className="table-footer">
            <span>Exibindo {filtered.length} de {volunteers.length} usuários</span>
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

      {modalNew && <VolModal mode="new" onSave={salvarNovo} onClose={() => setModalNew(false)} loading={saving} />}
      {editVol && <VolModal mode="edit" initial={editVol} onSave={salvarEdicao} onClose={() => setEditVol(null)} loading={saving} />}
    </div>
  );
}
