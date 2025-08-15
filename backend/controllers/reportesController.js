// controllers/reportesController.js
const { Op, QueryTypes } = require("sequelize");
const { sequelize, HistorialAsignacion, Usuario, Cajon } = require("../models");

/** GET /api/reportes/historial */
exports.getHistorial = async (req, res) => {
  try {
    const { usuario, numero_caj, desde, hasta } = req.query;
    const where = {};
    if (usuario) where.id_usu = usuario;

    if (desde || hasta) {
      where.fecha = {};
      if (desde) where.fecha[Op.gte] = desde;
      if (hasta) where.fecha[Op.lte] = hasta;
    }

    const includeCajon = {
      model: Cajon,
      attributes: ["id_caj", "numero_caj"],
      ...(numero_caj ? { where: { numero_caj }, required: true } : {}),
    };

    const registros = await HistorialAsignacion.findAll({
      where,
      include: [{ model: Usuario, attributes: ["id_usu", "nombre_usu"] }, includeCajon],
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
    res.status(500).json({ mensaje: "Error del servidor", error: error.message, stack: error.stack });
  }
};

/** GET /api/reportes/asignaciones (public.v_todas_asignaciones) */
exports.getAsignacionesReporte = async (req, res) => {
  try {
    const { zona, estado_asig, tipo_asig, minEntradas30d, id_usu } = req.query;

    let sql = `SELECT * FROM public.v_todas_asignaciones WHERE 1=1`;
    const params = {};

    if (zona) { sql += ` AND ubicacion_caj = :zona`; params.zona = zona; }
    if (estado_asig) { sql += ` AND estado_asig = :estado_asig`; params.estado_asig = estado_asig; }
    if (tipo_asig) { sql += ` AND tipo_asig = :tipo_asig`; params.tipo_asig = tipo_asig; }
    if (minEntradas30d) { sql += ` AND entradas_30d >= :minEntradas30d`; params.minEntradas30d = Number(minEntradas30d); }
    if (id_usu) { sql += ` AND id_usu = :id_usu`; params.id_usu = Number(id_usu); }

    sql += ` ORDER BY entradas_30d DESC, fecha_asig DESC, residente ASC`;

    const rows = await sequelize.query(sql, { replacements: params, type: QueryTypes.SELECT });
    res.json({ datos: rows });
  } catch (error) {
    console.error("Error en getAsignacionesReporte:", error);
    res.status(500).json({ mensaje: "Error del servidor", error: error.message, stack: error.stack });
  }
};

/** GET /api/reportes/vehicular-clasificado (public.v_vehicular_clasificado) */
exports.getVehicularClasificado = async (req, res) => {
  try {
    const { q, min_total, min_veh, orderBy, orderDir, limit, offset } = req.query;

    const ALLOWED_ORDER = new Set([
      "id_usu", "nombre_usu", "total_solicitudes", "vehiculares",
      "porcentaje_vehicular", "clasificacion_vehicular",
    ]);

    const orderCol = ALLOWED_ORDER.has(orderBy) ? orderBy : "vehiculares";
    const orderDirection =
      orderDir && ["ASC", "DESC"].includes(String(orderDir).toUpperCase())
        ? String(orderDir).toUpperCase()
        : "DESC";

    const whereParts = [];
    const params = {};

    if (q) { whereParts.push(`nombre_usu ILIKE :q`); params.q = `%${q}%`; }
    if (min_total) { whereParts.push(`total_solicitudes >= :min_total`); params.min_total = Number(min_total); }
    if (min_veh) { whereParts.push(`vehiculares >= :min_veh`); params.min_veh = Number(min_veh); }

    let sql = `
      SELECT id_usu, nombre_usu, total_solicitudes, vehiculares,
             porcentaje_vehicular, clasificacion_vehicular
      FROM public.v_vehicular_clasificado
      WHERE 1=1
    `;
    if (whereParts.length) sql += ` AND ` + whereParts.join(` AND `);
    sql += ` ORDER BY ${orderCol} ${orderDirection}`;

    let lim = 0, off = 0;
    if (limit)  lim = Math.min(Math.max(parseInt(limit, 10) || 0, 0), 200);
    if (offset) off = Math.max(parseInt(offset, 10) || 0, 0);
    if (lim > 0) sql += ` LIMIT ${lim}`;
    if (off > 0) sql += ` OFFSET ${off}`;

    // Diagnóstico mínimo
    console.log("🧪 [vehicular-clasificado] SQL:", sql, "params:", params);

    const rows = await sequelize.query(sql, { replacements: params, type: QueryTypes.SELECT });
    res.json({ datos: rows });
  } catch (error) {
    console.error("Error en getVehicularClasificado:", error);
    res.status(500).json({ mensaje: "Error del servidor", error: error.message, stack: error.stack });
  }
};

/** GET /api/reportes/_diag */
exports.diagReportes = async (_req, res) => {
  try {
    const [meta] = await sequelize.query(
      `SELECT current_user, current_database() AS db, version(),
              current_setting('search_path') AS search_path`,
      { type: QueryTypes.SELECT }
    );

    const [exists] = await sequelize.query(
      `SELECT to_regclass('public.v_vehicular_clasificado') AS vref`,
      { type: QueryTypes.SELECT }
    );

    const [countRow] = await sequelize.query(
      `SELECT COUNT(*)::int AS total FROM public.v_vehicular_clasificado`,
      { type: QueryTypes.SELECT }
    );

    res.json({
      ok: true,
      meta,
      vista_resuelta: exists?.vref || null,
      total_registros_en_vista: countRow?.total ?? null,
    });
  } catch (error) {
    console.error("Error en diagReportes:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
};
