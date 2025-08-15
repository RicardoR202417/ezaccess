// controllers/reportesController.js
const { Op, QueryTypes } = require("sequelize");
const { sequelize, HistorialAsignacion, Usuario, Cajon } = require("../models");

/**
 * GET /api/reportes/historial
 * Query opcionales:
 *  - usuario=<id_usu>
 *  - numero_caj=<texto/folio del cajón>
 *  - desde=YYYY-MM-DD
 *  - hasta=YYYY-MM-DD
 */
exports.getHistorial = async (req, res) => {
  try {
    console.log("Query recibida:", req.query);
    const { usuario, numero_caj, desde, hasta } = req.query;
    const where = {};

    if (usuario) where.id_usu = usuario;

    if (desde || hasta) {
      where.fecha = {};
      if (desde) where.fecha[Op.gte] = desde;
      if (hasta) where.fecha[Op.lte] = hasta;
    }

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
      fecha: r.fecha,
      usuario: r.Usuario?.nombre_usu || "Sin usuario",
      cajon: r.Cajon?.numero_caj || "Sin cajón",
      tipo_asig: r.tipo_asig,
      estado_asig: r.estado_asig,
      accion: r.accion,
    }));

    res.json({ datos: resultado });
  } catch (error) {
    console.error("Error en getHistorial:", error);
    res
      .status(500)
      .json({ mensaje: "Error del servidor", error: error.message, stack: error.stack });
  }
};

/**
 * GET /api/reportes/asignaciones
 * Lee la vista v_todas_asignaciones con filtros opcionales.
 * Query opcionales:
 *  - zona=Zona C
 *  - estado_asig=activa|finalizada
 *  - tipo_asig=manual|automatica
 *  - minEntradas30d=0..n
 *  - id_usu=<id>
 */
exports.getAsignacionesReporte = async (req, res) => {
  try {
    const {
      zona,
      estado_asig,
      tipo_asig,
      minEntradas30d,
      id_usu,
    } = req.query;

    let sql = `SELECT * FROM v_todas_asignaciones WHERE 1=1`;
    const params = {};

    if (zona) {
      sql += ` AND ubicacion_caj = :zona`;
      params.zona = zona;
    }
    if (estado_asig) {
      sql += ` AND estado_asig = :estado_asig`;
      params.estado_asig = estado_asig;
    }
    if (tipo_asig) {
      sql += ` AND tipo_asig = :tipo_asig`;
      params.tipo_asig = tipo_asig;
    }
    if (minEntradas30d) {
      sql += ` AND entradas_30d >= :minEntradas30d`;
      params.minEntradas30d = Number(minEntradas30d);
    }
    if (id_usu) {
      sql += ` AND id_usu = :id_usu`;
      params.id_usu = Number(id_usu);
    }

    sql += ` ORDER BY entradas_30d DESC, fecha_asig DESC, residente ASC`;

    const rows = await sequelize.query(sql, {
      replacements: params,
      type: QueryTypes.SELECT,
    });

    res.json({ datos: rows });
  } catch (error) {
    console.error("Error en getAsignacionesReporte:", error);
    res
      .status(500)
      .json({ mensaje: "Error del servidor", error: error.message, stack: error.stack });
  }
};
