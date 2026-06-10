/* ═══════════════════════════════════════
   Barra superior — compartilhada entre
   layout de voluntário e admin
═══════════════════════════════════════ */
import Avt from "./Avt";

export default function Topbar({ user, title }) {
  return (
    <header className="topbar">
      <div className="topbar__title">{title}</div>
      <div className="topbar__right">
        <button className="topbar__bell">🔔</button>
        <Avt name={user.name} size={34} fontSize={13} />
      </div>
    </header>
  );
}
