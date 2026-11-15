import { useContext } from 'react';
import { DemostracionContext } from './demostracion-context.ts';

export function useDemostracion() {
  const contexto = useContext(DemostracionContext);
  if (!contexto) {
    throw new Error('useDemostracion debe usarse dentro de ProveedorDemostracion.');
  }
  return contexto;
}
