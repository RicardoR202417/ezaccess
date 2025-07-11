const express = require('express');
const router = express.Router();
const sequelize = require('../config/db'); // Usa sequelize, no db.execute

router.post('/solicitudes-visita', async (req, res) => {
  try {
    const {
      nombre_sol,
      apellido_pat_sol,
      apellido_mat_sol,
      tel_sol,
      correo_sol,
      fecha_visita_sol,
      motivo_sol
    } = req.body;

    await sequelize.query(
      `INSERT INTO solicitudes_visita 
        (nombre_sol, apellido_pat_sol, apellido_mat_sol, tel_sol, correo_sol, fecha_visita_sol, motivo_sol) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          nombre_sol,
          apellido_pat_sol,
          apellido_mat_sol,
          tel_sol,
          correo_sol,
          fecha_visita_sol,
          motivo_sol
        ],
        type: sequelize.QueryTypes.INSERT
      }
    );

    res.status(201).json({ mensaje: 'Solicitud registrada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar la solicitud' });
  }
});

module.exports = router;