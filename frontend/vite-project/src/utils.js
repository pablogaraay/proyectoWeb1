// src/utils.js
import info from './info.json';

// --------- (opcional) cosas antiguas ---------
let cuentasEnMemoria = [...info.cuentas];

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

// ============== NUEVO: gestión de usuario logueado ==============

// Guardar usuario actual (por si quieres usarlo desde el login)
export function setUsuarioActual(email, token) {
  if (email) {
    localStorage.setItem('usuarioEmail', email);
  }
  if (token) {
    localStorage.setItem('token', token);
  }
}

// Obtener usuario actual desde localStorage
export function getUsuarioActual() {
  const email = localStorage.getItem('usuarioEmail');
  if (!email) {
    return null;
  }
  // Lo devolvemos con la misma forma que esperas en Account.jsx
  return { usuario: email };
}

// Limpiar sesión de usuario
export function limpiarUsuarioActual() {
  localStorage.removeItem('usuarioEmail');
  localStorage.removeItem('token');
}
