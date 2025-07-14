const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Usuario = require('./Usuario');
const Acceso = require('./Acceso');

module.exports = {
  Usuario,
  Acceso
};

