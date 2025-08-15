// routes/reportes.js
const express = require("express");
const router = express.Router();

const {
  getHistorial,
  getAsignacionesReporte,
  getVehicularClasificado,
  diagReportes,
} = require("../controllers/reportesController");

// Log al cargar
console.log("📦 routes/reportes.js cargado");

// Sanity check del módulo
router.get("/_ping", (_req, res) => {
  res.json({
    ok: true,
    modulo: "reportes",
    rutas: ["/historial", "/asignaciones", "/vehicular-clasificado", "/_diag"],
  });
});

// Diagnóstico (search_path, vista y conteo)
router.get("/_diag", diagReportes);

// Ruta de prueba para descartar problemas de controller
router.get("/vehicular-clasificado/test", (_req, res) => {
  res.json({ ok: true, via: "router", endpoint: "/vehicular-clasificado/test" });
});

// Historial de actividad
router.get("/historial", getHistorial);

// Reporte de asignaciones (vista public.v_todas_asignaciones)
router.get("/asignaciones", getAsignacionesReporte);

// Reporte vehicular (vista public.v_vehicular_clasificado)
router.get("/vehicular-clasificado", getVehicularClasificado);

module.exports = router;
