const { Cajon, Asignacion, Usuario, Actuador, Sensor } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los cajones con su estado (ocupado o libre) y el usuario que lo ocupa
// Obtener todos los cajones con su estado (ocupado o libre) y el usuario que lo ocupa
exports.obtenerCajonesConEstado = async (req, res) => {
  try {
    const cajones = await Cajon.findAll({
      include: [
        {
          model: Asignacion,
          where: { estado_asig: ['activa', 'pendiente'] },
          required: false,
          include: [
            {
              model: Usuario,
              attributes: ['id_usu', 'nombre_usu'],
              required: false
            }
          ]
        }
      ]
    });

    const cajonesConEstado = cajones.map((cajon) => {
      const asignacionActiva = cajon.Asignacions && cajon.Asignacions.length > 0
        ? cajon.Asignacions[0]
        : null;

      return {
        id_caj: cajon.id_caj,
        numero_caj: cajon.numero_caj,
        ubicacion_caj: cajon.ubicacion_caj,
estado: asignacionActiva
  ? (asignacionActiva.estado_asig === 'pendiente' ? 'pendiente' : 'ocupado')
  : 'libre',
estado_asig: asignacionActiva ? asignacionActiva.estado_asig : null,
 // <- para botón
        usuario_ocupante: asignacionActiva && asignacionActiva.Usuario
          ? asignacionActiva.Usuario.nombre_usu
          : null,
        id_usuario_ocupante: asignacionActiva && asignacionActiva.Usuario
          ? asignacionActiva.Usuario.id_usu
          : null
      };
    });

    res.json(cajonesConEstado);
  } catch (error) {
    console.error('Error al obtener los cajones:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Obtener el estado completo de los cajones con asignaciones, actuadores y sensores
exports.obtenerEstadoCompleto = async (req, res) => {
  try {
    const cajones = await Cajon.findAll({
      include: [
        {
          model: Asignacion,
          where: { estado_asig: 'activa' },
          required: false,
          include: [
            {
              model: Usuario,
              attributes: ['id_usu', 'nombre_usu'],
              required: false
            }
          ]
        },
        {
          model: Actuador,
          attributes: ['id_act', 'estado_act'],
          required: false
        },
        {
          model: Sensor,
          attributes: ['id_sen', 'estado_sen', 'fecha_lectura_sen'],
          required: false
        }
      ]
    });

    const resultado = cajones.map(cajon => {
      const asignacionActiva = cajon.Asignacions && cajon.Asignacions.length > 0
        ? cajon.Asignacions[0]
        : null;
      return {
        id_caj: cajon.id_caj,
        numero_caj: cajon.numero_caj,
        ubicacion_caj: cajon.ubicacion_caj,
        estado: asignacionActiva ? 'ocupado' : 'libre',
        usuario_ocupante: asignacionActiva && asignacionActiva.Usuario
          ? asignacionActiva.Usuario.nombre_usu
          : null,
        actuador: cajon.actuadore || null,
        sensor: cajon.sensore || null
      };
    });

    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener el estado completo de los cajones:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

exports.cambiarEstadoTodos = async (req, res) => {
  const { accion, id_usu } = req.body; // ← ahora id_usu se toma del body

  try {
    const cajones = await Cajon.findAll();

    for (const cajon of cajones) {
      if (accion === 'activar') {
        if (!id_usu) continue; // Evita crear asignaciones sin usuario
        const existeAsignacion = await Asignacion.findOne({
          where: {
            id_caj: cajon.id_caj,
            estado_asig: 'activa',
          },
        });

        if (!existeAsignacion) {
          await Asignacion.create({
            id_caj: cajon.id_caj,
            id_usu,
            tipo_asig: 'manual',
            estado_asig: 'activa',
          });
        }
      } else if (accion === 'finalizar') {
        const asignacion = await Asignacion.findOne({
          where: {
            id_caj: cajon.id_caj,
            estado_asig: 'activa',
          },
        });

        if (asignacion) {
          asignacion.estado_asig = 'finalizada';
          await asignacion.save();
        }
      }
    }

    res.json({ mensaje: `Asignaciones ${accion === 'activar' ? 'activadas' : 'finalizadas'} correctamente.` });
  } catch (error) {
    console.error("Error al cambiar el estado de todos los cajones:", error);
    res.status(500).json({ mensaje: "Error al procesar los cajones." });
  }
};

// Obtener el cupo por zona (ocupados y libres)
exports.obtenerCupoPorZona = async (req, res) => {
  const { zona } = req.params; // Recibe la zona como parámetro
  
  // Mapear zonas normalizadas a valores reales de la DB
  const zonaMap = {
    'zona_a': 'Zona A',
    'zona_c': 'Zona C', 
    'zona_d': 'Zona D',
    'zona_e': 'Zona E'
  };
  
  const zonaReal = zonaMap[zona.toLowerCase()] || zona;
  
  console.log(`Zona recibida: ${zona}, Zona real para DB: ${zonaReal}`);

  try {
    const cajones = await Cajon.findAll({
      where: { ubicacion_caj: zonaReal }, // Filtra por zona exacta
      include: [
        {
          model: Asignacion,
          where: { estado_asig: 'activa' },
          required: false,
        },
      ],
    });

    console.log(`Cajones encontrados para ${zonaReal}:`, cajones.length);

    const totalOcupados = cajones.filter((cajon) => cajon.Asignacions && cajon.Asignacions.length > 0).length;
    const totalLibres = cajones.length - totalOcupados;

    res.json({
      zona: zonaReal,
      totalOcupados,
      totalLibres,
      totalCajones: cajones.length,
    });
  } catch (error) {
    console.error('Error al obtener el cupo por zona:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
exports.cambiarEstadoCajon = async (req, res) => {
  const { id_caj } = req.params;
  const { accion, id_usu } = req.body;

  try {
    const cajon = await Cajon.findByPk(id_caj);
    if (!cajon) {
      return res.status(404).json({ mensaje: 'Cajón no encontrado' });
    }

    if (accion === 'activar') {
      if (!id_usu) {
        return res.status(400).json({ mensaje: 'Falta el id_usu en la solicitud.' });
      }

      const existeAsignacion = await Asignacion.findOne({
        where: { id_caj, estado_asig: 'activa' },
      });

      if (existeAsignacion) {
        return res.status(400).json({ mensaje: 'El cajón ya está asignado.' });
      }

      await Asignacion.create({
        id_caj,
        id_usu,
        tipo_asig: 'manual',
        estado_asig: 'activa',
      });

      return res.json({ mensaje: 'Cajón asignado correctamente' });
    }

    if (accion === 'finalizar') {
      const asignacion = await Asignacion.findOne({
        where: { id_caj, estado_asig: 'activa' },
      });

      if (!asignacion) {
        return res.status(400).json({ mensaje: 'No hay asignación activa en este cajón' });
      }

      asignacion.estado_asig = 'finalizada';
      await asignacion.save();

      return res.json({ mensaje: 'Asignación finalizada correctamente' });
    }

    return res.status(400).json({ mensaje: 'Acción no válida' });
  } catch (error) {
    console.error('Error al cambiar el estado del cajón:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};