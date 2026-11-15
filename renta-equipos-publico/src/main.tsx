import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import { ProveedorDemostracion } from './estado/DemostracionContext.tsx';
import { ProveedorReservas } from './reservas/ReservasContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorDemostracion>
        <ProveedorReservas>
          <App />
        </ProveedorReservas>
      </ProveedorDemostracion>
    </BrowserRouter>
  </StrictMode>,
);
