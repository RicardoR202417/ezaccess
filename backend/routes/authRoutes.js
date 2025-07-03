const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verificarToken = require('../middlewares/verificarToken');

router.get('/usuarios', verificarToken, authController.obtenerUsuarios);


router.post('/login', authController.login);

router.post('/usuarios', authController.registrar);

module.exports = router;


