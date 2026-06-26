import { useState } from "react";
import "./portal-ellp.css";

import Login        from "./pages/Login";
import VolunteerApp from "./pages/volunteer/VolunteerApp";
import AdminApp     from "./pages/admin/AdminApp";
import Toast        from "./components/Toast";
import { useToast } from "./hooks/useToast";
import { MOCK_PROJECT } from "./data/mockData";
import { authService } from "./services/authService";

export default function App() {
  const [user,       setUser]       = useState(() => authService.getCurrentUser());
  const [volunteers, setVolunteers] = useState([]);
  const [project,    setProject]    = useState(MOCK_PROJECT);

  const { toasts, toast } = useToast();

  const handleLogin  = u  => setUser(u);
  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  /* ── Sem usuário → Login ── */
  if (!user) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toast toasts={toasts} />
      </>
    );
  }

  /* ── Voluntário ── */
  if (user.role === "volunteer") {
    return (
      <>
        <VolunteerApp
          user={user}
          setUser={u => setUser(prev => ({ ...prev, ...u }))}
          toast={toast}
          project={project}
          onLogout={handleLogout}
        />
        <Toast toasts={toasts} />
      </>
    );
  }

  /* ── Admin ── */
  if (user.role === "admin") {
    return (
      <>
        <AdminApp
          user={user}
          setUser={u => setUser(prev => ({ ...prev, ...u }))}
          toast={toast}
          volunteers={volunteers}
          setVolunteers={setVolunteers}
          project={project}
          setProject={setProject}
          onLogout={handleLogout}
        />
        <Toast toasts={toasts} />
      </>
    );
  }

  /* ── Role desconhecida (fallback de segurança) ── */
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>Role não reconhecida: <strong>{user.role}</strong>. Entre em contato com o suporte.</p>
      <button onClick={handleLogout} style={{ marginTop: "1rem" }}>Voltar ao login</button>
    </div>
  );
}
