/* ═══════════════════════════════════════
   Gerenciamento de Voluntários
═══════════════════════════════════════ */
import { useState, useEffect, useRef } from "react";
import Topbar from "../../components/Topbar";
import Avt from "../../components/Avt";
import Badge from "../../components/Badge";
import VolModal from "../../components/VolModal";
import { userService } from "../../services/userService";
import { actionService } from "../../services/actionService";
import { fmtCpf } from "../../utils/masks";

const ROLE_LABEL = {
  ADMIN:       { label: "Admin",       cls: "bond-tag bond-tag--egresso" },
  COORDENADOR: { label: "Coordenador", cls: "bond-tag bond-tag--docente"  },
  VOLUNTARIO:  { label: "Voluntário",  cls: "bond-tag bond-tag--discente" },
};

const ROLE_OPTIONS = [
  { value: "VOLUNTARIO",  label: "Voluntário"  },
  { value: "COORDENADOR", label: "Coordenador" },
  { value: "ADMIN",       label: "Admin"       },
];

const MONTH_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const fmtPeriod = (str) => {
  if (!str) return "—";
  const [mm, yyyy] = str.split("/");
  const m = parseInt(mm, 10);
  return `${MONTH_SHORT[m - 1] || mm}/${yyyy}`;
};

export default function GerenciarVols({
  user, volunteers, setVolunteers, toast, modalNew, setModalNew,
}) {
  const [search,           setSearch]           = useState("");
  const [selected,         setSelected]         = useState(null); // single ID or null
  const [roleFilter,       setRoleFilter]       = useState(new Set(["VOLUNTARIO", "COORDENADOR", "ADMIN"]));
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef(null);

  const [editVol,  setEditVol]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);

  // Termo preview modal
  const [termoOpen,           setTermoOpen]           = useState(false);
  const [termoVol,            setTermoVol]            = useState(null);
  const [termoAction,         setTermoAction]         = useState(null);
  const [termoLoading,        setTermoLoading]        = useState(false);
  const [termoDownloading,    setTermoDownloading]    = useState(false);
  const [termoDownloadingPdf, setTermoDownloadingPdf] = useState(false);

  // Close role dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target))
        setRoleDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Derived label for role filter button
  const roleFilterLabel = roleFilter.size === 0 || roleFilter.size === 3
    ? "Todos"
    : [...roleFilter].map(r => ROLE_LABEL[r]?.label || r).join(", ");

  const toggleRoleFilter = (role) => {
    setRoleFilter(prev => {
      const next = new Set(prev);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return next;
    });
  };

  const filtered = volunteers.filter(v => {
    const matchSearch = (v.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.cpf || "").includes(search);
    const matchRole = roleFilter.size === 0 || roleFilter.size === 3 || roleFilter.has(v.role);
    return matchSearch && matchRole;
  });

  // ── Fetch list on mount ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    userService.listVolunteers()
      .then(data => { if (!cancelled) setVolunteers(data); })
      .catch(() => { if (!cancelled) toast("Não foi possível carregar a lista de voluntários.", "❌"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // ── Single selection (radio behavior, deselects on re-click) ─
  const toggleSelect = (id) => setSelected(prev => prev === id ? null : id);
  const selectedVol = selected ? volunteers.find(v => v.id === selected) : null;

  // Status toggle is local-only
  const inativar = (id) => {
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
      if (selected === id) setSelected(null);
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
      toast("Usuário cadastrado com sucesso!");
    } catch (err) {
      const msg = err.response?.data?.erro || "Erro ao cadastrar usuário.";
      toast(msg, "❌");
    } finally {
      setSaving(false);
    }
  };

  // ── Edit ─────────────────────────────────────────────────────
  const salvarEdicao = async (data) => {
    setSaving(true);
    try {
      const payload = {
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
      };
      if (data.role === "VOLUNTARIO") {
        payload.activities  = data.activities;
        payload.periodStart = data.periodStart;
        payload.periodEnd   = data.periodEnd;
        payload.schedule    = data.schedule;
      }
      const updated = await userService.updateProfile(data.id, payload);
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

  // ── Termo preview modal ───────────────────────────────────────
  const abrirTermo = async () => {
    if (!selected) return;
    setTermoOpen(true);
    setTermoLoading(true);
    setTermoVol(null);
    setTermoAction(null);
    try {
      const [volData, actionData] = await Promise.all([
        userService.getProfile(selected),
        actionService.getAction(),
      ]);
      setTermoVol(volData);
      setTermoAction(actionData);
    } catch {
      toast("Não foi possível carregar os dados do termo.", "❌");
      setTermoOpen(false);
    } finally {
      setTermoLoading(false);
    }
  };

  const exportarDocx = async () => {
    setTermoDownloading(true);
    try {
      await userService.downloadTermo(selected);
      toast("Termo exportado com sucesso!", "📄");
    } catch {
      toast("Erro ao exportar o termo.", "❌");
    } finally {
      setTermoDownloading(false);
    }
  };

  const exportarPdf = async () => {
    setTermoDownloadingPdf(true);
    try {
      await userService.downloadTermoPdf(selected);
      toast("PDF exportado com sucesso!", "📄");
    } catch (err) {
      const msg = err.response?.data?.erro || "Erro ao exportar o PDF.";
      toast(msg, "❌");
    } finally {
      setTermoDownloadingPdf(false);
    }
  };

  const termDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="page-content">
      <Topbar user={user} title="Voluntários" />
      <div className="content">

        <div className="vols-header">
          <h2 className="page-title">Voluntários</h2>
          <p className="page-sub">Gerencie os participantes do projeto</p>
        </div>

        {/* Barra de busca + filtro de cargo */}
        <div className="vols-search-bar">
          <div className="search-wrap">
            <span className="search-icon">🔍︎</span>
            <input
              placeholder="Nome ou CPF"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Role filter dropdown */}
          <div ref={roleDropdownRef} style={{ position: "relative" }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setRoleDropdownOpen(o => !o)}
              style={{ whiteSpace: "nowrap" }}
            >
              Cargo: {roleFilterLabel} ▾
            </button>
            {roleDropdownOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", right: 0,
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "8px 12px", zIndex: 200, minWidth: 160,
                boxShadow: "0 4px 16px rgba(0,0,0,.12)",
              }}>
                {ROLE_OPTIONS.map(({ value, label }) => (
                  <label key={value} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "4px 0", cursor: "pointer", fontSize: "0.875rem",
                  }}>
                    <input
                      type="checkbox"
                      checked={roleFilter.has(value)}
                      onChange={() => toggleRoleFilter(value)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            )}
          </div>

          <button className="btn btn-primary btn-sm">Filtrar</button>
        </div>

        {/* Barra de seleção única */}
        {selected && (
          <div className="vols-selection-bar">
            <span>{selectedVol ? `${selectedVol.name} selecionado(a)` : "1 usuário selecionado"}</span>
            <div className="vols-selection-bar__actions">
              <button className="btn btn-outline btn-sm" onClick={() => selectedVol && setEditVol(selectedVol)}>
                Editar
              </button>
              <button className="btn btn-outline btn-sm" onClick={abrirTermo}>
                Gerar Termo
              </button>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => { inativar(selected); setSelected(null); }}
              >
                Inativar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => excluir(selected)}
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
                    <th style={{ width: 36 }} />
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
                    <tr key={v.id} className={selected === v.id ? "tr--selected" : ""}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected === v.id}
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
                      <td className="td-muted">{fmtCpf(v.cpf)}</td>
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

      {/* Modais de criação e edição */}
      {modalNew && (
        <VolModal mode="new" onSave={salvarNovo} onClose={() => setModalNew(false)} loading={saving} />
      )}
      {editVol && (
        <VolModal mode="edit" initial={editVol} onSave={salvarEdicao} onClose={() => setEditVol(null)} loading={saving} />
      )}

      {/* Modal de pré-visualização do termo */}
      {termoOpen && (
        <div className="overlay" onClick={() => setTermoOpen(false)}>
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 760, maxHeight: "90vh", display: "flex", flexDirection: "column" }}
          >
            <div className="modal-head">
              <div>
                <div className="modal-title">Pré-visualização do Termo</div>
                <div className="modal-sub">{selectedVol?.name}</div>
              </div>
              <button className="btn-x" onClick={() => setTermoOpen(false)}>×</button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", flex: 1 }}>
              {termoLoading ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)" }}>
                  Carregando dados do termo…
                </div>
              ) : (
                <TermoPreview vol={termoVol} action={termoAction} termDate={termDate} />
              )}
            </div>

            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setTermoOpen(false)}>Fechar</button>
              <button
                className="btn btn-orange"
                onClick={exportarDocx}
                disabled={termoDownloading || termoDownloadingPdf || termoLoading}
              >
                {termoDownloading ? "Exportando…" : "⬇ Exportar .docx"}
              </button>
              <button
                className="btn btn-primary"
                onClick={exportarPdf}
                disabled={termoDownloading || termoDownloadingPdf || termoLoading}
              >
                {termoDownloadingPdf ? "Gerando PDF…" : "⬇ Exportar .pdf"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Read-only preview usada dentro do modal ───────────────────────
function TermoPreview({ vol, action, termDate }) {
  if (!vol || !action) return null;
  const coord      = action?.coordinator;
  const activities = (vol?.activities || []).filter(a => a?.trim());

  return (
    <div className="termo-doc__inner">
      <h2 className="termo-title">TERMO DE ADESÃO PARA VOLUNTÁRIO(A)</h2>
      <p className="termo-subtitle">
        Universidade Tecnológica Federal do Paraná — UTFPR · Campus: Cornélio Procópio
      </p>

      <div className="termo-section">
        <div className="termo-section__title">Dados da Ação</div>
        <table className="termo-table">
          <tbody>
            <tr><td className="termo-table__lbl">Título da ação</td><td>{action?.title || "—"}</td></tr>
            <tr><td className="termo-table__lbl">Modalidade</td><td>{action?.modality || "—"}</td></tr>
            <tr>
              <td className="termo-table__lbl">Vigência</td>
              <td>{fmtPeriod(action?.validity?.start)} – {fmtPeriod(action?.validity?.end)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="termo-section">
        <div className="termo-section__title">Dados da Coordenação da Ação</div>
        <table className="termo-table">
          <tbody>
            <tr><td className="termo-table__lbl">Nome</td><td>{coord?.name || "—"}</td></tr>
            <tr><td className="termo-table__lbl">CPF</td><td>{coord?.cpf || "—"}</td></tr>
            <tr><td className="termo-table__lbl">Departamento</td><td>{coord?.coordinatorData?.department || "—"}</td></tr>
            <tr><td className="termo-table__lbl">Telefone</td><td>{coord?.phone || "—"}</td></tr>
            <tr><td className="termo-table__lbl">E-mail</td><td>{coord?.email || "—"}</td></tr>
          </tbody>
        </table>
      </div>

      <div className="termo-section">
        <div className="termo-section__title">Dados do(a) Voluntário(a)</div>
        <table className="termo-table">
          <tbody>
            <tr><td className="termo-table__lbl">Nome Completo</td><td>{vol?.name || "—"}</td></tr>
            <tr><td className="termo-table__lbl">Data de Nascimento</td><td>{vol?.birthdate || "—"}</td></tr>
            <tr><td className="termo-table__lbl">CPF</td><td>{vol?.cpf || "—"}</td></tr>
            <tr><td className="termo-table__lbl">Curso</td><td>{vol?.course || "—"}</td></tr>
            <tr><td className="termo-table__lbl">Período</td><td>{vol?.period || "—"}</td></tr>
            <tr><td className="termo-table__lbl">RA</td><td>{vol?.ra || "—"}</td></tr>
            <tr>
              <td className="termo-table__lbl">Endereço</td>
              <td>{[vol?.address, vol?.city, vol?.state].filter(Boolean).join(", ") || "—"}</td>
            </tr>
            <tr><td className="termo-table__lbl">Telefone</td><td>{vol?.phone || "—"}</td></tr>
            <tr><td className="termo-table__lbl">E-mail</td><td>{vol?.email || "—"}</td></tr>
          </tbody>
        </table>
      </div>

      <div className="termo-section">
        <div className="termo-section__title">Síntese das Atividades</div>
        {activities.length === 0 ? (
          <p className="termo-missing">Nenhuma atividade cadastrada.</p>
        ) : activities.map((a, i) => (
          <div key={i} className="termo-activity">• {a};</div>
        ))}
      </div>

      <div className="termo-section">
        <div className="termo-section__title">Cronograma das Atividades</div>
        <div className="termo-project-row" style={{ marginBottom: 8 }}>
          <div>
            <span className="termo-lbl">Início do Período:</span><br />
            <span className="termo-val">{fmtPeriod(vol?.periodStart)}</span>
          </div>
          <div>
            <span className="termo-lbl">Fim do Período:</span><br />
            <span className="termo-val">{fmtPeriod(vol?.periodEnd)}</span>
          </div>
        </div>
        {vol?.schedule?.length > 0 && activities.length > 0 ? (
          <div className="crono-table-wrap" style={{ marginTop: 8 }}>
            <table className="crono-table">
              <thead>
                <tr>
                  <th className="crono-th--act">Atividade</th>
                  {Array.from({ length: 12 }, (_, i) => (
                    <th key={i} className="crono-th--month">{i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activities.slice(0, 4).map((_, ri) => {
                  const entry  = vol.schedule.find(s => s.activityIndex === ri);
                  const months = new Set(entry?.months || []);
                  return (
                    <tr key={ri}>
                      <td className="crono-td--act">Ativ. {ri + 1}</td>
                      {Array.from({ length: 12 }, (_, ci) => (
                        <td key={ci} className="crono-td--circle">
                          {months.has(ci) ? <span style={{ fontWeight: "bold" }}>X</span> : null}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Cronograma não preenchido.</p>
        )}
      </div>

      <div className="termo-footer">Local: Cornélio Procópio — {termDate}</div>
    </div>
  );
}
