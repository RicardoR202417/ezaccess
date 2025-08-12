const Usuario = require('../models/Usuario');

// UIDs físicos fijos
const UID_ENTRADA = 'AE381C06';
const UID_SALIDA = '1AA51C06';

exports.validarNFC = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = req.usuario;

    if (!uid || !usuario?.id) {
      return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
    }

    const tipo_tag = uid.toUpperCase() === UID_ENTRADA
      ? 'entrada'
      : uid.toUpperCase() === UID_SALIDA
      ? 'salida'
      : null;

    if (!tipo_tag) {
      return res.status(403).json({ mensaje: 'UID no reconocido' });
    }

    const id_usu = usuario.id;

    if (tipo_tag === 'entrada') {
      // Lógica de asignación automática (puede ser un stored procedure o función)
      const result = await db.query(`SELECT asignar_cajon(${id_usu})`);
      if (result.rows[0].asignar_cajon === 'YA_DENTRO') {
        return res.json({ mensaje: 'Ya tienes acceso activo.' });
      }
      return res.json({ mensaje: 'Acceso otorgado. Cajón asignado.' });
    }

    if (tipo_tag === 'salida') {
      // Liberar cajón (desasignar)
      const result = await db.query(`
        UPDATE asignaciones SET estado_asig = 'finalizada'
        WHERE id_usu = $1 AND estado_asig = 'activa'
        RETURNING *;
      `, [id_usu]);

      if (result.rowCount === 0) {
        return res.json({ mensaje: 'No tenías un acceso activo.' });
      }

      return res.json({ mensaje: 'Salida registrada. Cajón liberado.' });
    }

  } catch (error) {
    console.error('Error en validarNFC:', error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
