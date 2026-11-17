import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import { ProveedorReservas } from './reservas/ReservasContext.tsx';
import { ProveedorSesion } from './estado/sesion/SesionContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <ProveedorSesion>
          <ProveedorReservas>
            <App />
          </ProveedorReservas>
        </ProveedorSesion>
    </BrowserRouter>
  </StrictMode>,
);
