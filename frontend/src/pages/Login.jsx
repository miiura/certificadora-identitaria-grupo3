/* ═══════════════════════════════════════
Login da plataforma
═══════════════════════════════════════ */
import { useState } from "react";
import logoEllp from "../assets/mascote-ellp.png";
import { authService } from "../services/authService";

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const submit = async () => {
    if (!email || !password) { setError("Preencha e-mail e senha."); return; }
    setLoading(true);
    setError("");
    try {
      const user = await authService.login(email, password);
      onLogin(user);
    } catch (err) {
      const msg = err.response?.data?.erro || "Erro ao conectar ao servidor.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">

      {/* ── Lado esquerdo: ilustração ── */}
      <div className="login-left">
        <div className="login-left__inner">
          <div className="login-mascot">
            <img src={logoEllp} alt="ELLP Logo" className="login-mascot-img" />
          </div>
          <div className="login-project-label">PROJETO DE EXTENSÃO DA UNIVERSIDADE</div>
          <div className="login-project-sub">ENGAJAMENTO DIGITAL</div>
          <h2 className="login-welcome">Bem-vindo ao Portal ELLP</h2>
          <p className="login-desc">Sistema de Gestão de Voluntários</p>
          <div className="login-dots">
            <span className="login-dot login-dot--off" />
            <span className="login-dot login-dot--on" />
            <span className="login-dot login-dot--off" />
          </div>
        </div>
      </div>

      {/* ── Lado direito: formulário ── */}
      <div className="login-right">
        <div className="login-card">
          <h1 className="login-card__title">Acessar Conta</h1>
          <p className="login-card__sub">Entre com suas credenciais acadêmicas</p>

          {error && <div className="login-error">{error}</div>}

          <div className="fg">
            <label className="flabel">Email</label>
            <div className="finput-wrap">
              <span>✉</span>
              <input
                className="finput"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && submit()}
              />
            </div>
          </div>

          <div className="fg">
            <div className="flabel-row">
              <label className="flabel">Senha</label>
              <span className="login-forgot">Esqueceu a senha?</span>
            </div>
            <div className="finput-wrap">
              <span>🔒︎</span>
              <input
                className="finput"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && submit()}
              />
            </div>
          </div>

          <label className="login-remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            Lembrar de mim
          </label>

          <button className="login-btn" onClick={submit} disabled={loading}>
            {loading ? "Entrando…" : "Entrar →"}
          </button>

          <p className="login-signup">
            Não possui uma conta?{" "}
            <span className="login-signup__link">Solicitar acesso</span>
          </p>

          <div className="login-footer">
            <span>© 2026 PORTAL ELLP</span>
            <span>🔒︎ LOGIN SEGURO</span>
          </div>
        </div>
      </div>

    </div>
  );
}
