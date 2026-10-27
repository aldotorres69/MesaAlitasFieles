/**
 * Alitas Fieles — Lógica Principal de la Aplicación
 * Sistema interactivo de comandas por mesa y despacho por WhatsApp.
 */

import { RESTAURANT_CONFIG, SABORES_ALITAS, MENU } from "./data.js";
import {
  loadPedidos,
  savePedidos,
  loadWhatsAppPhone,
  saveWhatsAppPhone,
  loadActiveMesa,
  saveActiveMesa
} from "./storage.js";

// Estado de la aplicación
const MESAS = RESTAURANT_CONFIG.totalMesas;
let mesaActiva = loadActiveMesa();
let catActiva = Object.keys(MENU)[0] || "Alitas";
let pedidos = loadPedidos(MESAS);
let waPhone = loadWhatsAppPhone(RESTAURANT_CONFIG.telefonoCocinaDefault);
let modalCtx = null; // { prod, sel: [], dist: {} }
let currentMobileTab = "carta"; // 'mesas' | 'carta' | 'pedido'

// ── INICIALIZACIÓN ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  bindEvents();
  renderSidebar();
  renderCats();
  
  if (mesaActiva && mesaActiva >= 1 && mesaActiva <= MESAS) {
    selMesa(mesaActiva, false);
  } else {
    renderProductos();
    renderPedido();
  }

  updateMobileBadges();
}

function bindEvents() {
  // Comentario general
  const comentInput = document.getElementById("coment-general");
  if (comentInput) {
    comentInput.addEventListener("input", (e) => {
      if (mesaActiva) {
        pedidos[mesaActiva].comentario = e.target.value;
        savePedidos(pedidos);
      }
    });
  }

  // Tecla Escape para cerrar modales
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarModalSabores();
      cerrarModalWA();
    }
  });

  // Tareas de navegación móvil
  setupMobileTabs();
}

// ── SIDEBAR / LISTADO DE MESAS ────────────────────────────────
export function renderSidebar() {
  const sb = document.getElementById("sidebar");
  if (!sb) return;

  sb.innerHTML = `
    <div class="sidebar-header">
      <span class="sidebar-title">MESAS</span>
      <span class="sidebar-count">${MESAS} activas</span>
    </div>
  `;

  for (let i = 1; i <= MESAS; i++) {
    const totalItems = pedidos[i].items.reduce((acc, x) => acc + x.qty, 0);
    const subtotal = pedidos[i].items.reduce((acc, x) => acc + (x.qty * x.precio), 0);
    const esActiva = mesaActiva === i;
    const tieneItems = totalItems > 0;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `mesa-btn ${esActiva ? "activa" : ""} ${tieneItems ? "tiene-items" : ""}`;
    btn.setAttribute("aria-label", `Mesa ${i}, ${tieneItems ? totalItems + ' productos' : 'vacía'}`);
    
    btn.innerHTML = `
      <div class="mesa-badge-status ${tieneItems ? 'ocupada' : 'libre'}"></div>
      <div class="mesa-num-wrap">
        <span class="mesa-label">MESA</span>
        <span class="mesa-num">${i}</span>
      </div>
      <div class="mesa-info">
        <span class="mesa-items">${tieneItems ? `${totalItems} ${totalItems === 1 ? 'item' : 'items'}` : 'Libre'}</span>
        ${tieneItems ? `<span class="mesa-total">${RESTAURANT_CONFIG.moneda} ${subtotal.toFixed(2)}</span>` : ''}
      </div>
    `;

    btn.onclick = () => {
      selMesa(i);
      // En móvil, cambiar automáticamente a la pestaña de carta
      if (window.innerWidth <= 768) {
        switchMobileTab("carta");
      }
    };

    sb.appendChild(btn);
  }
}

export function selMesa(n, shouldSave = true) {
  mesaActiva = n;
  if (shouldSave) saveActiveMesa(n);

  const hmMesa = document.getElementById("hdr-mesa");
  const comentInput = document.getElementById("coment-general");

  if (hmMesa) {
    hmMesa.innerHTML = `<span class="hdr-dot"></span> Mesa ${n}`;
    hmMesa.className = "header-mesa activa";
  }

  if (comentInput) {
    comentInput.value = pedidos[n]?.comentario || "";
  }

  renderSidebar();
  renderCats();
  renderProductos();
  renderPedido();
  updateMobileBadges();
}

