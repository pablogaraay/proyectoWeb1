import info from './info.json';

// Array en memoria que se perderá al refrescar la página
let cuentasEnMemoria = [...info.cuentas];

// Usuario actual en memoria (también se pierde al refrescar)
let usuarioActual = null;

// Función auxiliar para obtener todas las cuentas
function obtenerTodasLasCuentas() {
  return cuentasEnMemoria;
}

export function existeCuenta(email, password) {
  const cuentas = obtenerTodasLasCuentas();
  for (let cuenta of cuentas) {
    if (cuenta.usuario === email && cuenta.contraseña === password) {
      return true;
    }
  }
  return false;
}

export function estaUsadoEmail(email) {
  const cuentas = obtenerTodasLasCuentas();
  for (let cuenta of cuentas) {
    if (cuenta.usuario === email) {
      return true;
    }
  }
  return false;
}

export function añadirCuenta(email, password) {
  cuentasEnMemoria.push({
    usuario: email,
    contraseña: password,
  });
}

export function setUsuarioActual(email) {
  usuarioActual = { usuario: email };
}

export function getUsuarioActual() {
  return usuarioActual;
}
