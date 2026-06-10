/* ═══════════════════════════════════════
   Layout completo do voluntário:
   sidebar + roteamento entre as páginas.
   Recebe user/setUser/toast/project do App.jsx
═══════════════════════════════════════ */
import { useState } from "react";
import SidebarVol       from "./SidebarVol";
import DashVol          from "./DashVol";
import MinhasAtividades from "./MinhasAtividades";
import PerfilVol        from "./PerfilVol";
import GerarTermo       from "./GerarTermo";

export default function VolunteerApp({ user, setUser, toast, project, onLogout }) {
  const [page, setPage] = useState("inicio");

  const pages = {
    inicio:     <DashVol          user={user} setPage={setPage} />,
    atividades: <MinhasAtividades user={user} toast={toast} />,
    perfil:     <PerfilVol        user={user} setUser={setUser} toast={toast} />,
    termo:      <GerarTermo       user={user} project={project} toast={toast} />,
  };

  return (
    <div className="app">
      <SidebarVol page={page} setPage={setPage} user={user} onLogout={onLogout} />
      <div className="main">
        {pages[page] ?? pages.inicio}
      </div>
    </div>
  );
}
