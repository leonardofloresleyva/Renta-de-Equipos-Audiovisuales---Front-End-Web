import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router';
import { useCarrito } from '../estado/global/carrito.ts';
import { useSesion } from '../estado/sesion/useSesion.ts';
import { useRegistrarReserva } from '../estado/useReservas.ts';
import { urlImagen } from '../services/api.ts';
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
  const [reservaConfirmada, setReservaConfirmada] = useState<Reserva | null>(null);
  const [montoConfirmado, setMontoConfirmado] = useState(0);

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
      fechaEntrega: `${fechaEntrega}T12:00:00`,
      fechaRecoleccion: `${fechaRecoleccion}T12:00:00`,
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
          <section className="panel pago-panel pago-resumen">
            <div className="pago-resumen__detalle">
              <h2>Resumen de renta</h2>
              <div className="pago-periodo">
                <span>{mostrarFecha(fechaEntrega)}</span>
                <span aria-hidden="true">→</span>
                <span>{mostrarFecha(fechaRecoleccion)}</span>
              </div>
              <p>{diasRenta} {diasRenta === 1 ? 'día' : 'días'} de renta</p>
              <dl className="pago-totales">
                <div><dt>Total de artículos</dt><dd>{formatoPrecio(totalRenta)}</dd></div>
                <div><dt>Depósito de garantía (20%)</dt><dd>{formatoPrecio(depositoGarantia)}</dd></div>
                <div className="pago-totales__total"><dt>Total</dt><dd>{formatoPrecio(totalReserva)}</dd></div>
              </dl>
            </div>
            <section className="pago-resumen__articulos" aria-labelledby="pago-articulos-titulo">
              <h3 className="pago-articulos__titulo" id="pago-articulos-titulo">
                Artículos incluidos ({lista.length})
              </h3>
              <ul className="pago-articulos">
                {lista.map(({ articulo, cantidad }) => (
                  <li key={articulo.id}>
                    {articulo.fotografiasUrl[0] ? (
                      <img className="pago-articulo__imagen" src={urlImagen(articulo.fotografiasUrl[0])} alt="" />
                    ) : (
                      <span className="pago-articulo__sin-imagen" aria-hidden="true">Sin imagen</span>
                    )}
                    <div className="pago-articulo__informacion">
                      <p className="pago-articulo__nombre">{articulo.nombre}</p>
                      <p className="pago-articulo__meta">
                        {cantidad} × {formatoPrecio(articulo.precioPorDia)} / día
                      </p>
                    </div>
                    <div className="pago-articulo__subtotal">
                      <span>Subtotal de renta</span>
                      <strong>{formatoPrecio(articulo.precioPorDia * cantidad * diasRenta)}</strong>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </section>

          <section className="panel pago-panel">
            <h2>Elige tu forma de pago</h2>
            <form className="formulario pago-formulario" onSubmit={confirmarReserva}>
              <fieldset className="pago-opciones pago-opciones--monto">
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
                <div className="formulario__rejilla pago-direccion__campos">
                  <label className="campo">
                    <span className="campo__etiqueta">Calle</span>
                    <input className="campo__control" name="calle" maxLength={100} autoComplete="street-address" required />
                  </label>
                  <label className="campo">
                    <span className="campo__etiqueta">Número</span>
                    <input className="campo__control" name="numero" maxLength={20} required />
                  </label>
                  <label className="campo pago-direccion__colonia">
                    <span className="campo__etiqueta">Colonia</span>
                    <input className="campo__control" name="colonia" maxLength={100} autoComplete="address-level3" required />
                  </label>
                </div>
              </div>

              <fieldset className="pago-opciones pago-opciones--tarjeta">
                <legend className="campo__etiqueta">Tarjeta</legend>
                <label><input type="radio" name="tipoTarjeta" value="debito" defaultChecked /> Débito</label>
                <label><input type="radio" name="tipoTarjeta" value="credito" /> Crédito</label>
              </fieldset>

              <label className="campo pago-campo--titular">
                <span className="campo__etiqueta">Nombre en la tarjeta</span>
                <input className="campo__control" name="titular" autoComplete="off" required />
              </label>
              <label className="campo pago-campo--numero">
                <span className="campo__etiqueta">Número de tarjeta de prueba</span>
                <input className="campo__control" name="numeroTarjeta" inputMode="numeric" autoComplete="off" minLength={13} maxLength={23} pattern="[0-9 ]{13,23}" required />
              </label>
              <div className="formulario__rejilla pago-formulario__vencimiento">
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
    </div>
  );
}
