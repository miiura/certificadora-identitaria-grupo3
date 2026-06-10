/* ═══════════════════════════════════════
   Avatar circular com iniciais do nome
═══════════════════════════════════════ */

const AVT_COLORS = ["#1A6FC4","#7C3AED","#0891B2","#16A34A","#C2410C","#BE185D","#0F766E"];

/** Retorna as duas primeiras iniciais do nome */
const ini = name =>
  name.split(" ").slice(0, 2).map(x => x[0]).join("").toUpperCase();

/** Cor determinística baseada na primeira letra */
const avtColor = name => AVT_COLORS[name.charCodeAt(0) % AVT_COLORS.length];

export default function Avt({ name, size = 36, fontSize = 13 }) {
  return (
    <div
      className="avt"
      style={{ width: size, height: size, fontSize, background: avtColor(name) }}
    >
      {ini(name)}
    </div>
  );
}
