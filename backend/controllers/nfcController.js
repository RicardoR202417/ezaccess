// controllers/nfcController.js

const models = require('../models'); // 👈 importar el objeto completo si da problemas con desestructuración
const Usuario = models.Usuario;
const Acceso = models.Acceso;

exports.validarUID = async (req, res) => {
  const { uid } = req.body;

  console.log("🛰️ UID recibido:", uid);

  if (!uid) return res.status(400).json({ error: 'UID requerido' });

  try {
    const usuario = await Usuario.findOne({ where: { codigo_nfc_usu: uid } });

    if (!usuario) return res.json({ permitido: false });

    // Buscar si ya tiene un acceso sin salida
    const accesoActivo = await Acceso.findOne({
      where: {
        id_usu: usuario.id_usu,
        fecha_sal_acc: null
      },
      order: [['fecha_ent_acc', 'DESC']]
    });

    if (accesoActivo) {
      // Registrar salida
      accesoActivo.fecha_sal_acc = new Date();
      await accesoActivo.save();

      return res.json({
        permitido: true,
        tipo: 'salida',
        nombre: usuario.nombre_usu
      });
    } else {
      // Registrar entrada (con cajón 1 por defecto)
      await Acceso.create({
        id_usu: usuario.id_usu,
        id_caj: 1,
        fecha_ent_acc: new Date()
      });

      return res.json({
        permitido: true,
        tipo: 'entrada',
        nombre: usuario.nombre_usu
      });
    }
  } catch (err) {
    console.error('❌ Error en validarUID:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
