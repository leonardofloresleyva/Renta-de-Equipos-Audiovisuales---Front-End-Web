import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Layout } from './componentes/Layout.tsx';
import { NoEncontrado } from './componentes/NoEncontrado.tsx';
import { RutaProtegida } from './componentes/RutaProtegida.tsx';

const PaginaCatalogo = lazy(() => import('./catalogo/paginas/PaginaCatalogo.tsx'));
const PaginaArticulo = lazy(() => import('./catalogo/paginas/PaginaArticulo.tsx'));
const PaginaLogin = lazy(() => import('./auth/PaginaLogin.tsx'));
const PaginaRegistro = lazy(() => import('./auth/PaginaRegistro.tsx'));
const PaginaPerfil = lazy(() => import('./auth/PaginaPerfil.tsx'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/catalogo" replace />} />
        <Route path="catalogo" element={<PaginaCatalogo />} />
        <Route path="articulos/:id" element={<PaginaArticulo />} />
        <Route path="login" element={<PaginaLogin />} />
        <Route path="registro" element={<PaginaRegistro />} />
        <Route element={<RutaProtegida />}>
          <Route path="perfil" element={<PaginaPerfil />} />
        </Route>
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}
