const express = require('express');
const router = express.Router();
const nfcController = require('../controllers/nfcController');

router.post('/tagfija/:uid', verificarToken, nfcController.validarNFC);

module.exports = router;
