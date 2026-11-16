import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { mensajeDeError } from '../services/api.ts';
import { useSesion } from '../estado/useSesion.ts';

interface ErroresLogin {
  correo?: string;
  password?: string;
}

function validar(correo: string, password: string): ErroresLogin {
  const errores: ErroresLogin = {};

  if (!correo.trim()) {
    errores.correo = 'Escribe tu correo electrónico.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
    errores.correo = 'Escribe un correo válido.';
  }

  if (!password) {
    errores.password = 'Escribe tu contraseña.';
  }

  return errores;
}

export default function PaginaLogin() {
  const { usuario, entrar } = useSesion();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const desde = (ubicacion.state as { desde?: string } | null)?.desde ?? '/catalogo';

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState<ErroresLogin>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nuevosErrores = validar(correo, password);
    setErrores(nuevosErrores);
    setErrorGeneral(null);

    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      await entrar(correo.trim(), password);
      navegar(desde, { replace: true });
    } catch (error) {
      setErrorGeneral(
        mensajeDeError(error, 'No pudimos iniciar sesión. Inténtalo de nuevo.'),
      );
    } finally {
      setEnviando(false);
    }
  }

  if (usuario) return <Navigate to={desde} replace />;

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
          {errorGeneral && (
            <p className="aviso aviso--error" role="alert">
              {errorGeneral}
            </p>
          )}
          <form className="formulario" onSubmit={enviar} noValidate>
            <label className="campo">
              <span className="campo__etiqueta">Correo electrónico</span>
              <input
                className={`campo__control${errores.correo ? ' campo__control--error' : ''}`}
                type="email"
                name="correo"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                aria-invalid={Boolean(errores.correo)}
                required
              />
              {errores.correo && (
                <span className="campo__error" role="alert">{errores.correo}</span>
              )}
            </label>
            <label className="campo">
              <span className="campo__etiqueta">Contraseña</span>
              <input
                className={`campo__control${errores.password ? ' campo__control--error' : ''}`}
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={Boolean(errores.password)}
                required
              />
              {errores.password && (
                <span className="campo__error" role="alert">{errores.password}</span>
              )}
            </label>
            <button className="boton boton--ambar boton--ancho" type="submit" disabled={enviando}>
              {enviando ? 'Entrando…' : 'Iniciar sesión'}
            </button>
          </form>
          <p className="formulario__pie">¿Aún no tienes cuenta? <Link to="/registro" state={ubicacion.state}>Crear una cuenta</Link></p>
        </div>
      </div>
    </section>
  );
}
