/* ═══════════════════════════════════════
   Gerencia as notificações temporárias
═══════════════════════════════════════ */
import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = (msg, icon = "✓", type = "default") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, icon, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  };

  return { toasts, toast };
}
