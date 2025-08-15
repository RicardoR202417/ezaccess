const express = require("express");
const router = express.Router();
const {
  getHistorial,
  getAsignacionesReporte,
} = require("../controllers/reportesController");

router.get("/historial", getHistorial);
router.get("/asignaciones", getAsignacionesReporte);

module.exports = router;
