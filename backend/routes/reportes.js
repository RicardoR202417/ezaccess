const express = require("express");
const router = express.Router();
const { getHistorial } = require("../controllers/reportesController");

router.get("/historial", getHistorial);

module.exports = router;