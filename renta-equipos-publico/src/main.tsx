import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import { ProveedorDemostracion } from './estado/DemostracionContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorDemostracion>
        <App />
      </ProveedorDemostracion>
    </BrowserRouter>
  </StrictMode>,
);
