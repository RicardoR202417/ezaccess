const { Usuario, Acceso, Cajon, Asignacion } = require('../models');
const { Op, Sequelize } = require('sequelize');

exports.validarUID = async (req, res) => {
  const { uid } = req.body;

  console.log("🛰️ UID recibido:", uid);
  if (!uid) return res.status(400).json({ error: 'UID requerido' });

  try {
    const usuario = await Usuario.findOne({ where: { codigo_nfc_usu: uid } });
    if (!usuario) return res.json({ permitido: false });

    const accesoActivo = await Acceso.findOne({
      where: { id_usu: usuario.id_usu, fecha_sal_acc: null },
      order: [['fecha_ent_acc', 'DESC']]
    });

    if (accesoActivo) {
      // REGISTRAR SALIDA y finalizar asignación activa
      const asignacionActiva = await Asignacion.findOne({
        where: { id_usu: usuario.id_usu, estado_asig: 'activa' }
      });

      if (asignacionActiva) {
        asignacionActiva.estado_asig = 'finalizada';
        await asignacionActiva.save();
      }

      accesoActivo.fecha_sal_acc = new Date();
      await accesoActivo.save();

      return res.json({
        permitido: true,
        tipo: 'salida',
        nombre: usuario.nombre_usu,
        id_usu: usuario.id_usu
      });
    } else {
      // BUSCAR CAJÓN LIBRE
      const cajonLibre = await Cajon.findOne({
        where: {
          id_caj: {
            [Op.notIn]: Sequelize.literal(`(
              SELECT id_caj FROM asignaciones WHERE estado_asig = 'activa'
            )`)
          }
        }
      });

      if (!cajonLibre) {
        return res.status(400).json({ error: 'No hay cajones disponibles' });
      }

      // Crear asignación
      await Asignacion.create({
        id_usu: usuario.id_usu,
        id_caj: cajonLibre.id_caj,
        tipo_asig: 'automatica',
        estado_asig: 'activa'
      });

      // Registrar acceso
      await Acceso.create({
        id_usu: usuario.id_usu,
        id_caj: cajonLibre.id_caj,
        fecha_ent_acc: new Date()
      });

      return res.json({
        permitido: true,
        tipo: 'entrada',
        nombre: usuario.nombre_usu,
        id_usu: usuario.id_usu,
        cajon: {
          id: cajonLibre.id_caj,
          numero: cajonLibre.numero_caj,
          ubicacion: cajonLibre.ubicacion_caj
        }
      });
    }
  } catch (err) {
    console.error('❌ Error en validarUID:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
