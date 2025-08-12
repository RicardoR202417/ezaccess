const express = require('express');
const router = express.Router();
const nfcController = require('../controllers/nfcController');
const verificarToken = require('../middlewares/verificarToken');


router.post('/tagfija/:uid', verificarToken, nfcController.validarNFC);

module.exports = router;
