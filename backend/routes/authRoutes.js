const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verificarToken = require('../middlewares/verificarToken'); // Importación correcta del middleware

router.get('/usuarios', verificarToken, authController.obtenerUsuarios);

router.post('/usuarios', authController.registrar);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.put('/usuarios/:id_usu', usuarioController.editarUsuario);

router.delete('/usuarios/:id_usu', usuarioController.eliminarUsuario);


module.exports = router;