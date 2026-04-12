// Componente de tarjeta de métrica
// Usado en: Dashboard (x4)
// Props: icono (img), titulo (str), valor (num)
export default function StatCard({ icono, titulo, valor }) {
  return (
    <div className="box">
      <img src={icono} className="box-icon" alt={titulo} />
      <p className="box-text-small">{titulo}</p>
      <p className="box-text-large">{valor ?? 0}</p>
    </div>
  )
}
