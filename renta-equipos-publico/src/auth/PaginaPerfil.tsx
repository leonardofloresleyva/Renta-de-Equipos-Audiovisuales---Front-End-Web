import { Link, useNavigate } from 'react-router';
import { useSesion } from '../estado/useSesion.ts';

export default function PaginaPerfil() {
  const { usuario, perfilId, salir } = useSesion();
  const navegar = useNavigate();

  if (!usuario) return null;

  function cerrarSesion() {
    salir();
    navegar('/catalogo');
  }

  return (
    <section className="perfil">
      <header className="perfil__encabezado">
        <span className="perfil__etiqueta">Mi cuenta</span>
        <h1>Hola, {usuario.nombre}</h1>
        <p>Estos son los datos con los que el servicio identifica tu sesión.</p>
      </header>

      <div className="perfil__tarjeta">
        <dl className="perfil__datos">
          <div>
            <dt>Nombre</dt>
            <dd>{usuario.nombre}</dd>
          </div>
          <div>
            <dt>Correo</dt>
            <dd>{usuario.correo}</dd>
          </div>
          <div>
            <dt>Rol</dt>
            <dd>{usuario.rol === 'administrador' ? 'Administrador' : 'Cliente'}</dd>
          </div>
          <div>
            <dt>Identificador del perfil</dt>
            <dd>{perfilId ?? 'No disponible'}</dd>
          </div>
        </dl>

        <div className="perfil__acciones">
          <Link to="/catalogo" className="boton">Seguir explorando</Link>
          <button className="boton boton--ambar" type="button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </section>
  );
}
