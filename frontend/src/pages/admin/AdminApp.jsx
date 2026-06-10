/* ═══════════════════════════════════════
   Layout completo do admin:
   sidebar + roteamento entre as páginas.
   Recebe user/setUser/toast/volunteers/project do App.jsx
═══════════════════════════════════════ */
import { useState } from "react";
import SidebarAdm    from "./SidebarAdm";
import DashAdm       from "./DashAdm";
import GerenciarVols from "./GerenciarVols";
import DadosAcao     from "./DadosAcao";
import PerfilAdm     from "./PerfilAdm";
import VolModal      from "../../components/VolModal";
import { uid }       from "../../data/mockData";

export default function AdminApp({
  user, setUser, toast,
  volunteers, setVolunteers,
  project, setProject,
  onLogout,
}) {
  const [page,        setPage]        = useState("inicio");
  const [modalNewVol, setModalNewVol] = useState(false);

  const salvarNovo = data => {
    setVolunteers(vs => [...vs, { ...data, id: uid(), status: "active" }]);
    setModalNewVol(false);
    toast("Voluntário cadastrado com sucesso!");
  };

  const pages = {
    inicio:      <DashAdm       user={user} setPage={setPage} volunteers={volunteers} setModalNewVol={setModalNewVol} />,
    voluntarios: <GerenciarVols user={user} volunteers={volunteers} setVolunteers={setVolunteers} toast={toast} modalNew={modalNewVol} setModalNew={setModalNewVol} />,
    acao:        <DadosAcao     user={user} project={project} setProject={setProject} toast={toast} volunteers={volunteers} />,
    perfil:      <PerfilAdm     user={user} setUser={setUser} toast={toast} />,
  };

  return (
    <div className="app">
      <SidebarAdm page={page} setPage={setPage} user={user} onLogout={onLogout} />
      <div className="main">
        {pages[page] ?? pages.inicio}
      </div>

      {/* Modal global de novo voluntário (acionado pelo DashAdm) */}
      {modalNewVol && (
        <VolModal mode="new" onSave={salvarNovo} onClose={() => setModalNewVol(false)} />
      )}
    </div>
  );
}
