/* ═══════════════════════════════════════
   Indicador visual de status ativo/inativo
═══════════════════════════════════════ */

export default function Badge({ status }) {
  if (status === "active")
    return (
      <span className="badge badge--active">
        <span className="dot dot--on" />
        Ativo
      </span>
    );

  if (status === "inactive")
    return (
      <span className="badge badge--inactive">
        <span className="dot dot--off" />
        Inativo
      </span>
    );

  return null;
}
