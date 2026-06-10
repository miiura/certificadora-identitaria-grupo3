/* ═══════════════════════════════════════
   Notificações temporárias (bottom-right)
═══════════════════════════════════════ */

export default function Toast({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type || "default"}`}>
          <span>{t.icon}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
