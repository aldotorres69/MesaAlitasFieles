# 🍗 Alitas Fieles — Sistema de Comandas & Mesas POS

<p align="center">
  <b>Sistema web profesional para la toma de pedidos por mesa y despacho directo a cocina mediante WhatsApp.</b><br>
  Diseñado para restaurantes, pollerías y aliterías con atención ágil en salón y barra.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JS%20ES6+-E34F26" alt="Frontend Stack">
  <img src="https://img.shields.io/badge/Arquitectura-Modular%20Desacoplada-2563EB" alt="Modular">
  <img src="https://img.shields.io/badge/Diseño-Responsive%20(Móvil%20%2F%20POS)-10B981" alt="Responsive">
  <img src="https://img.shields.io/badge/Despacho-WhatsApp%20Directo-25D366" alt="WhatsApp">
  <img src="https://img.shields.io/badge/Persistencia-LocalStorage%20Offline-F59E0B" alt="LocalStorage">
</p>

---

## 🌟 Características Principales

1. **Gestión de Mesas en Salón (12 Mesas):**
   * Vista de estado en tiempo real (Libre vs. Ocupada con contador de items y subtotal acumulado).
   * Selección rápida e intuitiva.

2. **Reparto Inteligente de Sabores de Alitas:**
   * Soporte para selección de hasta 4 sabores simultáneos (BBQ, Acevichadas, Búfalo, Anticucheras, etc.).
   * **Distribuidor exacto de unidades:** Permite desglosar combos (ej: en 8 alitas asignar 4 BBQ y 4 Acevichadas) con validación automática antes de ingresar la orden.

3. **Despacho Automatizado a Cocina / Caja vía WhatsApp:**
   * Genera un mensaje formateado con negritas, emojis, categorías, hora, notas especiales de cocción y total en Soles (S/).
   * Guarda en memoria local el número de WhatsApp del encargado para no tener que escribirlo cada vez.

4. **Persistencia Local Antirreseteo (`localStorage`):**
   * Si el mesero recarga la página por accidente o pierde señal, los pedidos de todas las mesas se mantienen a salvo.

5. **Diseño Adaptativo Móvil & Tablet (Responsive POS):**
   * En computadoras y tablets muestra el layout de 3 columnas (Mesas | Carta | Comanda).
   * En celulares muestra una barra inferior táctil (*Mesas / Carta / Comanda*) con badge numérico para máxima comodidad con una sola mano.

---

## 📁 Estructura del Proyecto

El proyecto ha sido separado de forma limpia y profesional en archivos modulares:

```text
MesaAlitasFieles/
├── index.html            # Estructura semántica HTML5 accesible
├── css/
│   └── style.css         # Hoja de estilos con variables CSS, animaciones y responsive
├── js/
│   ├── data.js           # Catálogo del menú, precios, sabores y configuración
│   ├── storage.js        # Persistencia en LocalStorage (pedidos, mesas, teléfono)
│   └── app.js            # Lógica interactiva, control de estados y despacho WA
└── README.md             # Documentación oficial del sistema
```

---

## 🚀 Cómo Ejecutar el Proyecto

No requiere Node.js, compilar ni instalar dependencias pesadas:

1. **Opción 1: Abrir directamente en el navegador**
   * Simplemente haz doble clic en `index.html` o usa la extensión *Live Server* en VS Code.

2. **Opción 2: Desplegar en GitHub Pages (100% Gratis)**
   * Ve a la pestaña **Settings** de tu repositorio en GitHub.
   * Selecciona **Pages** en el menú izquierdo.
   * En *Branch*, elige `main` y la carpeta `/ (root)`.
   * ¡Listo! En 1 minuto tendrás una URL pública para que todos los mozos la usen desde sus celulares.

---

## 🍗 Catálogo y Personalización

Para agregar nuevos platos, modificar precios o sumar más mesas:
* Abre [`js/data.js`](js/data.js).
* Edita el objeto `MENU` o la constante `RESTAURANT_CONFIG`.
* Los cambios se verán reflejados al instante sin alterar la lógica del sistema.
