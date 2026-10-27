/**
 * Alitas Fieles — Módulo de Persistencia Local
 * Guarda y recupera pedidos, configuraciones y el teléfono de WhatsApp
 * para evitar pérdidas de datos si el mesero recarga la página.
 */

const STORAGE_KEY_ORDERS = "alitas_fieles_pedidos_v1";
const STORAGE_KEY_PHONE = "alitas_fieles_wa_phone_v1";
const STORAGE_KEY_MESA = "alitas_fieles_active_mesa_v1";

export function loadPedidos(totalMesas) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Validar que todas las mesas existan
      for (let i = 1; i <= totalMesas; i++) {
        if (!parsed[i]) {
          parsed[i] = { items: [], comentario: "" };
        }
      }
      return parsed;
    }
  } catch (err) {
    console.warn("Error cargando pedidos de localStorage:", err);
  }

  // Inicialización por defecto
  const inicial = {};
  for (let i = 1; i <= totalMesas; i++) {
    inicial[i] = { items: [], comentario: "" };
  }
  return inicial;
}

export function savePedidos(pedidos) {
  try {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(pedidos));
  } catch (err) {
    console.warn("No se pudo guardar pedidos en localStorage:", err);
  }
}

export function loadWhatsAppPhone(defaultPhone = "") {
  try {
    return localStorage.getItem(STORAGE_KEY_PHONE) || defaultPhone;
  } catch {
    return defaultPhone;
  }
}

export function saveWhatsAppPhone(phone) {
  try {
    localStorage.setItem(STORAGE_KEY_PHONE, phone);
  } catch (err) {
    console.warn("No se pudo guardar el teléfono en localStorage:", err);
  }
}

export function loadActiveMesa() {
  try {
    const val = localStorage.getItem(STORAGE_KEY_MESA);
    return val ? parseInt(val, 10) : null;
  } catch {
    return null;
  }
}

export function saveActiveMesa(mesa) {
  try {
    if (mesa) {
      localStorage.setItem(STORAGE_KEY_MESA, mesa.toString());
    } else {
      localStorage.removeItem(STORAGE_KEY_MESA);
    }
  } catch (err) {
    console.warn("No se pudo guardar la mesa activa:", err);
  }
}
