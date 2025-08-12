const express = require('express');
const router = express.Router();
const nfcController = require('../controllers/nfcController');

router.post('/tagfija/:uid', nfcController.validarTagFijo);

module.exports = router;
