// controllers/reportesController.js
const { Op } = require("sequelize");
const { HistorialAsignacion, Usuario, Cajon } = require("../models");

exports.getHistorial = async (req, res) => {
  try {
    const { usuario, cajon, desde, hasta } = req.query;

    // Armar cláusula where dinámico
    const where = {};
    if (usuario) where.id_usu = usuario;
    if (cajon) where.id_caj = cajon;
    if (desde || hasta) {
      where.fecha = {};
      if (desde) where.fecha[Op.gte] = new Date(desde);
      if (hasta) where.fecha[Op.lte] = new Date(hasta);
    }

    const registros = await HistorialAsignacion.findAll({
      where,
      include: [
        {
          model: Usuario,
          as: "Usuario",
          attributes: ["id_usu", "nombre_usu"],
        },
        {
          model: Cajon,
          as: "cajon", // ← coincide con el alias anterior
          attributes: ["id_caj", "numero_caj"],
        },
      ],
      order: [["fecha", "DESC"]],
    });

    const resultado = registros.map((r) => ({
      id_historial: r.id_historial,
      fecha_evento: r.fecha,
      id_asig: r.id_asig,
      usuario: {
        id_usu: r.Usuario?.id_usu,
        nombre_usu: r.Usuario?.nombre_usu,
      },
      cajon: {
        id_caj: r.cajon?.id_caj,
        numero_caj: r.cajon?.numero_caj,
      },
      tipo_asig: r.tipo_asig,
      estado_asig: r.estado_asig,
      accion: r.accion,
    }));

    res.json({ datos: resultado });
  } catch (error) {
    console.error("Error en getHistorial:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};
