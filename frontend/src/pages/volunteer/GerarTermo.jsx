/* ═══════════════════════════════════════
   Geração de termo de voluntariado 
═══════════════════════════════════════ */
import logoEllp from "../../assets/mascote-ellp.png";
import Topbar from "../../components/Topbar";
import { ACTIVITIES_EXAMPLE } from "../../data/mockData";

export default function GerarTermo({ user, project, toast }) {
  const incomplete = !user.cpf || !user.birthdate;
  const termDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="page-content">
      <Topbar user={user} title="Gerar Termo de Voluntariado" />
      <div className="content">

        {incomplete && (
          <div className="alert alert--warning">
            <span>⚠</span>
            <div>
              <strong>Campos Pendentes</strong>
              <div>
                Seu perfil ainda possui informações incompletas (CPF e Data de Nascimento).
                Complete os dados no seu perfil para que o termo seja gerado com validade jurídica.
              </div>
            </div>
            <button className="btn btn-dark btn-sm">Corrigir Agora</button>
          </div>
        )}

        <div className="termo-layout">

          {/* ── Preview do documento ── */}
          <div className="termo-doc card">
            <div className="termo-doc__inner">
              <h2 className="termo-title">TERMO DE ADESÃO AO SERVIÇO VOLUNTÁRIO</h2>
              <p className="termo-subtitle">PROJETO ELLP — ENSINO LÚDICO DE LÓGICA E PROGRAMAÇÃO</p>

              <div className="termo-section">
                <div className="termo-section__title">1. DADOS DO PROJETO</div>
                <div className="termo-project-row">
                  <div>
                    <span className="termo-lbl">Título:</span><br />
                    <span className="termo-val">{project.title}</span>
                  </div>
                  <div>
                    <span className="termo-lbl">Modalidade:</span><br />
                    <span className="termo-val">Projeto de Extensão</span>
                  </div>
                  <div>
                    <span className="termo-lbl">Vigência:</span><br />
                    <span className="termo-val">
                      {project.startMonth?.slice(0, 3)}/{project.startYear} –{" "}
                      {project.endMonth?.slice(0, 3)}/{project.endYear}
                    </span>
                  </div>
                </div>
              </div>

              <div className="termo-section">
                <div className="termo-section__title">2. DADOS DO VOLUNTÁRIO</div>
                <table className="termo-table">
                  <tbody>
                    <tr><td className="termo-table__lbl">Nome Completo</td><td>{user.name}</td></tr>
                    <tr>
                      <td className="termo-table__lbl">CPF / RG</td>
                      <td className={!user.cpf ? "termo-missing" : ""}>{user.cpf || "Não informado"}</td>
                    </tr>
                    <tr><td className="termo-table__lbl">Curso / Matrícula</td><td>{user.course ? `${user.course} – ${user.ra || ""}` : "—"}</td></tr>
                    <tr><td className="termo-table__lbl">Endereço</td><td>{user.address ? `${user.address}, ${user.city}` : "—"}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="termo-section">
                <div className="termo-section__title">3. SÍNTESE DAS ATIVIDADES</div>
                {ACTIVITIES_EXAMPLE.filter(a => a).map((a, i) => (
                  <div key={i} className="termo-activity">• {a};</div>
                ))}
              </div>

              <div className="termo-section">
                <div className="termo-section__title">4. PLANO DE TRABALHO E CARGA HORÁRIA</div>
                <table className="termo-table termo-table--schedule">
                  <thead>
                    <tr><th>Dia da Semana</th><th>Manhã</th><th>Tarde</th><th>Noite</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Terça-feira</td><td>-</td><td>14:00 – 18:00</td><td>-</td></tr>
                    <tr><td>Quinta-feira</td><td>-</td><td>14:00 – 18:00</td><td>-</td></tr>
                    <tr className="termo-table__total">
                      <td colSpan={4} style={{ textAlign: "right" }}>Total Semanal: 08 Horas</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="termo-section">
                <div className="termo-section__title">5. COORDENAÇÃO DO PROJETO</div>
                <div className="termo-coord">
                  <div>Coordenador Responsável: Fabrício Custódio da Silva</div>
                  <div>Departamento: Departamento de Análise e Desenvolvimento de Sistemas</div>
                  <div>Instituição: Centro de Ensino Superior de Cornélio Procópio</div>
                </div>
              </div>

              <div className="termo-assinaturas">
                <div className="termo-ass">
                  <div className="termo-ass__line" />
                  <div className="termo-ass__name">{user.name}</div>
                  <div className="termo-ass__role">VOLUNTÁRIO</div>
                </div>
                <div className="termo-ass">
                  <div className="termo-ass__line" />
                  <div className="termo-ass__name">Fabrício Custódio da Silva</div>
                  <div className="termo-ass__role">COORDENADOR DO PROJETO</div>
                </div>
              </div>

              <div className="termo-footer">
                Documento gerado eletronicamente em {termDate}.
              </div>
            </div>
          </div>

          {/* ── Ações laterais ── */}
          <div className="termo-actions">

            <div className="card termo-actions-card">
              <div className="card-header">
                <div className="card-title">Ações do Termo</div>
              </div>
              <div className="card-body">
                <p className="termo-actions__desc">
                  Revise todos os dados antes de realizar o download. O arquivo PDF será
                  gerado com as informações atuais do sistema.
                </p>
                <button
                  className="btn btn-orange btn-block"
                  onClick={() => toast("PDF sendo gerado...", "📄")}
                >
                  ⬇ Baixar PDF
                </button>
                <button className="btn btn-outline btn-block" style={{ marginTop: 8 }}>
                  ✏ Editar Perfil
                </button>
                <div className="termo-actions__tags">
                  <span>🏛 Modelo Padrão Institucional</span>
                  <span>✍ Assinatura Digital Integrada</span>
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
                    Lembre-se de anexar o termo assinado na seção "Meus Documentos"
                    para validação das suas horas.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Botão fixo no rodapé */}
        <div className="termo-bottom-btn">
          <button className="btn btn-orange" onClick={() => toast("Termo gerado!", "📄")}>
            📄 Gerar Termo
          </button>
        </div>

      </div>
    </div>
  );
}
