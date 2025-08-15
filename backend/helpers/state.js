// helpers/state.js
module.exports = {
  // “legacy” para plumas globales (se conserva sus nombres)
  plumas: {
    entrada: 0,
    salida: 0,
    tope: 0,
    tope_reset: 0,
    updatedAt: new Date().toISOString(),
  },

  // Mapa por cajón para “one-shot” del tope
  // Clave: id_cajon (string); Valor: 0/1
  topes_down: {}, // órdenes “bajar”
  topes_up:   {}, // órdenes “subir”
};