// ── CATEGORÍAS ────────────────────────────────────────────────
export function renderCats() {
  const bar = document.getElementById("cat-bar");
  if (!bar) return;

  bar.innerHTML = "";
  const categorias = Object.keys(MENU);

  categorias.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `cat-btn ${cat === catActiva ? "activa" : ""}`;
    btn.textContent = cat;
    btn.onclick = () => {
      catActiva = cat;
      renderCats();
      renderProductos();
    };
    bar.appendChild(btn);
  });
}

// ── PRODUCTOS ─────────────────────────────────────────────────
export function renderProductos() {
  const wrap = document.getElementById("productos-wrap");
  if (!wrap) return;

  if (!mesaActiva) {
    wrap.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🍗</div>
        <h3>Selecciona una mesa</h3>
        <p>Elige una mesa del panel lateral para registrar o consultar pedidos.</p>
        <button class="btn-action-primary" onclick="window.switchMobileTab('mesas')">Ver Mesas Disponibles</button>
      </div>
    `;
    return;
  }

  const prods = MENU[catActiva] || [];
  let html = `<div class="productos-grid">`;

  prods.forEach((p) => {
    const itemEnPedido = pedidos[mesaActiva]?.items.find((x) => x.prodId === p.id);
    const cantEnPedido = itemEnPedido ? itemEnPedido.qty : 0;

    html += `
      <div class="prod-card ${cantEnPedido > 0 ? "en-pedido" : ""}" onclick="window.clickProducto('${p.id}', '${catActiva}')">
        <div class="prod-card-top">
          <span class="prod-icon">${p.icono || "🍽️"}</span>
          ${p.maxSabores ? `<span class="prod-badge">Hasta ${p.maxSabores} ${p.maxSabores > 1 ? "sabores" : "sabor"}</span>` : ""}
          ${cantEnPedido > 0 ? `<span class="prod-qty-badge">${cantEnPedido}</span>` : ""}
        </div>
        <div class="prod-nombre">${p.nombre}</div>
        ${p.desc ? `<div class="prod-desc">${p.desc}</div>` : ""}
        <div class="prod-card-footer">
          <span class="prod-precio">${RESTAURANT_CONFIG.moneda} ${p.precio.toFixed(2)}</span>
          <button class="prod-add-btn" aria-label="Agregar ${p.nombre}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  wrap.innerHTML = html;
}

export function clickProducto(prodId, cat) {
  if (!mesaActiva) {
    showToast("⚠️ Primero selecciona una mesa", "warn");
    return;
  }

  const prod = MENU[cat]?.find((p) => p.id === prodId);
  if (!prod) return;

  if (prod.maxSabores && prod.saboresDisp) {
    abrirModalSabores(prod);
  } else {
    agregarItem(prod, [], null);
  }
}

export function agregarItem(prod, sabores = []) {
  if (!mesaActiva) return;

  const itemExistente = pedidos[mesaActiva].items.find(
    (x) => x.prodId === prod.id && JSON.stringify(x.sabores) === JSON.stringify(sabores) && !x.nota
  );

  if (itemExistente && sabores.length === 0) {
    itemExistente.qty += 1;
  } else {
    pedidos[mesaActiva].items.push({
      prodId: prod.id,
      nombre: prod.nombre,
      precio: prod.precio,
      qty: 1,
      sabores: [...sabores],
      nota: ""
    });
  }

  savePedidos(pedidos);
  renderProductos();
  renderPedido();
  renderSidebar();
  updateMobileBadges();
  showToast(`Agregado: ${prod.nombre}`, "success");
}

// ── MODAL DE SABORES Y DISTRIBUCIÓN ───────────────────────────
export function abrirModalSabores(prod) {
  modalCtx = { prod, sel: [], dist: {} };

  const tituloEl = document.getElementById("ms-titulo");
  const subEl = document.getElementById("ms-sub");
  const maxEl = document.getElementById("ms-max");
  const cntEl = document.getElementById("ms-cnt");
  const okBtn = document.getElementById("ms-ok");
  const distContainer = document.getElementById("ms-dist-container");
  const grid = document.getElementById("ms-grid");
  const modalEl = document.getElementById("modal-sabores");

  if (tituloEl) tituloEl.textContent = prod.nombre;
  if (subEl) subEl.textContent = `Selecciona hasta ${prod.maxSabores} ${prod.maxSabores > 1 ? "sabores" : "sabor"} para este pedido:`;
  if (maxEl) maxEl.textContent = prod.maxSabores;
  if (cntEl) cntEl.textContent = "0";
  if (okBtn) okBtn.disabled = true;
  if (distContainer) distContainer.style.display = "none";

  if (grid) {
    grid.innerHTML = "";
    prod.saboresDisp.forEach((s) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "sabor-btn";
      b.textContent = s;
      b.dataset.sabor = s;
      b.onclick = () => toggleSabor(s, b, prod.maxSabores);
      grid.appendChild(b);
    });
  }

  if (modalEl) modalEl.style.display = "flex";
}

