import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { mensajeDeError } from '../services/api.ts';
import { useSesion } from '../estado/useSesion.ts';
import type { DatosRegistro } from '../tipos.ts';

interface ErroresRegistro {
  nombre?: string;
  correo?: string;
  telefono?: string;
  password?: string;
  calle?: string;
  numero?: string;
  colonia?: string;
}

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validar(datos: DatosRegistro): ErroresRegistro {
  const errores: ErroresRegistro = {};

  if (!datos.nombre) {
    errores.nombre = 'Escribe tu nombre o el de tu empresa.';
  }

  if (!datos.correo) {
    errores.correo = 'Escribe tu correo electrónico.';
  } else if (!CORREO_VALIDO.test(datos.correo)) {
    errores.correo = 'Escribe un correo válido.';
  }

  if (!datos.telefono) {
    errores.telefono = 'Escribe un teléfono de contacto.';
  }

  if (datos.password.length < 8) {
    errores.password = 'La contraseña debe tener al menos 8 caracteres.';
  }

  if (!datos.calle) {
    errores.calle = 'Escribe la calle.';
  }

  if (!datos.numero) {
    errores.numero = 'Escribe el número.';
  }

  if (!datos.colonia) {
    errores.colonia = 'Escribe la colonia.';
  }

  return errores;
}

export default function PaginaRegistro() {
  const { usuario, registrar } = useSesion();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const desde = (ubicacion.state as { desde?: string } | null)?.desde ?? '/catalogo';

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [colonia, setColonia] = useState('');
  const [errores, setErrores] = useState<ErroresRegistro>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const datos: DatosRegistro = {
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      password,
      calle: calle.trim(),
      numero: numero.trim(),
      colonia: colonia.trim(),
    };

    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);
    setErrorGeneral(null);

    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      await registrar(datos);
      navegar(desde, { replace: true });
    } catch (error) {
      setErrorGeneral(
        mensajeDeError(error, 'No pudimos crear tu cuenta. Inténtalo de nuevo.'),
      );
    } finally {
      setEnviando(false);
    }
  }

  if (usuario) return <Navigate to={desde} replace />;

  return (
    <section className="auth-pagina">
      <div className="auth-card auth-card--registro">
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
            <h2 className="auth-card__marca-titulo">Todo lo que tu evento necesita, <span>en un solo lugar.</span></h2>
            <p className="auth-card__marca-texto">Crea tu cuenta para preparar tu próxima producción audiovisual.</p>
          </div>
          <span className="auth-card__marca-pie">Tu evento. Tu equipo. Tu momento.</span>
        </aside>

        <div className="auth-card__formulario">
          <header className="auth-card__encabezado">
            <h1>Crea tu cuenta</h1>
            <p>Regístrate para empezar a planear tu renta.</p>
          </header>
          {errorGeneral && (
            <p className="aviso aviso--error" role="alert">
              {errorGeneral}
            </p>
          )}
          <form className="formulario" onSubmit={enviar} noValidate>
            <label className="campo">
              <span className="campo__etiqueta">Nombre completo o empresa</span>
              <input
                className={`campo__control${errores.nombre ? ' campo__control--error' : ''}`}
                type="text"
                name="nombre"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                placeholder="Ej. Alex Rivera"
                maxLength={100}
                autoComplete="name"
                aria-invalid={Boolean(errores.nombre)}
                required
              />
              {errores.nombre && (
                <span className="campo__error" role="alert">{errores.nombre}</span>
              )}
            </label>
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
            <div className="formulario__rejilla">
              <label className="campo">
                <span className="campo__etiqueta">Teléfono</span>
                <input
                  className={`campo__control${errores.telefono ? ' campo__control--error' : ''}`}
                  type="tel"
                  name="telefono"
                  value={telefono}
                  onChange={(event) => setTelefono(event.target.value)}
                  placeholder="644 123 4567"
                  maxLength={20}
                  autoComplete="tel"
                  aria-invalid={Boolean(errores.telefono)}
                  required
                />
                {errores.telefono && (
                  <span className="campo__error" role="alert">{errores.telefono}</span>
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
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                  autoComplete="new-password"
                  aria-invalid={Boolean(errores.password)}
                  required
                />
                {errores.password && (
                  <span className="campo__error" role="alert">{errores.password}</span>
                )}
              </label>
            </div>
            <p className="campo__etiqueta">Dirección de entrega</p>
            <div className="formulario__rejilla">
              <label className="campo">
                <span className="campo__etiqueta">Calle</span>
                <input
                  className={`campo__control${errores.calle ? ' campo__control--error' : ''}`}
                  type="text"
                  name="calle"
                  value={calle}
                  onChange={(event) => setCalle(event.target.value)}
                  placeholder="Av. principal"
                  maxLength={100}
                  autoComplete="street-address"
                  aria-invalid={Boolean(errores.calle)}
                  required
                />
                {errores.calle && (
                  <span className="campo__error" role="alert">{errores.calle}</span>
                )}
              </label>
              <label className="campo">
                <span className="campo__etiqueta">Número</span>
                <input
                  className={`campo__control${errores.numero ? ' campo__control--error' : ''}`}
                  type="text"
                  name="numero"
                  value={numero}
                  onChange={(event) => setNumero(event.target.value)}
                  placeholder="123"
                  maxLength={20}
                  aria-invalid={Boolean(errores.numero)}
                  required
                />
                {errores.numero && (
                  <span className="campo__error" role="alert">{errores.numero}</span>
                )}
              </label>
            </div>
            <label className="campo">
              <span className="campo__etiqueta">Colonia</span>
              <input
                className={`campo__control${errores.colonia ? ' campo__control--error' : ''}`}
                type="text"
                name="colonia"
                value={colonia}
                onChange={(event) => setColonia(event.target.value)}
                placeholder="Tu colonia"
                maxLength={100}
                autoComplete="address-level3"
                aria-invalid={Boolean(errores.colonia)}
                required
              />
              {errores.colonia && (
                <span className="campo__error" role="alert">{errores.colonia}</span>
              )}
            </label>
            <button className="boton boton--ambar boton--ancho" type="submit" disabled={enviando}>
              {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>
          <p className="formulario__pie">¿Ya tienes una cuenta? <Link to="/login" state={ubicacion.state}>Inicia sesión</Link></p>
        </div>
      </div>
    </section>
  );
}
