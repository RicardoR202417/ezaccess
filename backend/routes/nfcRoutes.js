const express = require('express');
const router = express.Router();
const nfcController = require('../controllers/nfcController');

router.post('/validate', nfcController.validarNFC);

module.exports = router;
