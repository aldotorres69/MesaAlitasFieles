/**
 * Alitas Fieles — Catálogo de Productos y Configuración
 * Archivo de datos desacoplado para fácil mantenimiento de precios y platos.
 */

export const RESTAURANT_CONFIG = {
  nombre: "Alitas Fieles",
  totalMesas: 12,
  moneda: "S/",
  telefonoCocinaDefault: "51900694550", // Número por defecto para cocina / caja
  horarioAtencion: "5:00 PM - 11:30 PM"
};

export const SABORES_ALITAS = [
  "BBQ",
  "Acevichadas",
  "Búfalo Picante",
  "Anticucheras",
  "Doradas",
  "Broasters",
  "Maracuyá",
  "Honey Mustard"
];

export const MENU = {
  "Alitas": [
    {
      id: "al8",
      nombre: "8 Alitas",
      precio: 25.90,
      desc: "Incluye papas fritas crocantes + cremas artesanales",
      maxSabores: 2,
      saboresDisp: SABORES_ALITAS,
      totalUnidades: 8,
      icono: "🍗"
    }
  ],
  "Hamburguesas": [
    {
      id: "hb1",
      nombre: "La Clásica",
      precio: 13.90,
      desc: "Carne artesanal, lechuga fresca, tomate y papas",
      icono: "🍔"
    },
    {
      id: "hb2",
      nombre: "La Cubana",
      precio: 15.90,
      desc: "Carne, lechuga, tomate, huevo frito, plátano y papas",
      icono: "🍔"
    },
    {
      id: "hb3",
      nombre: "La Simona",
      precio: 16.90,
      desc: "Carne, lechuga, tomate, doble queso cheddar fundido y papas",
      icono: "🍔"
    },
    {
      id: "hb4",
      nombre: "La Hawaiana",
      precio: 17.90,
      desc: "Carne, lechuga, tomate, queso cheddar, piña caramelizada y papas",
      icono: "🍔"
    },
    {
      id: "hb5",
      nombre: "La Tramposa",
      precio: 22.90,
      desc: "Carne, queso cheddar, huevo, tocino crocante, lechuga, tomate y papas",
      icono: "🍔"
    },
    {
      id: "hb6",
      nombre: "Todo Terreno",
      precio: 27.90,
      desc: "Doble carne, doble queso cheddar, tocino, lechuga, tomate y papas",
      icono: "🍔"
    }
  ],
  "Salchipapas": [
    {
      id: "sp1",
      nombre: "La Clásica",
      precio: 13.90,
      desc: "Salchicha frankfurter premium y papas fritas doradas",
      icono: "🍟"
    },
    {
      id: "sp2",
      nombre: "La Cubana",
      precio: 15.90,
      desc: "Salchicha frankfurter, huevo frito, plátano dulce y papas",
      icono: "🍟"
    },
    {
      id: "sp3",
      nombre: "La Incondicional",
      precio: 18.90,
      desc: "Frankfurter, chorizo parrillero, finas hierbas, trozos de pollo y papas",
      icono: "🍟"
    },
    {
      id: "sp4",
      nombre: "La Santa",
      precio: 21.90,
      desc: "Frankfurter, chorizo, queso fundido, trozos de pollo y papas",
      icono: "🍟"
    }
  ],
  "Promos": [
    {
      id: "pr1",
      nombre: "Soltero.com",
      precio: 20.00,
      desc: "5 alitas (1 sabor) + gaseosa personal",
      maxSabores: 1,
      saboresDisp: SABORES_ALITAS,
      totalUnidades: 5,
      icono: "🔥"
    },
    {
      id: "pr2",
      nombre: "Super Fiel",
      precio: 36.90,
      desc: "12 alitas (hasta 3 sabores)",
      maxSabores: 3,
      saboresDisp: SABORES_ALITAS,
      totalUnidades: 12,
      icono: "🔥"
    },
    {
      id: "pr3",
      nombre: "Combo Traición",
      precio: 50.00,
      desc: "20 alitas (hasta 2 sabores) + Pepsi 1 Litro",
      maxSabores: 2,
      saboresDisp: SABORES_ALITAS,
      totalUnidades: 20,
      icono: "🔥"
    },
    {
      id: "pr4",
      nombre: "2 pa 2",
      precio: 90.00,
      desc: "40 alitas (hasta 4 sabores) + Pepsi 1½ Litro",
      maxSabores: 4,
      saboresDisp: SABORES_ALITAS,
      totalUnidades: 40,
      icono: "🔥"
    }
  ],
  "Refrescos": [
    { id: "rf1", nombre: "Chicha Morada 1L", precio: 13.90, desc: "Receta casera de maíz morado", icono: "🥤" },
    { id: "rf2", nombre: "Limonada 1L Normal", precio: 13.90, desc: "Jugo natural recién exprimido", icono: "🍋" },
    { id: "rf3", nombre: "Limonada 1L Frozen", precio: 16.90, desc: "Refrescante frappeada", icono: "❄️" },
    { id: "rf4", nombre: "Maracuyá 1L Normal", precio: 13.90, desc: "Pura fruta natural", icono: "🥤" },
    { id: "rf5", nombre: "Maracuyá 1L Frozen", precio: 16.90, desc: "Refrescante frappeada", icono: "❄️" },
    { id: "rf6", nombre: "Maracumango 1L Normal", precio: 13.90, desc: "Maracuyá con mango natural", icono: "🥭" },
    { id: "rf7", nombre: "Maracumango 1L Frozen", precio: 16.90, desc: "Frappeada frozen", icono: "❄️" },
    { id: "rf8", nombre: "Fresa Limón 1L Normal", precio: 13.90, desc: "Fresa fresca con toque cítrico", icono: "🍓" },
    { id: "rf9", nombre: "Fresa Limón 1L Frozen", precio: 16.90, desc: "Frappeada frozen", icono: "❄️" }
  ],
  "Gaseosas": [
    { id: "gs1", nombre: "Inca Kola / Coca Cola ½L", precio: 5.00, desc: "Botella personal helada", icono: "🥤" },
    { id: "gs2", nombre: "Inca Kola / Coca Cola 1L", precio: 10.00, desc: "Botella 1 Litro", icono: "🥤" },
    { id: "gs3", nombre: "Inca Kola / Coca Cola 1½L", precio: 12.00, desc: "Botella familiar 1.5 Litros", icono: "🥤" },
    { id: "gs4", nombre: "Pepsi 1L", precio: 7.00, desc: "Botella 1 Litro", icono: "🥤" }
  ],
  "Tragos": [
    { id: "tr1", nombre: "Chilcano Clásico", precio: 15.90, desc: "Pisco Quebranta, ginger ale y limón", icono: "🍹" },
    { id: "tr2", nombre: "Mojito Cubano", precio: 15.90, desc: "Ron blanco, hierbabuena fresca y soda", icono: "🍹" },
    { id: "tr3", nombre: "Pisco Sour", precio: 15.90, desc: "Tradicional pisco sour espumante", icono: "🍸" },
    { id: "tr4", nombre: "Daiquiri de Frutas", precio: 16.90, desc: "Ron y pulpa frozen", icono: "🍸" }
  ]
};