export function toggleSabor(sabor, btn, max) {
  if (!modalCtx) return;
  const sel = modalCtx.sel;

  if (btn.classList.contains("sel")) {
    modalCtx.sel = sel.filter((s) => s !== sabor);
    if (modalCtx.dist) delete modalCtx.dist[sabor];
    btn.classList.remove("sel");
  } else {
    if (sel.length >= max) return;
    modalCtx.sel.push(sabor);

    if (modalCtx.prod.totalUnidades) {
      let totalAsignado = 0;
      modalCtx.sel.forEach((s) => {
        if (modalCtx.dist[s]) totalAsignado += modalCtx.dist[s];
      });
      modalCtx.dist[sabor] = Math.max(0, modalCtx.prod.totalUnidades - totalAsignado);
    }
    btn.classList.add("sel");
  }

  const cnt = modalCtx.sel.length;
  const cntEl = document.getElementById("ms-cnt");
  if (cntEl) cntEl.textContent = cnt;

  // Deshabilitar los botones restantes si se alcanzó el límite
  document.querySelectorAll(".sabor-btn").forEach((b) => {
    if (!b.classList.contains("sel")) {
      b.disabled = cnt >= max;
    }
  });

  verificarModalOk();
}

function verificarModalOk() {
  if (!modalCtx) return;
  const prod = modalCtx.prod;
  if (prod.totalUnidades) {
    renderDistribucion();
  } else {
    const okBtn = document.getElementById("ms-ok");
    if (okBtn) okBtn.disabled = modalCtx.sel.length === 0;
  }
}

function renderDistribucion() {
  const container = document.getElementById("ms-dist-container");
  const list = document.getElementById("ms-dist-list");
  const msg = document.getElementById("ms-restantes");
  const okBtn = document.getElementById("ms-ok");

  if (!modalCtx || modalCtx.sel.length === 0) {
    if (container) container.style.display = "none";
    if (okBtn) okBtn.disabled = true;
    return;
  }

  if (container) container.style.display = "block";

  let totalAsignado = 0;
  modalCtx.sel.forEach((s) => (totalAsignado += modalCtx.dist[s] || 0));
  const prod = modalCtx.prod;
  const faltan = prod.totalUnidades - totalAsignado;

  if (msg && okBtn) {
    if (faltan > 0) {
      msg.textContent = `Faltan distribuir ${faltan} alitas (${totalAsignado}/${prod.totalUnidades})`;
      msg.className = "ms-restantes incompleto";
      okBtn.disabled = true;
    } else if (faltan === 0) {
      msg.textContent = `¡Cantidades completas! (${prod.totalUnidades} alitas listas)`;
      msg.className = "ms-restantes completo";
      okBtn.disabled = false;
    } else {
      msg.textContent = `Exceso de unidades: sobran ${Math.abs(faltan)}`;
      msg.className = "ms-restantes exceso";
      okBtn.disabled = true;
    }
  }

  if (list) {
    list.innerHTML = "";
    modalCtx.sel.forEach((s) => {
      const qty = modalCtx.dist[s] || 0;
      const item = document.createElement("div");
      item.className = "flavor-qty-item";
      item.innerHTML = `
        <div class="flavor-qty-name">🍗 ${s}</div>
        <div class="flavor-qty-ctrl">
          <button type="button" class="fqbtn" onclick="window.cambiarDistSabor('${s}', -1)">−</button>
          <input type="number" class="fqin" value="${qty}" min="0" max="${prod.totalUnidades}" onchange="window.inputDistSabor('${s}', this.value)">
          <button type="button" class="fqbtn" onclick="window.cambiarDistSabor('${s}', 1)">+</button>
        </div>
      `;
      list.appendChild(item);
    });
  }
}

