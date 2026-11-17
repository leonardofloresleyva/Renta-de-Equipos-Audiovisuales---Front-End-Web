import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { iniciarSesion } from '../services/auth.ts';
import { cerrarSesion } from '../services/sesion.ts';
import { mensajeDeError } from '../services/errores.ts';

export default function PaginaLogin() {
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const estado = location.state;
  const destino = estado && typeof estado === 'object' && 'from' in estado
    && typeof estado.from === 'string'
    && estado.from.startsWith('/')
    && !estado.from.startsWith('//')
    ? estado.from
    : '/catalogo';

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setEnviando(true);
    const datos = new FormData(event.currentTarget);
    try {
      const sesion = await iniciarSesion(String(datos.get('correo')), String(datos.get('password')));
      if (sesion.usuario.rol !== 'cliente') {
        cerrarSesion();
        setError('Esta cuenta no tiene acceso al flujo de reservas para clientes.');
        return;
      }
      navigate(destino, { replace: true });
    } catch (error: unknown) {
      setError(mensajeDeError(error, 'No se pudo iniciar sesión. Intenta de nuevo.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="auth-pagina">
      <div className="auth-card">
        <aside className="auth-card__marca">
          <Link to="/catalogo" className="barra__marca" aria-label="Renta AV, ir al catálogo">
            <span className="barra__marca-icono" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="25" height="25" fill="none">
                <rect x="3" y="6" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="m16 10 5-3v10l-5-3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="barra__marca-texto">
              <span className="barra__marca-nombre">Renta <span>AV</span></span>
              <span className="barra__marca-lema">EQUIPO PARA TUS EVENTOS</span>
            </span>
          </Link>
          <div>
            <h2 className="auth-card__marca-titulo">Tu próximo evento empieza <span>aquí.</span></h2>
            <p className="auth-card__marca-texto">Encuentra el equipo audiovisual que necesitas para crear momentos inolvidables.</p>
          </div>
          <span className="auth-card__marca-pie">Proyección · Audio · Iluminación</span>
        </aside>

        <div className="auth-card__formulario">
          <header className="auth-card__encabezado">
            <h1>Bienvenido de nuevo</h1>
            <p>Inicia sesión para continuar con tu renta.</p>
          </header>
          {error && <p className="aviso-error" role="alert">{error}</p>}
          <form className="formulario" onSubmit={enviar}>
            <label className="campo">
              <span className="campo__etiqueta">Correo electrónico</span>
              <input className="campo__control" type="email" name="correo" placeholder="tu@correo.com" autoComplete="email" required />
            </label>
            <label className="campo">
              <span className="campo__etiqueta">Contraseña</span>
              <input className="campo__control" type="password" name="password" placeholder="••••••••" minLength={8} autoComplete="current-password" required />
            </label>
            <button className="boton boton--ambar boton--ancho" type="submit" disabled={enviando}>
              {enviando ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </button>
          </form>
          <p className="formulario__pie">¿Aún no tienes cuenta? <Link to="/registro">Crear una cuenta</Link></p>
          <p className="formulario__nota">Tu sesión se conserva en esta pestaña y expira junto con el token de acceso.</p>
        </div>
      </div>
    </section>
  );
}
