/* ═══════════════════════════════════════
   Geração de termo de voluntariado
═══════════════════════════════════════ */
import { useState, useEffect } from "react";
import logoEllp from "../../assets/mascote-ellp.png";
import Topbar from "../../components/Topbar";
import { userService } from "../../services/userService";
import { actionService } from "../../services/actionService";

const MONTH_SHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// Formats "MM/YYYY" → "Mmm/YYYY"
const fmtPeriod = (str) => {
  if (!str) return "—";
  const [mm, yyyy] = str.split("/");
  const m = parseInt(mm, 10);
  return `${MONTH_SHORT[m - 1] || mm}/${yyyy}`;
};

// Returns REQUIRED_FIELDS that are missing in the profile
const REQUIRED = ["name", "cpf", "birthdate", "phone", "course", "ra", "address"];
const missingFields = (vol) => REQUIRED.filter(k => !vol[k]);

export default function GerarTermo({ user, toast }) {
  const [vol, setVol] = useState(null);
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const termDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  // ── Fetch volunteer profile + action data ──────────────────
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      userService.getProfile(user.id),
      actionService.getAction(),
    ])
      .then(([volData, actionData]) => {
        if (cancelled) return;
        setVol(volData);
        setAction(actionData);
      })
      .catch(() => {
        if (!cancelled) toast("Não foi possível carregar os dados do termo.", "⚠️");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user.id]);

  // ── Downloads ──────────────────────────────────────────────
  const baixarTermo = async () => {
    setDownloading(true);
    try {
      await userService.downloadTermo();
      toast("Termo gerado com sucesso!", "📄");
    } catch {
      toast("Erro ao gerar o termo. Verifique seus dados.", "❌");
    } finally {
      setDownloading(false);
    }
  };

  const baixarTermoPdf = async () => {
    setDownloadingPdf(true);
    try {
      await userService.downloadTermoPdf();
      toast("PDF gerado com sucesso!", "📄");
    } catch (err) {
      const msg = err.response?.data?.erro || "Erro ao gerar o PDF.";
      toast(msg, "❌");
    } finally {
      setDownloadingPdf(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-content">
        <Topbar user={user} title="Gerar Termo de Voluntariado" />
        <div className="content" style={{ textAlign: "center", paddingTop: "3rem" }}>
          Carregando dados do termo…
        </div>
      </div>
    );
  }

  const missing = vol ? missingFields(vol) : REQUIRED;
  const coord = action?.coordinator;
  const activities = (vol?.activities || []).filter(a => a?.trim());

  return (
    <div className="page-content">
      <Topbar user={user} title="Gerar Termo de Voluntariado" />
      <div className="content">

        {missing.length > 0 && (
          <div className="alert alert--warning">
            <span>⚠</span>
            <div>
              <strong>Campos Pendentes</strong>
              <div>
                Seu perfil ainda possui informações incompletas ({missing.join(", ")}).
                Complete os dados no seu perfil para que o termo seja gerado com validade jurídica.
              </div>
            </div>
          </div>
        )}

        <div className="termo-layout">

          {/* ── Preview do documento ──────────────────────── */}
          <div className="termo-doc card">
            <div className="termo-doc__inner">
              <h2 className="termo-title">TERMO DE ADESÃO PARA VOLUNTÁRIO(A)</h2>
              <p className="termo-subtitle">
                Universidade Tecnológica Federal do Paraná — UTFPR · Campus: Cornélio Procópio
              </p>

              {/* 1. Dados da Ação */}
              <div className="termo-section">
                <div className="termo-section__title">Dados da Ação</div>
                <table className="termo-table">
                  <tbody>
                    <tr>
                      <td className="termo-table__lbl">Título da ação</td>
                      <td>{action?.title || "—"}</td>
                    </tr>
                    <tr>
                      <td className="termo-table__lbl">Modalidade</td>
                      <td>{action?.modality || "—"}</td>
                    </tr>
                    <tr>
                      <td className="termo-table__lbl">Vigência</td>
                      <td>
                        {fmtPeriod(action?.validity?.start)} – {fmtPeriod(action?.validity?.end)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 2. Dados da Coordenação */}
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

              {/* 3. Dados do Voluntário */}
              <div className="termo-section">
                <div className="termo-section__title">Dados do(a) Voluntário(a)</div>
                <table className="termo-table">
                  <tbody>
                    <tr><td className="termo-table__lbl">Nome Completo</td><td>{vol?.name || "—"}</td></tr>
                    <tr><td className="termo-table__lbl">Data de Nascimento</td><td>{vol?.birthdate || "—"}</td></tr>
                    <tr>
                      <td className="termo-table__lbl">CPF</td>
                      <td className={!vol?.cpf ? "termo-missing" : ""}>{vol?.cpf || "Não informado"}</td>
                    </tr>
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

              {/* 4. Síntese das atividades */}
              <div className="termo-section">
                <div className="termo-section__title">Síntese das Atividades</div>
                {activities.length === 0 ? (
                  <p className="termo-missing">Nenhuma atividade cadastrada.</p>
                ) : activities.map((a, i) => (
                  <div key={i} className="termo-activity">• {a};</div>
                ))}
              </div>

              {/* 5. Cronograma */}
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
                {(vol?.schedule?.length > 0 && activities.length > 0) ? (
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
                          const entry = vol.schedule.find(s => s.activityIndex === ri);
                          const months = new Set(entry?.months || []);
                          return (
                            <tr key={ri}>
                              <td className="crono-td--act">Ativ. {ri + 1}</td>
                              {Array.from({ length: 12 }, (_, ci) => (
                                <td key={ci} className="crono-td--circle">
                                  {months.has(ci)
                                    ? <span style={{ fontWeight: "bold" }}>X</span>
                                    : null}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                    Cronograma não preenchido.
                  </p>
                )}
              </div>

              <div className="termo-footer">
                Local: Cornélio Procópio — {termDate}
              </div>
            </div>
          </div>

          {/* ── Ações laterais ───────────────────────────── */}
          <div className="termo-actions">

            <div className="card termo-actions-card">
              <div className="card-header">
                <div className="card-title">Ações do Termo</div>
              </div>
              <div className="card-body">
                <p className="termo-actions__desc">
                  Revise todos os dados antes de realizar o download. O arquivo DOCX será
                  gerado a partir do modelo oficial da UTFPR com as suas informações atuais.
                </p>
                <button
                  className="btn btn-orange btn-block"
                  onClick={baixarTermo}
                  disabled={downloading || downloadingPdf}
                >
                  {downloading ? "Gerando…" : "⬇ Exportar (.docx)"}
                </button>
                <button
                  className="btn btn-primary btn-block"
                  onClick={baixarTermoPdf}
                  disabled={downloading || downloadingPdf}
                  style={{ marginTop: 8 }}
                >
                  {downloadingPdf ? "Gerando PDF…" : "⬇ Exportar (.pdf)"}
                </button>
                <div className="termo-actions__tags">
                  <span>🏛 Modelo Oficial UTFPR</span>
                  <span>📝 Preenchimento Automático</span>
                </div>
              </div>
            </div>

            <div className="card termo-tip-card">
              <div className="termo-tip">
                <div className="termo-tip__ico">
                  <img src={logoEllp} alt="ELLP Logo" className="termo-tip-img" />
                </div>
                <div>
                  <div className="termo-tip__title">Dica do ELLP!</div>
                  <p className="termo-tip__text">
                    Após baixar o documento, assine e entregue uma via à DIREC para validação
                    das suas horas de voluntariado.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Botões fixos no rodapé */}
        <div className="termo-bottom-btn">
          <button
            className="btn btn-orange"
            onClick={baixarTermo}
            disabled={downloading || downloadingPdf}
          >
            📄 {downloading ? "Gerando…" : "Gerar Termo (.docx)"}
          </button>
          <button
            className="btn btn-primary"
            onClick={baixarTermoPdf}
            disabled={downloading || downloadingPdf}
          >
            📄 {downloadingPdf ? "Gerando PDF…" : "Exportar PDF"}
          </button>
        </div>

      </div>
    </div>
  );
}