export function cambiarDistSabor(sabor, delta) {
  if (!modalCtx) return;
  const currentQty = modalCtx.dist[sabor] || 0;
  let totalAsignado = 0;
  modalCtx.sel.forEach((s) => (totalAsignado += modalCtx.dist[s] || 0));

  const faltan = modalCtx.prod.totalUnidades - totalAsignado;

  if (delta > 0 && faltan <= 0) return;
  if (delta < 0 && currentQty <= 0) return;

  modalCtx.dist[sabor] = currentQty + delta;
  renderDistribucion();
}

export function inputDistSabor(sabor, val) {
  if (!modalCtx) return;
  let v = parseInt(val, 10) || 0;
  if (v < 0) v = 0;

  let totalAsignado = 0;
  modalCtx.sel.forEach((s) => {
    if (s !== sabor) totalAsignado += modalCtx.dist[s] || 0;
  });

  if (totalAsignado + v > modalCtx.prod.totalUnidades) {
    v = modalCtx.prod.totalUnidades - totalAsignado;
  }

  modalCtx.dist[sabor] = v;
  renderDistribucion();
}

export function cerrarModalSabores() {
  const modalEl = document.getElementById("modal-sabores");
  if (modalEl) modalEl.style.display = "none";
  modalCtx = null;
}

export function confirmarSabores() {
  if (!modalCtx || modalCtx.sel.length === 0) return;

  const saboresFinales = [];
  if (modalCtx.prod.totalUnidades) {
    modalCtx.sel.forEach((s) => {
      const q = modalCtx.dist[s] || 0;
      if (q > 0) {
        saboresFinales.push(`${q} ${s}`);
      }
    });
  } else {
    saboresFinales.push(...modalCtx.sel);
  }

  agregarItem(modalCtx.prod, saboresFinales);
  cerrarModalSabores();
}

