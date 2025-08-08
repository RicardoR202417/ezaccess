// controllers/reportesController.js
const { Op } = require("sequelize");
const { HistorialAsignacion, Usuario, Cajon } = require("../models");

exports.getHistorial = async (req, res) => {
  try {
    const { usuario, numero_caj, desde, hasta } = req.query;
    const where = {};

    // Filtro por usuario
    if (usuario) where.id_usu = usuario;

    // Filtro por fecha
    if (desde || hasta) {
      where.fecha = {};
      if (desde) where.fecha[Op.gte] = desde;
      if (hasta) where.fecha[Op.lte] = hasta;
    }

    // Filtro por número de cajón (en el include)
    let includeCajon = {
      model: Cajon,
      attributes: ["id_caj", "numero_caj"],
    };
    if (numero_caj) {
      includeCajon.where = { numero_caj };
      includeCajon.required = true;
    }

    const registros = await HistorialAsignacion.findAll({
      where,
      include: [
        {
          model: Usuario,
          attributes: ["id_usu", "nombre_usu"],
        },
        includeCajon,
      ],
      order: [["fecha", "DESC"]],
    });

    const resultado = registros.map((r) => ({
      id_historial: r.id_historial,
      fecha: r.fecha, // <-- usa el campo correcto
      usuario: {
        id_usu: r.Usuario?.id_usu,
        nombre_usu: r.Usuario?.nombre_usu,
      },
      cajon: {
        id_caj: r.Cajon?.id_caj,
        numero_caj: r.Cajon?.numero_caj,
      },
      tipo_asig: r.tipo_asig,
      estado_asig: r.estado_asig,
      accion: r.accion,
    }));

    res.json({ datos: resultado });
  } catch (error) {
    console.error("Error en getHistorial:", error);
    res.status(500).json({ mensaje: "Error del servidor", error: error.message, stack: error.stack });
  }
};
