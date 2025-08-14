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


-- 4️⃣ HISTORIAL DE ASIGNACIONES (TRIGGER)
CREATE OR REPLACE VIEW v_historial_asignaciones_detalle AS
SELECT 
    h.id_historial,
    h.id_asig,
    h.accion,
    h.fecha_accion,
    CONCAT_WS(' ', u.nombre_usu, u.apellido_pat_usu, u.apellido_mat_usu) AS residente
FROM historial_asignaciones h
INNER JOIN asignaciones a ON a.id_asig = h.id_asig
INNER JOIN usuarios u ON u.id_usu = a.id_usu
ORDER BY h.fecha_accion DESC;


-- 5️⃣ CUPO DE CAJONES POR ZONA
CREATE OR REPLACE VIEW v_cupo_cajones_zona AS
SELECT 
    ubicacion_caj AS zona,
    COUNT(*) AS total_cajones,
    SUM(CASE WHEN estado_caj = 'libre' THEN 1 ELSE 0 END) AS libres,
    SUM(CASE WHEN estado_caj = 'ocupado' THEN 1 ELSE 0 END) AS ocupados
FROM cajones
GROUP BY ubicacion_caj
ORDER BY ubicacion_caj;


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
CREATE OR REPLACE VIEW v_visitantes_aprobados AS
SELECT 
    v.id_visita,
    CONCAT_WS(' ', u.nombre_usu, u.apellido_pat_usu, u.apellido_mat_usu) AS residente,
    v.nombre_vis,
    v.fecha_vis,
    v.estado_vis
FROM visitas v
INNER JOIN usuarios u ON u.id_usu = v.id_usu
WHERE v.estado_vis = 'aprobada'
ORDER BY v.fecha_vis DESC;