// ── PANEL DE PEDIDO / COMANDA ─────────────────────────────────
export function renderPedido() {
  const panel = document.getElementById("pedido-items");
  const titulo = document.getElementById("pedido-titulo");
  const totalEl = document.getElementById("total-monto");
  const waBtn = document.getElementById("btn-wa");
  const badgeMesa = document.getElementById("pedido-mesa-badge");

  if (!panel || !titulo || !totalEl || !waBtn) return;

  if (!mesaActiva) {
    titulo.textContent = "COMANDA";
    if (badgeMesa) badgeMesa.style.display = "none";
    panel.innerHTML = `
      <div class="empty-cart">
        <span class="empty-cart-icon">📝</span>
        <p>Selecciona una mesa para gestionar la comanda.</p>
      </div>
    `;
    totalEl.textContent = `${RESTAURANT_CONFIG.moneda} 0.00`;
    waBtn.disabled = true;
    return;
  }

  titulo.textContent = `MESA ${mesaActiva}`;
  if (badgeMesa) {
    badgeMesa.textContent = `Mesa ${mesaActiva}`;
    badgeMesa.style.display = "inline-block";
  }

  const items = pedidos[mesaActiva]?.items || [];

  if (items.length === 0) {
    panel.innerHTML = `
      <div class="empty-cart">
        <span class="empty-cart-icon">🛒</span>
        <p>No hay platos agregados a esta mesa.</p>
        <span class="empty-cart-sub">Toca cualquier plato de la carta para sumarlo.</span>
      </div>
    `;
    totalEl.textContent = `${RESTAURANT_CONFIG.moneda} 0.00`;
    waBtn.disabled = true;
    return;
  }

  let total = 0;
  let html = "";

  items.forEach((item, idx) => {
    const sub = item.qty * item.precio;
    total += sub;

    html += `
      <div class="pitem">
        <div class="pitem-top">
          <div class="pitem-info">
            <span class="pitem-nombre">${item.nombre}</span>
            <span class="pitem-unit-price">${RESTAURANT_CONFIG.moneda} ${item.precio.toFixed(2)} c/u</span>
          </div>
          <div class="qty-ctrl">
            <button type="button" class="qbtn" onclick="window.cambiarQty(${idx}, -1)" aria-label="Restar uno">−</button>
            <span class="qnum">${item.qty}</span>
            <button type="button" class="qbtn" onclick="window.cambiarQty(${idx}, 1)" aria-label="Sumar uno">+</button>
          </div>
        </div>

        ${item.sabores && item.sabores.length > 0 ? `
          <div class="pitem-sabores">
            ${item.sabores.map((s) => `<span class="sabor-tag">🍗 ${s}</span>`).join("")}
          </div>
        ` : ""}

        <div class="pitem-bottom">
          <span class="pitem-precio">${RESTAURANT_CONFIG.moneda} ${sub.toFixed(2)}</span>
          <button type="button" class="pitem-del-btn" onclick="window.eliminarItem(${idx})" title="Eliminar plato">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>

        <input type="text" class="nota-in" placeholder="Nota de cocina (ej: bien dorado, sin mayonesa)..." value="${escapeHtml(item.nota || "")}" oninput="window.setNota(${idx}, this.value)">
      </div>
    `;
  });

  panel.innerHTML = html;
  totalEl.textContent = `${RESTAURANT_CONFIG.moneda} ${total.toFixed(2)}`;
  waBtn.disabled = false;
}

export function cambiarQty(idx, delta) {
  if (!mesaActiva) return;
  const items = pedidos[mesaActiva].items;
  if (!items[idx]) return;

  items[idx].qty += delta;

  if (items[idx].qty <= 0) {
    items.splice(idx, 1);
  }

  savePedidos(pedidos);
  renderProductos();
  renderPedido();
  renderSidebar();
  updateMobileBadges();
}

export function eliminarItem(idx) {
  if (!mesaActiva) return;
  const items = pedidos[mesaActiva].items;
  if (items[idx]) {
    items.splice(idx, 1);
    savePedidos(pedidos);
    renderProductos();
    renderPedido();
    renderSidebar();
    updateMobileBadges();
  }
}

export function setNota(idx, val) {
  if (mesaActiva && pedidos[mesaActiva]?.items[idx]) {
    pedidos[mesaActiva].items[idx].nota = val;
    savePedidos(pedidos);
  }
}

export function limpiarPedido() {
  if (!mesaActiva) return;
  const items = pedidos[mesaActiva]?.items || [];
  if (items.length === 0) return;

  if (!confirm(`¿Deseas vaciar todos los productos de la Mesa ${mesaActiva}?`)) {
    return;
  }

  pedidos[mesaActiva] = { items: [], comentario: "" };
  savePedidos(pedidos);

  const comentInput = document.getElementById("coment-general");
  if (comentInput) comentInput.value = "";

  renderProductos();
  renderPedido();
  renderSidebar();
  updateMobileBadges();
  showToast(`Mesa ${mesaActiva} vaciada`, "info");
}

// ── WHATSAPP DISPATCH ─────────────────────────────────────────
export function abrirModalWA() {
  if (!mesaActiva) return;
  if (pedidos[mesaActiva].items.length === 0) return;

  const inputPhone = document.getElementById("phone-in");
  const modalWA = document.getElementById("modal-wa");

  if (inputPhone) inputPhone.value = waPhone;
  if (modalWA) modalWA.style.display = "flex";
}

export function cerrarModalWA() {
  const modalWA = document.getElementById("modal-wa");
  if (modalWA) modalWA.style.display = "none";
}

