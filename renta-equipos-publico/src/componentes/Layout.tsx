import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { Encabezado } from './Encabezado.tsx';
import { PiePagina } from './PiePagina.tsx';

export function Layout() {
  return (
    <div className="disposicion">
      <Encabezado />
      <main className="disposicion__contenido">
        <Suspense fallback={<div className="catalogo__resumen">Preparando el catálogo…</div>}>
          <Outlet />
        </Suspense>
      </main>
      <PiePagina />
    </div>
  );
}
