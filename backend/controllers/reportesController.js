// controllers/reportesController.js
const { Op, fn, col, where: sequelizeWhere } = require("sequelize");
const { HistorialAsignacion, Usuario, Cajon } = require("../models");

exports.getHistorial = async (req, res) => {
  try {
    const { usuario, numero_caj, desde, hasta } = req.query;

    // Filtros principales
    const whereClause = {};

    // Filtro por usuario (id_usu)
    if (usuario && usuario !== "") {
      whereClause.id_usu = usuario;
    }

    // Filtro de fechas (SOLO fecha, no hora)
    let andFilters = [];
    if ((desde && desde !== "") || (hasta && hasta !== "")) {
      let fechaFiltro = {};
      if (desde && desde !== "") fechaFiltro[Op.gte] = desde;
      if (hasta && hasta !== "") fechaFiltro[Op.lte] = hasta;
      andFilters.push(
        sequelizeWhere(fn('DATE', col('fecha')), fechaFiltro)
      );
    }

    // Filtro por número de cajón (se aplica en el include)
    const includeCajon = {
      model: Cajon,
      attributes: ["id_caj", "numero_caj"]
    };
    if (numero_caj && numero_caj !== "") {
      includeCajon.where = { numero_caj: numero_caj };
    }

    // Búsqueda principal
    const registros = await HistorialAsignacion.findAll({
      where: andFilters.length > 0
        ? { ...whereClause, [Op.and]: andFilters }
        : whereClause,
      include: [
        {
          model: Usuario,
          attributes: ["id_usu", "nombre_usu"],
        },
        includeCajon,
      ],
      order: [["fecha", "DESC"]],
    });

    // Formato de salida
    const resultado = registros.map((r) => ({
      id_historial: r.id_historial,
      fecha_evento: r.fecha,
      id_asig: r.id_asig,
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
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};