export function enviarWA() {
  const inputPhone = document.getElementById("phone-in");
  if (!inputPhone) return;

  const phone = inputPhone.value.replace(/\D/g, "");
  if (!phone || phone.length < 8) {
    alert("Por favor ingresa un número de WhatsApp válido (con código de país, ej: 51900694550)");
    return;
  }

  waPhone = phone;
  saveWhatsAppPhone(phone);

  const items = pedidos[mesaActiva].items;
  const comentario = pedidos[mesaActiva].comentario;
  let total = 0;

  let msg = `🍗 *ALITAS FIELES — COMANDA MESA ${mesaActiva}*\n`;
  msg += `⏰ Hora: ${new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  // Agrupar platos por categoría
  const porCat = {};
  items.forEach((item) => {
    const cat = Object.keys(MENU).find((c) => MENU[c].some((p) => p.id === item.prodId)) || "Otros";
    if (!porCat[cat]) porCat[cat] = [];
    porCat[cat].push(item);
  });

  Object.entries(porCat).forEach(([cat, lista]) => {
    msg += `📍 *${cat.toUpperCase()}*\n`;
    lista.forEach((item) => {
      const sub = item.qty * item.precio;
      total += sub;
      msg += `  • *${item.qty}x* ${item.nombre} — ${RESTAURANT_CONFIG.moneda} ${sub.toFixed(2)}`;
      if (item.sabores && item.sabores.length > 0) {
        msg += `\n    🍗 _Sabores:_ ${item.sabores.join(", ")}`;
      }
      if (item.nota) {
        msg += `\n    📝 _Nota:_ ${item.nota}`;
      }
      msg += `\n`;
    });
    msg += `\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *TOTAL A COBRAR: ${RESTAURANT_CONFIG.moneda} ${total.toFixed(2)}*\n`;
  if (comentario && comentario.trim().length > 0) {
    msg += `\n📌 *Comentario General de Mesa:* ${comentario.trim()}\n`;
  }
  msg += `\n_Enviado desde Mesa Alitas Fieles POS_`;

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  cerrarModalWA();
  showToast("Pedido enviado a WhatsApp", "success");
}

// ── NAVEGACIÓN MÓVIL ──────────────────────────────────────────
function setupMobileTabs() {
  const tabs = document.querySelectorAll(".mobile-nav-btn");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      switchMobileTab(target);
    });
  });
}

export function switchMobileTab(tabName) {
  currentMobileTab = tabName;

  document.querySelectorAll(".mobile-nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });

  const sidebar = document.getElementById("sidebar");
  const menuWrap = document.querySelector(".menu-wrap");
  const pedidoPanel = document.querySelector(".pedido-panel");

  if (!sidebar || !menuWrap || !pedidoPanel) return;

  sidebar.classList.toggle("mobile-active", tabName === "mesas");
  menuWrap.classList.toggle("mobile-active", tabName === "carta");
  pedidoPanel.classList.toggle("mobile-active", tabName === "pedido");
}

function updateMobileBadges() {
  const badgeCart = document.getElementById("mobile-cart-badge");
  if (!badgeCart) return;

  let totalItemsMesa = 0;
  if (mesaActiva && pedidos[mesaActiva]) {
    totalItemsMesa = pedidos[mesaActiva].items.reduce((s, x) => s + x.qty, 0);
  }

  if (totalItemsMesa > 0) {
    badgeCart.textContent = totalItemsMesa;
    badgeCart.style.display = "flex";
  } else {
    badgeCart.style.display = "none";
  }
}

// ── UTILIDADES ────────────────────────────────────────────────
function showToast(message, type = "info") {
  const existing = document.querySelector(".toast-notification");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast-notification ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

// Exponer funciones necesarias en window para onclicks inline en HTML
window.clickProducto = clickProducto;
window.cambiarDistSabor = cambiarDistSabor;
window.inputDistSabor = inputDistSabor;
window.cerrarModalSabores = cerrarModalSabores;
window.confirmarSabores = confirmarSabores;
window.cambiarQty = cambiarQty;
window.eliminarItem = eliminarItem;
window.setNota = setNota;
window.limpiarPedido = limpiarPedido;
window.abrirModalWA = abrirModalWA;
window.cerrarModalWA = cerrarModalWA;
window.enviarWA = enviarWA;
window.switchMobileTab = switchMobileTab;
