/**
 * Alitas Fieles — Módulo de Persistencia Local
 * Compatible con ejecución directa local (file://) y servidores web (http://)
 */

(function () {
  const STORAGE_KEY_ORDERS = "alitas_fieles_pedidos_v1";
  const STORAGE_KEY_PHONE = "alitas_fieles_wa_phone_v1";
  const STORAGE_KEY_MESA = "alitas_fieles_active_mesa_v1";

  function loadPedidos(totalMesas) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (raw) {
        const parsed = JSON.parse(raw);
        for (let i = 1; i <= totalMesas; i++) {
          if (!parsed[i]) parsed[i] = { items: [], comentario: "" };
        }
        return parsed;
      }
    } catch (err) {
      console.warn("Aviso: No se pudo leer pedidos de localStorage:", err);
    }

    const inicial = {};
    for (let i = 1; i <= totalMesas; i++) {
      inicial[i] = { items: [], comentario: "" };
    }
    return inicial;
  }

  function savePedidos(pedidos) {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(pedidos));
    } catch (err) {
      console.warn("Aviso: No se pudo guardar en localStorage:", err);
    }
  }

  function loadWhatsAppPhone(defaultPhone = "51900694550") {
    try {
      return localStorage.getItem(STORAGE_KEY_PHONE) || defaultPhone;
    } catch {
      return defaultPhone;
    }
  }

  function saveWhatsAppPhone(phone) {
    try {
      localStorage.setItem(STORAGE_KEY_PHONE, phone);
    } catch (err) {
      console.warn("Aviso: No se pudo guardar teléfono en localStorage:", err);
    }
  }

  function loadActiveMesa() {
    try {
      const val = localStorage.getItem(STORAGE_KEY_MESA);
      return val ? parseInt(val, 10) : null;
    } catch {
      return null;
    }
  }

  function saveActiveMesa(mesa) {
    try {
      if (mesa) {
        localStorage.setItem(STORAGE_KEY_MESA, mesa.toString());
      } else {
        localStorage.removeItem(STORAGE_KEY_MESA);
      }
    } catch (err) {
      console.warn("Aviso: No se pudo guardar mesa activa:", err);
    }
  }

  window.StorageService = {
    loadPedidos,
    savePedidos,
    loadWhatsAppPhone,
    saveWhatsAppPhone,
    loadActiveMesa,
    saveActiveMesa
  };
})();
