import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';

export default function PaginaRegistro() {
  const [aviso, setAviso] = useState(false);

  function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAviso(true);
  }

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
          {aviso && (
            <p className="aviso-demo" role="status">
              Esta pantalla es una maqueta. No se creó una cuenta ni se contactó al servicio.
            </p>
          )}
          <form className="formulario" onSubmit={enviar}>
            <label className="campo">
              <span className="campo__etiqueta">Nombre completo o empresa</span>
              <input className="campo__control" type="text" name="nombre" placeholder="Ej. Alex Rivera" maxLength={100} autoComplete="name" required />
            </label>
            <label className="campo">
              <span className="campo__etiqueta">Correo electrónico</span>
              <input className="campo__control" type="email" name="correo" placeholder="tu@correo.com" autoComplete="email" required />
            </label>
            <div className="formulario__rejilla">
              <label className="campo">
                <span className="campo__etiqueta">Teléfono</span>
                <input className="campo__control" type="tel" name="telefono" placeholder="644 123 4567" maxLength={20} autoComplete="tel" required />
              </label>
              <label className="campo">
                <span className="campo__etiqueta">Contraseña</span>
                <input className="campo__control" type="password" name="password" placeholder="Mínimo 8 caracteres" minLength={8} autoComplete="new-password" required />
              </label>
            </div>
            <p className="campo__etiqueta">Dirección de entrega</p>
            <div className="formulario__rejilla">
              <label className="campo">
                <span className="campo__etiqueta">Calle</span>
                <input className="campo__control" type="text" name="calle" placeholder="Av. principal" maxLength={100} autoComplete="street-address" required />
              </label>
              <label className="campo">
                <span className="campo__etiqueta">Número</span>
                <input className="campo__control" type="text" name="numero" placeholder="123" maxLength={20} required />
              </label>
            </div>
            <label className="campo">
              <span className="campo__etiqueta">Colonia</span>
              <input className="campo__control" type="text" name="colonia" placeholder="Tu colonia" maxLength={100} autoComplete="address-level3" required />
            </label>
            <button className="boton boton--ambar boton--ancho" type="submit">Crear cuenta</button>
          </form>
          <p className="formulario__pie">¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></p>
          <p className="formulario__nota">Demostración visual: este formulario no envía ni guarda tus datos.</p>
        </div>
      </div>
    </section>
  );
}
