// backend/controllers/consultasController.js

const sequelize = require('../config/db'); // Asegúrate que este sea tu Sequelize

exports.obtenerVehicularClasificado = async (req, res) => {
  try {
    const [resultados] = await sequelize.query(`
      SELECT * 
      FROM v_vehicular_clasificado 
      ORDER BY vehiculares DESC
    `);

    res.status(200).json(resultados);
  } catch (error) {
    console.error('❌ Error al obtener datos de la vista v_vehicular_clasificado:', error);
    res.status(500).json({ mensaje: 'Error al consultar los datos' });
  }
};
