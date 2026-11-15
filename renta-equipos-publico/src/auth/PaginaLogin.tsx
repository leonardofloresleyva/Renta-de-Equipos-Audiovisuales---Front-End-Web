import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';

export default function PaginaLogin() {
  const [aviso, setAviso] = useState(false);

  function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAviso(true);
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
          {aviso && (
            <p className="aviso-demo" role="status">
              Esta pantalla es una maqueta. No se validaron credenciales ni se contactó al servicio.
            </p>
          )}
          <form className="formulario" onSubmit={enviar}>
            <label className="campo">
              <span className="campo__etiqueta">Correo electrónico</span>
              <input className="campo__control" type="email" name="correo" placeholder="tu@correo.com" autoComplete="email" required />
            </label>
            <label className="campo">
              <span className="campo__etiqueta">Contraseña</span>
              <input className="campo__control" type="password" name="password" placeholder="••••••••" minLength={8} autoComplete="current-password" required />
            </label>
            <button className="boton boton--ambar boton--ancho" type="submit">Iniciar sesión</button>
          </form>
          <p className="formulario__pie">¿Aún no tienes cuenta? <Link to="/registro">Crear una cuenta</Link></p>
          <p className="formulario__nota">Demostración visual: este formulario no envía ni guarda tus datos.</p>
        </div>
      </div>
    </section>
  );
}
