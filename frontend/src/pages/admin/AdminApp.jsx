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
import { userService } from "../../services/userService";

export default function AdminApp({
  user, setUser, toast,
  volunteers, setVolunteers,
  project, setProject,
  onLogout,
}) {
  const [page,        setPage]        = useState("inicio");
  const [modalNewVol, setModalNewVol] = useState(false);
  const [saving,      setSaving]      = useState(false);

  // Global "new volunteer" modal — triggered from DashAdm
  const salvarNovo = async (data) => {
    setSaving(true);
    try {
      const novo = await userService.createVolunteer(data);
      setVolunteers(vs => [...vs, novo]);
      setModalNewVol(false);
      toast("Voluntário cadastrado com sucesso!");
    } catch (err) {
      const msg = err.response?.data?.erro || "Erro ao cadastrar voluntário.";
      toast(msg, "❌");
    } finally {
      setSaving(false);
    }
  };

  const pages = {
    inicio:      <DashAdm       user={user} setPage={setPage} volunteers={volunteers} setModalNewVol={setModalNewVol} />,
    voluntarios: <GerenciarVols user={user} volunteers={volunteers} setVolunteers={setVolunteers} toast={toast} modalNew={modalNewVol} setModalNew={setModalNewVol} />,
    acao:        <DadosAcao     user={user} setProject={setProject} toast={toast} volunteers={volunteers} />,
    perfil:      <PerfilAdm     user={user} setUser={setUser} toast={toast} />,
  };

  return (
    <div className="app">
      <SidebarAdm
        page={page}
        setPage={setPage}
        user={user}
        onLogout={onLogout}
        onNewVol={() => { setPage("voluntarios"); setModalNewVol(true); }}
      />
      <div className="main">
        {pages[page] ?? pages.inicio}
      </div>

      {/* Modal global de novo voluntário — apenas visível fora da página de voluntários */}
      {modalNewVol && page !== "voluntarios" && (
        <VolModal mode="new" onSave={salvarNovo} onClose={() => setModalNewVol(false)} loading={saving} />
      )}
    </div>
  );
}
