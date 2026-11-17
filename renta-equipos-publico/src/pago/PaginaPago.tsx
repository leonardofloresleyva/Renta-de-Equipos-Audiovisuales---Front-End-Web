import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router';
import { useCarrito } from '../estado/global/carrito.ts';
import { useSesion } from '../estado/sesion/useSesion.ts';
import { useRegistrarReserva } from '../estado/useReservas.ts';
import { mensajeDeError } from '../services/api.ts';
import { traerMisReservas } from '../services/reservas.ts';
import { formatoPrecio } from '../utils/formato.precio.ts';
import type { Reserva } from '../tipos.ts';

function mostrarFecha(fecha: string | Date): string {
  return new Date(fecha).toLocaleDateString('es-MX');
}

export default function PaginaPago() {
  const { usuario } = useSesion();
  const lista = useCarrito((state) => state.lista);
  const vaciar = useCarrito((state) => state.vaciar);
  const fechaEntrega = useCarrito((state) => state.fechaEntrega);
  const fechaRecoleccion = useCarrito((state) => state.fechaRecoleccion);
  const diasRenta = useCarrito((state) => state.diasRenta());
  const totalRenta = useCarrito((state) => state.totalRenta());
  const depositoGarantia = useCarrito((state) => state.depositoGarantia());
  const totalReserva = useCarrito((state) => state.totalReserva());
  const { registrar, guardando, error } = useRegistrarReserva();
  const [tipoPago, setTipoPago] = useState<'total' | 'deposito'>('total');
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargandoReservas, setCargandoReservas] = useState(usuario?.rol === 'cliente');
  const [errorReservas, setErrorReservas] = useState('');
  const [reservaConfirmada, setReservaConfirmada] = useState<Reserva | null>(null);
  const [montoConfirmado, setMontoConfirmado] = useState(0);

  useEffect(() => {
    if (usuario?.rol !== 'cliente') {
      return;
    }

    let vigente = true;
    traerMisReservas()
      .then((resultado) => {
        if (vigente) setReservas(resultado);
      })
      .catch((error: unknown) => {
        if (vigente) {
          setErrorReservas(
            mensajeDeError(error, 'No pudimos mostrar tus reservas. Inténtalo más tarde.'),
          );
        }
      })
      .finally(() => {
        if (vigente) setCargandoReservas(false);
      });

    return () => {
      vigente = false;
    };
  }, [usuario?.rol]);

  if (!usuario) {
    return <Navigate to="/login" state={{ desde: '/pago' }} replace />;
  }

  if (usuario.rol !== 'cliente') {
    return (
      <section className="panel pago-panel">
        <h1>Esta opción es para clientes</h1>
        <p>Inicia sesión con una cuenta de cliente para continuar con tu reserva.</p>
        <Link className="boton boton--ambar" to="/catalogo">Volver al catálogo</Link>
      </section>
    );
  }

  async function confirmarReserva(event: FormEvent<HTMLFormElement>) {
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
    setMontoConfirmado(tipoPago === 'total' ? totalReserva : depositoGarantia);
    setReservaConfirmada(nuevaReserva);
    setReservas((actuales) => [nuevaReserva, ...actuales]);
    vaciar();
  }

  const montoAPagar = tipoPago === 'total' ? totalReserva : depositoGarantia;

  return (
    <div className="pago-pagina">
      <header className="pago-encabezado">
        <Link to="/catalogo" className="detalle__volver">← Volver al catálogo</Link>
        <h1>Finalizar reserva</h1>
        <p>Hola, {usuario.nombre}. Revisa tu renta y elige cuánto deseas pagar.</p>
      </header>

      {reservaConfirmada && (
        <section className="aviso-demo pago-confirmacion" role="status">
          <h2>¡Tu reserva está lista!</h2>
          <p>Tu folio de reserva es <strong>{reservaConfirmada.folio}</strong>.</p>
          <p>Elegiste pagar <strong>{formatoPrecio(montoConfirmado)}</strong>.</p>
        </section>
      )}

      {lista.length > 0 ? (
        <div className="pago-rejilla">
          <section className="panel pago-panel">
            <h2>Resumen de renta</h2>
            <div className="pago-periodo">
              <span>{mostrarFecha(fechaEntrega)}</span>
              <span aria-hidden="true">→</span>
              <span>{mostrarFecha(fechaRecoleccion)}</span>
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
              <div><dt>Total de artículos</dt><dd>{formatoPrecio(totalRenta)}</dd></div>
              <div><dt>Depósito de garantía (20%)</dt><dd>{formatoPrecio(depositoGarantia)}</dd></div>
              <div className="pago-totales__total"><dt>Total</dt><dd>{formatoPrecio(totalReserva)}</dd></div>
            </dl>
          </section>

          <section className="panel pago-panel">
            <h2>Elige tu forma de pago</h2>
            <form className="formulario" onSubmit={confirmarReserva}>
              <fieldset className="pago-opciones">
                <legend className="campo__etiqueta">¿Cuánto deseas pagar?</legend>
                <label>
                  <input
                    type="radio"
                    name="pago"
                    value="total"
                    checked={tipoPago === 'total'}
                    onChange={() => setTipoPago('total')}
                  />
                  <span>El total · {formatoPrecio(totalReserva)}</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="pago"
                    value="deposito"
                    checked={tipoPago === 'deposito'}
                    onChange={() => setTipoPago('deposito')}
                  />
                  <span>Solo el depósito · {formatoPrecio(depositoGarantia)}</span>
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
                <legend className="campo__etiqueta">Tarjeta</legend>
                <label><input type="radio" name="tipoTarjeta" value="debito" defaultChecked /> Débito</label>
                <label><input type="radio" name="tipoTarjeta" value="credito" /> Crédito</label>
              </fieldset>

              <label className="campo">
                <span className="campo__etiqueta">Nombre en la tarjeta</span>
                <input className="campo__control" name="titular" autoComplete="off" required />
              </label>
              <label className="campo">
                <span className="campo__etiqueta">Número de tarjeta de prueba</span>
                <input className="campo__control" name="numeroTarjeta" inputMode="numeric" autoComplete="off" minLength={13} maxLength={23} pattern="[0-9 ]{13,23}" required />
              </label>
              <div className="formulario__rejilla">
                <label className="campo">
                  <span className="campo__etiqueta">Vencimiento</span>
                  <input className="campo__control" type="month" name="vencimiento" autoComplete="off" required />
                </label>
                <label className="campo">
                  <span className="campo__etiqueta">Código de seguridad</span>
                  <input className="campo__control" name="cvv" inputMode="numeric" autoComplete="off" minLength={3} maxLength={4} pattern="[0-9]{3,4}" required />
                </label>
              </div>

              {error && <p className="aviso-error" role="alert">{error}</p>}
              <button className="boton boton--ambar boton--ancho" type="submit" disabled={guardando}>
                {guardando ? 'Preparando tu reserva…' : `Confirmar reserva · ${formatoPrecio(montoAPagar)}`}
              </button>
            </form>
          </section>
        </div>
      ) : (
        <section className="panel pago-panel">
          <h2>Tu lista está vacía</h2>
          <p>Agrega el equipo que necesitas para preparar tu reserva.</p>
          <Link className="boton boton--ambar" to="/catalogo">Explorar equipo</Link>
        </section>
      )}

      <section className="panel pago-panel pago-mis-reservas">
        <h2>Mis reservas</h2>
        {cargandoReservas && <p>Buscando tus reservas…</p>}
        {errorReservas && <p className="aviso-error" role="alert">{errorReservas}</p>}
        {!cargandoReservas && reservas.length === 0 && !errorReservas && <p>Aún no tienes reservas.</p>}
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
    </div>
  );
}
