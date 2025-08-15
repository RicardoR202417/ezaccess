-- ==============================
-- CONSULTAS EZ ACCESS FUNCIONALES
-- ==============================

-- 1️⃣ TODAS LAS ASIGNACIONES
CREATE OR REPLACE VIEW v_todas_asignaciones AS
SELECT 
    a.id_asig,
    a.id_usu,
    CONCAT_WS(' ', u.nombre_usu, u.apellido_pat_usu, u.apellido_mat_usu) AS residente,
    a.id_caj,
    c.numero_caj,
    c.ubicacion_caj,
    a.fecha_asig,
    a.tipo_asig,
    a.estado_asig
FROM asignaciones a
INNER JOIN usuarios u ON u.id_usu = a.id_usu
INNER JOIN cajones c ON c.id_caj = a.id_caj
ORDER BY a.fecha_asig DESC;


-- 2️⃣ ASIGNACIONES ACTIVAS
CREATE OR REPLACE VIEW v_asignaciones_activas AS
SELECT 
    a.id_asig,
    a.id_usu,
    CONCAT_WS(' ', u.nombre_usu, u.apellido_pat_usu, u.apellido_mat_usu) AS residente,
    a.id_caj,
    c.numero_caj,
    c.ubicacion_caj,
    a.fecha_asig,
    a.tipo_asig,
    a.estado_asig
FROM asignaciones a
INNER JOIN usuarios u ON u.id_usu = a.id_usu
INNER JOIN cajones c ON c.id_caj = a.id_caj
WHERE a.estado_asig = 'activa'
ORDER BY a.fecha_asig DESC;







-- 7️⃣ ÚLTIMAS ENTRADAS REGISTRADAS
CREATE OR REPLACE VIEW v_ultimas_entradas AS
SELECT 
    a.id_acc,
    a.id_usu,
    CONCAT_WS(' ', u.nombre_usu, u.apellido_pat_usu, u.apellido_mat_usu) AS residente,
    a.fecha_ent_acc
FROM accesos a
INNER JOIN usuarios u ON u.id_usu = a.id_usu
ORDER BY a.fecha_ent_acc DESC
LIMIT 10;


-- 🔟 VISITANTES APROBADOS



1️⃣ v_todas_asignaciones — Todas las asignaciones

Objetivo: Muestra todas las asignaciones, sin importar si están activas o finalizadas.

Funcionamiento:

Lee la tabla asignaciones (a) y la cruza con:

usuarios (u) para obtener el nombre completo del residente.

cajones (c) para saber el número y ubicación del cajón.

Usa CONCAT_WS para unir nombre y apellidos en un solo campo residente.

Ordena los resultados desde la más reciente (ORDER BY fecha_asig DESC).

Uso real: Ver el historial completo de quién ha tenido cada cajón.

Comprobación:

SELECT * FROM v_todas_asignaciones;

2️⃣ v_asignaciones_activas — Asignaciones vigentes

Objetivo: Filtra y muestra solo las asignaciones activas.

Funcionamiento:

Misma estructura que la vista anterior, pero con un WHERE estado_asig = 'activa'.

Esto asegura que solo se ve quién tiene actualmente un cajón asignado.

Uso real: Dashboard en tiempo real para saber qué cajones están ocupados.

Comprobación:

SELECT * FROM v_asignaciones_activas;

4️⃣ v_historial_asignaciones_detalle — Bitácora de cambios

Objetivo: Mostrar los eventos registrados por el trigger sobre asignaciones (alta, actualización, baja).

Funcionamiento:

Lee de historial_asignaciones (h), que es llenada automáticamente por el trigger.

Se une con asignaciones y usuarios para saber qué residente estaba involucrado en cada evento.

Ordena de lo más reciente a lo más antiguo (ORDER BY fecha_accion DESC).

Uso real: Auditoría y seguimiento de cambios en las asignaciones.

Comprobación:

SELECT * FROM v_historial_asignaciones_detalle;

5️⃣ v_cupo_cajones_zona — Cupo por zona

Objetivo: Mostrar cuántos cajones hay libres y ocupados en cada zona del estacionamiento.

Funcionamiento:

Agrupa los cajones por ubicacion_caj.

Cuenta el total de cajones (COUNT(*)).

Suma cuántos están libres (estado_caj = 'libre') y cuántos ocupados (estado_caj = 'ocupado').

Uso real: Ver disponibilidad por zonas para asignaciones automáticas o reportes.

Comprobación:

SELECT * FROM v_cupo_cajones_zona;

7️⃣ v_ultimas_entradas — Últimos accesos

Objetivo: Mostrar las últimas 10 entradas registradas.

Funcionamiento:

Lee la tabla accesos y une con usuarios para mostrar el nombre completo.

Ordena por fecha_ent_acc en descendente y limita a 10 resultados.

Uso real: Monitorear quién ha ingresado más recientemente.

Comprobación:

SELECT * FROM v_ultimas_entradas;

🔟 v_visitantes_aprobados — Lista de visitantes con acceso autorizado

Objetivo: Mostrar únicamente las visitas que fueron aprobadas.

Funcionamiento:

Lee de visitas (v) y une con usuarios para mostrar el residente que registró al visitante.

Filtra por estado_vis = 'aprobada'.

Ordena de más reciente a más antigua.

Uso real: Control de acceso para visitantes autorizados.

Comprobación:

SELECT * FROM v_visitantes_aprobados;