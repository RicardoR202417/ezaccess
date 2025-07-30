const express = require('express');
const router = express.Router();
const cajonesController = require('../controllers/cajonesController');

router.get('/cajones/estado', cajonesController.obtenerCajonesConEstado);
router.put('/cajones/:id_caj/estado', cajonesController.cambiarEstadoCajon);
router.put('/cajones/estado/todos', cajonesController.cambiarEstadoTodos);

module.exports = router;
