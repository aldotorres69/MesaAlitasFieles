/**
 * Alitas Fieles — Lógica Principal de la Aplicación
 * Compatible con ejecución local (file://) y servidor web (http://)
 * Con iconografía completa y botones de cantidad de alta visibilidad.
 */

(function () {
  const CONFIG = window.RESTAURANT_CONFIG || { totalMesas: 12, moneda: "S/", telefonoCocinaDefault: "51900694550" };
  const MENU = window.MENU || {};
  const ICONS = window.ICONS || {};
  const Storage = window.StorageService || {
    loadPedidos: (n) => {
      const p = {};
      for (let i = 1; i <= n; i++) p[i] = { items: [], comentario: "" };
      return p;
    },
    savePedidos: () => {},
    loadWhatsAppPhone: (d) => d,
    saveWhatsAppPhone: () => {},
    loadActiveMesa: () => null,
    saveActiveMesa: () => {}
  };

  const MESAS = CONFIG.totalMesas || 12;
  let mesaActiva = Storage.loadActiveMesa();
  let catActiva = Object.keys(MENU)[0] || "Alitas";
  let pedidos = Storage.loadPedidos(MESAS);
  let waPhone = Storage.loadWhatsAppPhone(CONFIG.telefonoCocinaDefault);
  let modalCtx = null;

  // ── INICIALIZACIÓN ───────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", initApp);
  // Por si el DOM ya cargó
  if (document.readyState === "interactive" || document.readyState === "complete") {
    initApp();
  }

  function initApp() {
    bindEvents();
    startLiveClock();
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
    const comentInput = document.getElementById("coment-general");
    if (comentInput) {
      comentInput.addEventListener("input", (e) => {
        if (mesaActiva) {
          pedidos[mesaActiva].comentario = e.target.value;
          Storage.savePedidos(pedidos);
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        cerrarModalSabores();
        cerrarModalWA();
      }
    });

    setupMobileTabs();
  }

  function startLiveClock() {
    const clockEl = document.getElementById("live-clock");
    if (!clockEl) return;
    const update = () => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
    };
    update();
    setInterval(update, 10000);
  }

  // ── SIDEBAR / LISTADO DE MESAS ──────────────────────────────
  function renderSidebar() {
    const sb = document.getElementById("sidebar");
    if (!sb) return;

    sb.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-title-box">
          <span class="sidebar-icon">${ICONS.Table || "🪑"}</span>
          <span class="sidebar-title">MESAS</span>
        </div>
        <span class="sidebar-count">${MESAS}</span>
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
          ${tieneItems ? `<span class="mesa-total">${CONFIG.moneda} ${subtotal.toFixed(2)}</span>` : ''}
        </div>
      `;

      btn.onclick = () => {
        selMesa(i);
        if (window.innerWidth <= 768) {
          switchMobileTab("carta");
        }
      };

      sb.appendChild(btn);
    }
  }

  function selMesa(n, shouldSave = true) {
    mesaActiva = n;
    if (shouldSave) Storage.saveActiveMesa(n);

    const hmMesa = document.getElementById("hdr-mesa");
    const hmMesaTxt = document.getElementById("hdr-mesa-txt");
    const comentInput = document.getElementById("coment-general");

    if (hmMesa && hmMesaTxt) {
      hmMesaTxt.textContent = `Mesa ${n}`;
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

  // ── CATEGORÍAS CONCORDANTES CON ICONOS ──────────────────────
  function renderCats() {
    const bar = document.getElementById("cat-bar");
    if (!bar) return;

    bar.innerHTML = "";
    const categorias = Object.keys(MENU);

    categorias.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `cat-btn ${cat === catActiva ? "activa" : ""}`;
      const itemsCount = MENU[cat]?.length || 0;
      const catIcon = window.getCategoryIcon(cat);

      btn.innerHTML = `
        <span class="cat-btn-icon">${catIcon}</span>
        <span class="cat-btn-label">${cat}</span>
        <span class="cat-btn-count">${itemsCount}</span>
      `;

      btn.onclick = () => {
        catActiva = cat;
        renderCats();
        renderProductos();
      };

      bar.appendChild(btn);
    });
  }

  // ── PRODUCTOS ───────────────────────────────────────────────
  function renderProductos() {
    const wrap = document.getElementById("productos-wrap");
    if (!wrap) return;

    if (!mesaActiva) {
      wrap.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon-box">
            ${ICONS.Table || "🪑"}
          </div>
          <h3>Selecciona una mesa para empezar</h3>
          <p>Toca una mesa en el panel lateral para registrar o consultar comandas.</p>
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
      const catIcon = window.getCategoryIcon(catActiva);

      html += `
        <div class="prod-card ${cantEnPedido > 0 ? "en-pedido" : ""}" onclick="window.clickProducto('${p.id}', '${catActiva}')">
          <div class="prod-card-top">
            <span class="prod-icon-box">${catIcon}</span>
            ${p.maxSabores ? `<span class="prod-badge">Hasta ${p.maxSabores} ${p.maxSabores > 1 ? "sabores" : "sabor"}</span>` : `<span class="prod-tag-simple">${catActiva}</span>`}
            ${cantEnPedido > 0 ? `<span class="prod-qty-badge">${cantEnPedido}</span>` : ""}
          </div>
          <div class="prod-nombre">${p.nombre}</div>
          ${p.desc ? `<div class="prod-desc">${p.desc}</div>` : ""}
          <div class="prod-card-footer">
            <div class="prod-price-wrap">
              <span class="prod-currency">${CONFIG.moneda}</span>
              <span class="prod-precio">${p.precio.toFixed(2)}</span>
            </div>
            <button class="prod-add-btn" type="button" aria-label="Agregar ${p.nombre}">
              ${ICONS.Plus || "+"}
            </button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    wrap.innerHTML = html;
  }

  function clickProducto(prodId, cat) {
    if (!mesaActiva) {
      showToast("⚠️ Primero selecciona una mesa", "warn");
      return;
    }

    const prod = MENU[cat]?.find((p) => p.id === prodId);
    if (!prod) return;

    if (prod.maxSabores && prod.saboresDisp) {
      abrirModalSabores(prod);
    } else {
      agregarItem(prod, []);
    }
  }

  function agregarItem(prod, sabores = []) {
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

    Storage.savePedidos(pedidos);
    renderProductos();
    renderPedido();
    renderSidebar();
    updateMobileBadges();
    showToast(`Agregado: ${prod.nombre}`, "success");
  }

  // ── MODAL SABORES ───────────────────────────────────────────
  function abrirModalSabores(prod) {
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
    if (subEl) subEl.textContent = `Selecciona hasta ${prod.maxSabores} ${prod.maxSabores > 1 ? "sabores" : "sabor"}:`;
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
        b.innerHTML = `<span class="sabor-icon">${ICONS.Alitas || "🍗"}</span> <span>${s}</span>`;
        b.dataset.sabor = s;
        b.onclick = () => toggleSabor(s, b, prod.maxSabores);
        grid.appendChild(b);
      });
    }

    if (modalEl) modalEl.style.display = "flex";
  }

  function toggleSabor(sabor, btn, max) {
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
        msg.textContent = `Faltan ${faltan} alitas (${totalAsignado}/${prod.totalUnidades})`;
        msg.className = "ms-restantes incompleto";
        okBtn.disabled = true;
      } else if (faltan === 0) {
        msg.textContent = `¡Cantidades completas! (${prod.totalUnidades} alitas)`;
        msg.className = "ms-restantes completo";
        okBtn.disabled = false;
      } else {
        msg.textContent = `Exceso de piezas: sobran ${Math.abs(faltan)}`;
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
          <div class="flavor-qty-name">
            <span class="flavor-qty-icon">${ICONS.Alitas || "🍗"}</span>
            <span>${s}</span>
          </div>
          <div class="flavor-qty-ctrl">
            <button type="button" class="fqbtn fqbtn-minus" onclick="window.cambiarDistSabor('${s}', -1)">−</button>
            <input type="number" class="fqin" value="${qty}" min="0" max="${prod.totalUnidades}" onchange="window.inputDistSabor('${s}', this.value)">
            <button type="button" class="fqbtn fqbtn-plus" onclick="window.cambiarDistSabor('${s}', 1)">+</button>
          </div>
        `;
        list.appendChild(item);
      });
    }
  }

  function cambiarDistSabor(sabor, delta) {
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

  function inputDistSabor(sabor, val) {
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

  function cerrarModalSabores() {
    const modalEl = document.getElementById("modal-sabores");
    if (modalEl) modalEl.style.display = "none";
    modalCtx = null;
  }

  function confirmarSabores() {
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

  // ── PANEL DE PEDIDO / COMANDA ───────────────────────────────
  function renderPedido() {
    const panel = document.getElementById("pedido-items");
    const titulo = document.getElementById("pedido-titulo");
    const subtitulo = document.getElementById("pedido-subtitulo");
    const statusDot = document.getElementById("pedido-status-dot");
    const badgeMesa = document.getElementById("pedido-mesa-badge");
    const totalEl = document.getElementById("total-monto");
    const waBtn = document.getElementById("btn-wa");
    const btnHdrLimpiar = document.getElementById("btn-hdr-limpiar");

    if (!panel || !titulo || !totalEl || !waBtn) return;

    // ESTADO: SIN MESA SELECCIONADA
    if (!mesaActiva) {
      titulo.textContent = "MI PEDIDO";
      if (subtitulo) subtitulo.textContent = "Selecciona una mesa";
      if (statusDot) statusDot.className = "pedido-status-dot inactivo";
      if (badgeMesa) badgeMesa.style.display = "none";
      if (btnHdrLimpiar) btnHdrLimpiar.disabled = true;

      panel.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon-box">
            ${ICONS.Receipt || "📋"}
          </div>
          <p>Comanda en espera</p>
          <span class="empty-cart-sub">Selecciona una mesa para gestionar productos y despacho.</span>
        </div>
      `;
      totalEl.textContent = `${CONFIG.moneda} 0.00`;
      waBtn.disabled = true;
      return;
    }

    // ESTADO: MESA ACTIVA
    const items = pedidos[mesaActiva]?.items || [];
    const totalItems = items.reduce((s, x) => s + x.qty, 0);

    titulo.textContent = `MESA ${mesaActiva}`;
    if (badgeMesa) {
      badgeMesa.textContent = "En Atención";
      badgeMesa.style.display = "inline-flex";
    }

    if (statusDot) {
      statusDot.className = "pedido-status-dot activo";
    }

    if (btnHdrLimpiar) {
      btnHdrLimpiar.disabled = items.length === 0;
    }

    if (items.length === 0) {
      if (subtitulo) subtitulo.textContent = "0 productos agregados";
      panel.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon-box">
            ${ICONS.Receipt || "📋"}
          </div>
          <p>Comanda vacía</p>
          <span class="empty-cart-sub">Toca cualquier plato de la carta para sumarlo a la Mesa ${mesaActiva}.</span>
        </div>
      `;
      totalEl.textContent = `${CONFIG.moneda} 0.00`;
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
              <span class="pitem-unit-price">${CONFIG.moneda} ${item.precio.toFixed(2)} c/u</span>
            </div>
            <div class="qty-ctrl">
              <button type="button" class="qbtn qbtn-minus" onclick="window.cambiarQty(${idx}, -1)" title="Restar 1">
                −
              </button>
              <span class="qnum">${item.qty}</span>
              <button type="button" class="qbtn qbtn-plus" onclick="window.cambiarQty(${idx}, 1)" title="Sumar 1">
                +
              </button>
            </div>
          </div>

          ${item.sabores && item.sabores.length > 0 ? `
            <div class="pitem-sabores">
              ${item.sabores.map((s) => `<span class="sabor-tag">${ICONS.Alitas || "🍗"} ${s}</span>`).join("")}
            </div>
          ` : ""}

          <div class="pitem-bottom">
            <span class="pitem-precio">${CONFIG.moneda} ${sub.toFixed(2)}</span>
            <button type="button" class="pitem-del-btn" onclick="window.eliminarItem(${idx})" title="Eliminar plato">
              ${ICONS.Trash || "🗑️"}
            </button>
          </div>

          <input type="text" class="nota-in" placeholder="Nota de cocina (ej: bien dorado, sin cremas)..." value="${escapeHtml(item.nota || "")}" oninput="window.setNota(${idx}, this.value)">
        </div>
      `;
    });

    if (subtitulo) {
      subtitulo.textContent = `${totalItems} ${totalItems === 1 ? 'producto' : 'productos'} en comanda`;
    }

    panel.innerHTML = html;
    totalEl.textContent = `${CONFIG.moneda} ${total.toFixed(2)}`;
    waBtn.disabled = false;
  }

  function cambiarQty(idx, delta) {
    if (!mesaActiva) return;
    const items = pedidos[mesaActiva].items;
    if (!items[idx]) return;

    items[idx].qty += delta;

    if (items[idx].qty <= 0) {
      items.splice(idx, 1);
    }

    Storage.savePedidos(pedidos);
    renderProductos();
    renderPedido();
    renderSidebar();
    updateMobileBadges();
  }

  function eliminarItem(idx) {
    if (!mesaActiva) return;
    const items = pedidos[mesaActiva].items;
    if (items[idx]) {
      items.splice(idx, 1);
      Storage.savePedidos(pedidos);
      renderProductos();
      renderPedido();
      renderSidebar();
      updateMobileBadges();
    }
  }

  function setNota(idx, val) {
    if (mesaActiva && pedidos[mesaActiva]?.items[idx]) {
      pedidos[mesaActiva].items[idx].nota = val;
      Storage.savePedidos(pedidos);
    }
  }

  function limpiarPedido() {
    if (!mesaActiva) return;
    const items = pedidos[mesaActiva]?.items || [];
    if (items.length === 0) return;

    if (!confirm(`¿Deseas vaciar todos los productos de la Mesa ${mesaActiva}?`)) {
      return;
    }

    pedidos[mesaActiva] = { items: [], comentario: "" };
    Storage.savePedidos(pedidos);

    const comentInput = document.getElementById("coment-general");
    if (comentInput) comentInput.value = "";

    renderProductos();
    renderPedido();
    renderSidebar();
    updateMobileBadges();
    showToast(`Mesa ${mesaActiva} vaciada`, "info");
  }

  // ── WHATSAPP DISPATCH ───────────────────────────────────────
  function abrirModalWA() {
    if (!mesaActiva) return;
    if (pedidos[mesaActiva].items.length === 0) return;

    const inputPhone = document.getElementById("phone-in");
    const modalWA = document.getElementById("modal-wa");

    if (inputPhone) inputPhone.value = waPhone;
    if (modalWA) modalWA.style.display = "flex";
  }

  function cerrarModalWA() {
    const modalWA = document.getElementById("modal-wa");
    if (modalWA) modalWA.style.display = "none";
  }

  function enviarWA() {
    const inputPhone = document.getElementById("phone-in");
    if (!inputPhone) return;

    const phone = inputPhone.value.replace(/\D/g, "");
    if (!phone || phone.length < 8) {
      alert("Por favor ingresa un número de WhatsApp válido (con código de país, ej: 51900694550)");
      return;
    }

    waPhone = phone;
    Storage.saveWhatsAppPhone(phone);

    const items = pedidos[mesaActiva].items;
    const comentario = pedidos[mesaActiva].comentario;
    let total = 0;

    let msg = `🍗 *ALITAS FIELES — COMANDA MESA ${mesaActiva}*\n`;
    msg += `⏰ Hora: ${new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

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
        msg += `  • *${item.qty}x* ${item.nombre} — ${CONFIG.moneda} ${sub.toFixed(2)}`;
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
    msg += `💰 *TOTAL A COBRAR: ${CONFIG.moneda} ${total.toFixed(2)}*\n`;
    if (comentario && comentario.trim().length > 0) {
      msg += `\n📌 *Comentario General de Mesa:* ${comentario.trim()}\n`;
    }
    msg += `\n_Enviado desde Mesa Alitas Fieles POS_`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    cerrarModalWA();
    showToast("Comanda enviada a WhatsApp", "success");
  }

  // ── NAVEGACIÓN MÓVIL ────────────────────────────────────────
  function setupMobileTabs() {
    const tabs = document.querySelectorAll(".mobile-nav-btn");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tab;
        switchMobileTab(target);
      });
    });
  }

  function switchMobileTab(tabName) {
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

  // Exposición en window
  window.selMesa = selMesa;
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
})();
