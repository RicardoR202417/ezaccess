const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verificarToken = require('../middlewares/verificarToken'); // Importación correcta del middleware
const AuthGoogleController = require('../controllers/AuthGoogleController');

router.get('/usuarios', verificarToken, authController.obtenerUsuarios);

router.post('/usuarios', authController.registrar);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.put('/usuarios/:id_usu', authController.editarUsuario);
router.delete('/usuarios/:id_usu', authController.eliminarUsuario);

router.get('/usuarios/:id_usu', authController.obtenerUsuarioPorId);

router.post('/google', AuthGoogleController.loginConGoogle);

module.exports = router;




module.exports = router;