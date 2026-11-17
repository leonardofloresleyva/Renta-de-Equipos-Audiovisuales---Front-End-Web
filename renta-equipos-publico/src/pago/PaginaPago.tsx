import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router';
import { useDemostracion } from '../estado/useDemostracion.ts';
import { useRegistrarReserva } from '../estado/useReservas.ts';
import { formatoPrecio } from '../catalogo/articulos-demo.ts';
import { mensajeDeError } from '../services/errores.ts';
import { esClienteAutenticado, obtenerSesion } from '../services/sesion.ts';
import { obtenerMisReservas } from '../services/reservas.ts';
import type { Reserva } from '../tipos.ts';

function mostrarFecha(fecha: Date): string {
  return new Date(fecha).toLocaleDateString('es-MX');
}

export default function PaginaPago() {
  const sesion = obtenerSesion();
  const {
    lista,
    limpiar,
    fechaEntrega,
    fechaRecoleccion,
    diasRenta,
    totalArticulos,
    depositoGarantia,
    totalReserva,
  } = useDemostracion();
  const { registrar, guardando, error } = useRegistrarReserva();
  const [tipoPago, setTipoPago] = useState<'total' | 'deposito'>('total');
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargandoReservas, setCargandoReservas] = useState(true);
  const [errorReservas, setErrorReservas] = useState('');
  const [actualizacionReservas, setActualizacionReservas] = useState(0);
  const [reservaConfirmada, setReservaConfirmada] = useState<Reserva | null>(null);
  const [montoConfirmado, setMontoConfirmado] = useState(0);

  useEffect(() => {
    if (!esClienteAutenticado()) return;

    let vigente = true;
    obtenerMisReservas()
      .then((resultado) => {
        if (vigente) setReservas(resultado);
      })
      .catch((error: unknown) => {
        if (vigente) setErrorReservas(mensajeDeError(error, 'No se pudieron consultar tus reservas.'));
      })
      .finally(() => {
        if (vigente) setCargandoReservas(false);
      });

    return () => {
      vigente = false;
    };
  }, [actualizacionReservas]);

  if (!sesion) {
    return <Navigate to="/login" state={{ from: '/pago' }} replace />;
  }

  if (!esClienteAutenticado()) {
    return (
      <section className="pago-panel">
        <h1>Acceso para clientes</h1>
        <p>Inicia sesión con una cuenta de cliente para continuar con la reserva.</p>
        <Link className="boton boton--ambar" to="/login">Cambiar cuenta</Link>
      </section>
    );
  }

  async function confirmarPago(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formulario = event.currentTarget;
    const leerCampo = (nombre: string) => {
      const control = formulario.elements.namedItem(nombre);
      return control instanceof HTMLInputElement ? control.value : '';
    };
    const nuevaReserva = await registrar({
      fechaEntrega: new Date(`${fechaEntrega}T12:00:00`),
      fechaRecoleccion: new Date(`${fechaRecoleccion}T12:00:00`),
      calle: leerCampo('calle'),
      numero: leerCampo('numero'),
      colonia: leerCampo('colonia'),
      articulos: lista.map(({ articulo, cantidad }) => ({
        articuloId: articulo.id,
        cantidad,
      })),
    });

    if (!nuevaReserva) return;
    setMontoConfirmado(montoAPagar);
    setReservaConfirmada(nuevaReserva);
    setReservas((actuales) => [nuevaReserva, ...actuales]);
    limpiar();
    setErrorReservas('');
    setCargandoReservas(true);
    setActualizacionReservas((actual) => actual + 1);
  }

  const montoAPagar = tipoPago === 'total' ? totalReserva : depositoGarantia;

  return (
    <div className="pago-pagina">
      <header className="pago-encabezado">
        <Link to="/catalogo" className="detalle__volver">← Volver al catálogo</Link>
        <h1>Finalizar reserva</h1>
        <p>Hola, {sesion.usuario.nombre}. Revisa tu renta y simula el pago con tarjeta.</p>
      </header>

      {reservaConfirmada && (
        <section className="aviso-demo pago-confirmacion" role="status">
          <h2>Reserva registrada</h2>
          <p>Folio: <strong>{reservaConfirmada.folio}</strong></p>
          <p>Pago simulado: <strong>{formatoPrecio(montoConfirmado)}</strong></p>
          <p>Los datos de tarjeta no se guardaron ni se enviaron a la API.</p>
        </section>
      )}

      {lista.length > 0 ? (
        <div className="pago-rejilla">
          <section className="panel pago-panel">
            <h2>Resumen de renta</h2>
            <div className="pago-periodo">
              <span>{mostrarFecha(new Date(`${fechaEntrega}T12:00:00`))}</span>
              <span aria-hidden="true">→</span>
              <span>{mostrarFecha(new Date(`${fechaRecoleccion}T12:00:00`))}</span>
            </div>
            <p>{diasRenta} {diasRenta === 1 ? 'día' : 'días'} de renta</p>
            <ul className="pago-articulos">
              {lista.map(({ articulo, cantidad }) => (
                <li key={articulo.id}>
                  <span>{articulo.nombre} × {cantidad}</span>
                  <strong>{formatoPrecio(articulo.precioPorDia * cantidad * diasRenta)}</strong>
                </li>
              ))}
            </ul>
            <dl className="pago-totales">
              <div><dt>Total de artículos</dt><dd>{formatoPrecio(totalArticulos)}</dd></div>
              <div><dt>Depósito de garantía (20%)</dt><dd>{formatoPrecio(depositoGarantia)}</dd></div>
              <div className="pago-totales__total"><dt>Total de reserva</dt><dd>{formatoPrecio(totalReserva)}</dd></div>
            </dl>
          </section>

          <section className="panel pago-panel">
            <h2>Pago de demostración</h2>
            <form className="formulario" onSubmit={confirmarPago}>
              <fieldset className="pago-opciones">
                <legend className="campo__etiqueta">¿Cuánto deseas pagar ahora?</legend>
                <label>
                  <input type="radio" name="pago" value="total" checked={tipoPago === 'total'} onChange={() => setTipoPago('total')} />
                  <span>Liquidar total de reserva · {formatoPrecio(totalReserva)}</span>
                </label>
                <label>
                  <input type="radio" name="pago" value="deposito" checked={tipoPago === 'deposito'} onChange={() => setTipoPago('deposito')} />
                  <span>Pagar solo depósito · {formatoPrecio(depositoGarantia)}</span>
                </label>
              </fieldset>

              <div className="pago-direccion">
                <h3>Dirección de entrega</h3>
                <div className="formulario__rejilla">
                  <label className="campo">
                    <span className="campo__etiqueta">Calle</span>
                    <input className="campo__control" name="calle" maxLength={100} autoComplete="street-address" required />
                  </label>
                  <label className="campo">
                    <span className="campo__etiqueta">Número</span>
                    <input className="campo__control" name="numero" maxLength={20} required />
                  </label>
                </div>
                <label className="campo">
                  <span className="campo__etiqueta">Colonia</span>
                  <input className="campo__control" name="colonia" maxLength={100} autoComplete="address-level3" required />
                </label>
              </div>

              <fieldset className="pago-opciones">
                <legend className="campo__etiqueta">Tipo de tarjeta</legend>
                <label><input type="radio" name="tipoTarjeta" value="debito" defaultChecked /> Débito</label>
                <label><input type="radio" name="tipoTarjeta" value="credito" /> Crédito</label>
              </fieldset>

              <label className="campo">
                <span className="campo__etiqueta">Nombre en la tarjeta</span>
                <input className="campo__control" name="titular" autoComplete="cc-name" required />
              </label>
              <label className="campo">
                <span className="campo__etiqueta">Número de tarjeta</span>
                <input className="campo__control" name="numeroTarjeta" inputMode="numeric" autoComplete="cc-number" minLength={13} maxLength={23} pattern="[0-9 ]{13,23}" required />
              </label>
              <div className="formulario__rejilla">
                <label className="campo">
                  <span className="campo__etiqueta">Vencimiento</span>
                  <input className="campo__control" type="month" name="vencimiento" autoComplete="cc-exp" required />
                </label>
                <label className="campo">
                  <span className="campo__etiqueta">CVV</span>
                  <input className="campo__control" name="cvv" inputMode="numeric" autoComplete="cc-csc" minLength={3} maxLength={4} pattern="[0-9]{3,4}" required />
                </label>
              </div>

              <p className="formulario__nota">Este es un pago simulado: no se realiza ningún cargo ni se guardan o envían datos de tarjeta.</p>
              {error && <p className="aviso-error" role="alert">{error}</p>}
              <button className="boton boton--ambar boton--ancho" type="submit" disabled={guardando}>
                {guardando ? 'Registrando reserva…' : `Pagar ${formatoPrecio(montoAPagar)} y reservar`}
              </button>
            </form>
          </section>
        </div>
      ) : (
        <section className="panel pago-panel">
          <h2>No tienes artículos pendientes</h2>
          <p>Agrega equipo a tu lista de renta para crear una reserva.</p>
          <Link className="boton boton--ambar" to="/catalogo">Explorar catálogo</Link>
        </section>
      )}

      <section className="panel pago-panel pago-mis-reservas">
        <h2>Mis reservas</h2>
        {cargandoReservas && <p>Consultando reservas…</p>}
        {errorReservas && <p className="aviso-error" role="alert">{errorReservas}</p>}
        {!cargandoReservas && reservas.length === 0 && !errorReservas && <p>Aún no tienes reservas registradas.</p>}
        {reservas.length > 0 && (
          <ul className="pago-lista-reservas">
            {reservas.map((reserva) => (
              <li key={reserva.id}>
                <span><strong>{reserva.folio}</strong> · {mostrarFecha(reserva.fechaEntrega)} al {mostrarFecha(reserva.fechaRecoleccion)}</span>
                <span>{formatoPrecio(reserva.montoTotal)} · {reserva.estado}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="pago-nota">El depósito se calcula localmente y es una estimación; el API actualmente calcula los importes de forma independiente.</p>
    </div>
  );
}
