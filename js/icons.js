/**
 * Alitas Fieles — Catálogo de Iconos Vectoriales SVG
 * Diseñados con dimensiones explícitas, trazo reforzado y máxima compatibilidad.
 */

(function () {
  const ICONS = {
    // ── CATEGORÍAS ──────────────────────────────────────────────
    Alitas: `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15.5 15.5C13 18 9 18 6.5 15.5c-2.4-2.4-2.4-6.4 0-8.9s6.5-2.5 8.9 0l4.2 4.2c.4.4.4 1 0 1.4l-4.1 3.3z"/>
        <circle cx="5" cy="19" r="2"/>
        <circle cx="8" cy="21" r="1.5"/>
      </svg>
    `,

    Hamburguesas: `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 11a8 8 0 0 1 16 0H4z"/>
        <path d="M3 14h18"/>
        <path d="M4 18h16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/>
        <path d="M6 14c.5-1 2-1 2.5 0s2 1 2.5 0 2-1 2.5 0 2 1 2.5 0 2-1 2 0"/>
      </svg>
    `,

    Salchipapas: `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 10l1.5 11h11L19 10H5z"/>
        <path d="M8 3v7"/>
        <path d="M12 2v8"/>
        <path d="M16 4v6"/>
        <path d="M4 10h16"/>
      </svg>
    `,

    Promos: `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
      </svg>
    `,

    Refrescos: `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 2h10l-1 11a5 5 0 0 1-5 4h0a5 5 0 0 1-5-4L5 2h2z"/>
        <path d="M12 17v5"/>
        <path d="M8 22h8"/>
        <path d="M6 7h12"/>
      </svg>
    `,

    Gaseosas: `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="7" y="5" width="10" height="16" rx="3"/>
        <path d="M9 2h6"/>
        <path d="M12 2v3"/>
        <path d="M7 10h10"/>
      </svg>
    `,

    Tragos: `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 22h8"/>
        <path d="M12 15v7"/>
        <path d="M5 3l7 8 7-8H5z"/>
        <path d="M7 6h10"/>
      </svg>
    `,

    // ── ICONOS DEL SISTEMA POS & PEDIDO ─────────────────────────
    Receipt: `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/>
        <path d="M8 7h8"/>
        <path d="M8 11h8"/>
        <path d="M8 15h5"/>
      </svg>
    `,

    Table: `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="5" width="18" height="6" rx="1.5"/>
        <path d="M6 11v8M18 11v8M10 11v5M14 11v5"/>
      </svg>
    `,

    Minus: `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" y1="12" x2="20" y2="12"/>
      </svg>
    `,

    Plus: `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="4" x2="12" y2="20"/>
        <line x1="4" y1="12" x2="20" y2="12"/>
      </svg>
    `,

    Trash: `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>
    `
  };

  window.ICONS = ICONS;
  window.getCategoryIcon = function (catName) {
    return ICONS[catName] || ICONS.Receipt;
  };
})();
