// controllers/nfcController.js
const { Asignacion, Usuario, Cajon, sequelize } = require('../models');

// UIDs físicos fijos
const UID_ENTRADA = 'C51FF905';
const UID_SALIDA  = '827C3906';

exports.validarNFC = async (req, res) => {
  try {
    const { uid } = req.params;
    const usuarioToken = req.usuario; // lo setea verificarToken
    const idUsuario = usuarioToken?.id || usuarioToken?.id_usu;

    if (!uid || !idUsuario) {
      return res.status(400).json({ mensaje: 'Faltan datos requeridos (uid o usuario)' });
    }

    const uidUpper = String(uid).toUpperCase();
    const tipo_tag =
      uidUpper === UID_ENTRADA ? 'entrada' :
      uidUpper === UID_SALIDA  ? 'salida'  :
      null;

    if (!tipo_tag) {
      return res.status(403).json({ mensaje: 'UID no reconocido' });
    }

    // ============= ENTRADA =============
    if (tipo_tag === 'entrada') {
      // 1) ¿Ya tiene asignación activa?
      const asignacionActiva = await Asignacion.findOne({
        where: { id_usu: idUsuario, estado_asig: 'activa' },
        include: [{ model: Cajon, attributes: ['id_caj','numero_caj','ubicacion_caj'] }]
      });

      if (asignacionActiva) {
        return res.json({
          mensaje: 'Ya tienes acceso activo.',
          tipo: 'entrada',
          asignacion: {
            id_asig: asignacionActiva.id_asig,
            cajon: asignacionActiva.Cajon || null
          }
        });
      }

      // 2) Ejecuta el procedimiento de asignación automática
      //    (ajusta el nombre si en tu DB se llama distinto)
      await sequelize.query('CALL asignar_cajon_automatico(:p_id_usu)', {
        replacements: { p_id_usu: idUsuario }
      });

      // 3) Confirma qué asignación quedó activa
      const nuevaAsignacion = await Asignacion.findOne({
        where: { id_usu: idUsuario, estado_asig: 'activa' },
        order: [['fecha_asig', 'DESC']],
        include: [{ model: Cajon, attributes: ['id_caj','numero_caj','ubicacion_caj'] }]
      });

      if (!nuevaAsignacion) {
        // No se asignó nada: ya tenía una, no hay disponibles, etc.
        return res.status(200).json({
          mensaje: 'No se pudo asignar un cajón (ya tenías uno o no hay disponibles).',
          tipo: 'entrada'
        });
      }

      return res.json({
        mensaje: 'Acceso otorgado. Cajón asignado automáticamente.',
        tipo: 'entrada',
        asignacion: {
          id_asig: nuevaAsignacion.id_asig,
          cajon: nuevaAsignacion.Cajon || null
        }
      });
    }

    // ============= SALIDA =============
    if (tipo_tag === 'salida') {
      const asignacionActiva = await Asignacion.findOne({
        where: { id_usu: idUsuario, estado_asig: 'activa' }
      });

      if (!asignacionActiva) {
        return res.json({ mensaje: 'No tenías un acceso activo.', tipo: 'salida' });
      }

      asignacionActiva.estado_asig = 'finalizada';
      await asignacionActiva.save();

      return res.json({ mensaje: 'Salida registrada. Cajón liberado.', tipo: 'salida' });
    }

    // (por seguridad, aunque nunca llega aquí)
    return res.status(400).json({ mensaje: 'Tipo de tag no válido' });

  } catch (error) {
    console.error('Error en validarNFC:', error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
