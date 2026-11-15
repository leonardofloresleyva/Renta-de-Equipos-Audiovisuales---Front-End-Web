import { Link } from 'react-router';

export function NoEncontrado() {
  return (
    <section className="vacio">
      <div className="vacio__codigo">404</div>
      <h1>Este artículo no está disponible</h1>
      <p>Revisa la dirección o vuelve al catálogo para explorar el equipo.</p>
      <Link to="/catalogo" className="boton">Volver al catálogo</Link>
    </section>
  );
}
