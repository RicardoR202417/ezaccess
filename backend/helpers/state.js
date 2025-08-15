// helpers/state.js
module.exports = {
  plumas: { entrada: 0, salida: 0, tope: 0, tope_reset: 0, updatedAt: new Date().toISOString() },

  // === Tercer servo ===
  // flags one-shot como en plumas/tope, pero sin autocierre del lado del ESP.
  tercero: { open: 0, close: 0, lastState: 0, updatedAt: new Date().toISOString() },
};
