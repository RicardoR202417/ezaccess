// src/views/UsuariosPage.jsx
import React, { useEffect, useState } from "react";
import { Table, Alert, Form, Row, Col, Spinner } from "react-bootstrap";
import RegisterForm from "../components/RegisterForm";
import NavBarMonitor from "../components/NavBarMonitor";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Firebase
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";

export default function UsuariosPage() {
  // --- Estados principales ---
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mostrarSolicitudes, setMostrarSolicitudes] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);

  // --- Filtros usuarios ---
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busquedaUsuario, setBusquedaUsuario] = useState("");

  // --- Filtros solicitudes ---
  const [filtroFechaVisita, setFiltroFechaVisita] = useState("");
  const [busquedaSolicitud, setBusquedaSolicitud] = useState("");
  const [filtroEstadoSolicitud, setFiltroEstadoSolicitud] = useState("todas");

  // --- Expansión de fila y vehículos ---
  const [expandedUser, setExpandedUser] = useState(null);
  const [vehiculosPorUsuario, setVehiculosPorUsuario] = useState({}); // { [id_usu]: Array<Vehiculo> }
  const [cargandoVehiculos, setCargandoVehiculos] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ======= Fetch: Usuarios =======
  const obtenerUsuarios = async () => {
    try {
      const res = await fetch("https://ezaccess-backend.onrender.com/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener usuarios", err);
    }
  };

  // ======= Fetch: Solicitudes =======
  const obtenerSolicitudes = async () => {
    try {
      const res = await fetch("https://ezaccess-backend.onrender.com/api/solicitudes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSolicitudes(data.solicitudes || []);
    } catch (err) {
      console.error("Error al obtener solicitudes", err);
    }
  };

  // ======= Eliminar usuario =======
  const eliminarUsuario = async (id) => {
    if (
      !window.confirm("¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.")
    )
      return;

    try {
      const res = await fetch(`https://ezaccess-backend.onrender.com/api/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje(data.mensaje || "Usuario eliminado.");
        obtenerUsuarios();
      } else {
        setMensaje(data.mensaje || "Error al eliminar usuario");
      }
    } catch (err) {
      setMensaje("Error al eliminar usuario");
    }
  };

  // ======= Actualizar estado de solicitud =======
  const actualizarEstadoSolicitud = async (id, nuevoEstado) => {
    try {
      const res = await fetch(
        `https://ezaccess-backend.onrender.com/api/solicitudes/${id}/estado`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nuevoEstado }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMensaje(data.mensaje || "Estado actualizado.");
        obtenerSolicitudes();
      } else {
        setMensaje(data.mensaje || "Error al actualizar estado");
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor");
    }
  };

  // ======= Guardar comentario de rechazo en Firebase =======
  const guardarComentarioEnFirebase = async (idSol, comentario) => {
    try {
      const db = getFirestore(app);
      await addDoc(collection(db, "rechazos_visitas"), {
        id_sol: idSol,
        comentario,
        fecha_registro: new Date().toISOString(),
      });
      console.log("Comentario registrado correctamente en Firebase");
    } catch (error) {
      console.error("Error al registrar comentario en Firebase:", error);
    }
  };

  // ======= Efectos =======
  useEffect(() => {
    obtenerUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mostrarSolicitudes) {
      obtenerSolicitudes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mostrarSolicitudes]);

  // ======= Filtros: Usuarios =======
  const usuariosFiltrados = usuarios.filter((user) => {
    const coincideTipo = filtroTipo === "todos" ? true : user.tipo_usu === filtroTipo;
    const term = busquedaUsuario.trim().toLowerCase();
    const coincideBusqueda =
      !term ||
      user.nombre_usu?.toLowerCase().includes(term) ||
      user.apellido_pat_usu?.toLowerCase().includes(term) ||
      user.correo_usu?.toLowerCase().includes(term);
    return coincideTipo && coincideBusqueda;
  });

  // ======= Filtros: Solicitudes =======
  const solicitudesFiltradas = solicitudes.filter((sol) => {
    const coincideEstado =
      filtroEstadoSolicitud === "todas" ? true : sol.estado_sol === "pendiente";

    const coincideFecha = filtroFechaVisita
      ? new Date(sol.fecha_visita_sol).toLocaleDateString("sv-SE") === filtroFechaVisita
      : true;

    const term = busquedaSolicitud.trim().toLowerCase();
    const coincideBusqueda =
      !term ||
      sol.nombre_sol?.toLowerCase().includes(term) ||
      sol.motivo_sol?.toLowerCase().includes(term);

    return coincideEstado && coincideFecha && coincideBusqueda;
  });

  // ======= Expandir fila y cargar vehículos =======
  const toggleVehiculos = async (idUsuario) => {
    if (expandedUser === idUsuario) {
      setExpandedUser(null);
      return;
    }

    // si ya tenemos los vehículos en cache, solo expandimos
    if (vehiculosPorUsuario[idUsuario]) {
      setExpandedUser(idUsuario);
      return;
    }

    try {
      setCargandoVehiculos(true);
      const res = await fetch(
        `https://ezaccess-backend.onrender.com/api/vehiculos/usuario/${idUsuario}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setVehiculosPorUsuario((prev) => ({ ...prev, [idUsuario]: Array.isArray(data) ? data : [] }));
      setExpandedUser(idUsuario);
    } catch (err) {
      console.error("Error al obtener vehículos", err);
    } finally {
      setCargandoVehiculos(false);
    }
  };

  return (
    <div>
      <NavBarMonitor />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Gestión de Usuarios</h2>

        <div className="d-flex justify-content-end gap-2 mb-3">
          <button
            className="btn-main"
            onClick={() => setMostrarFormulario((v) => !v)}
            type="button"
          >
            {mostrarFormulario ? "Ocultar formulario" : "Registrar nuevo"}
          </button>
          <button
            className="btn-main"
            onClick={() => setMostrarSolicitudes((v) => !v)}
            type="button"
          >
            {mostrarSolicitudes ? "Ocultar solicitudes visitas" : "Solicitudes visitas"}
          </button>
        </div>

        {mensaje && (
          <Alert variant="info" onClose={() => setMensaje("")} dismissible>
            {mensaje}
          </Alert>
        )}

        {mostrarFormulario && (
          <div className="card p-3 mb-4">
            <RegisterForm onRegistroExitoso={obtenerUsuarios} />
          </div>
        )}

        {/* ======== Sección Solicitudes de Visita ======== */}
        {mostrarSolicitudes && (
          <div className="card p-3 mb-4">
            <h4>Solicitudes de Visita</h4>

            <div className="mb-2">
              <span>
                <strong>Estatus:</strong>{" "}
                <span style={{ color: "#FFA000" }}>Pendiente</span> |{" "}
                <span style={{ color: "#388E3C" }}>Aceptada</span> |{" "}
                <span style={{ color: "#D32F2F" }}>Rechazada</span>
              </span>
            </div>

            <Row className="mb-3">
              <Col md={3}>
                <Form.Select
                  value={filtroEstadoSolicitud}
                  onChange={(e) => setFiltroEstadoSolicitud(e.target.value)}
                >
                  <option value="todas">Todas las solicitudes</option>
                  <option value="pendiente">Solo pendientes</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Control
                  type="date"
                  value={filtroFechaVisita}
                  onChange={(e) => setFiltroFechaVisita(e.target.value)}
                  placeholder="Filtrar por fecha de visita"
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre o motivo"
                  value={busquedaSolicitud}
                  onChange={(e) => setBusquedaSolicitud(e.target.value)}
                />
              </Col>
            </Row>

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                  <th>Fecha Visita</th>
                  <th>Tipo Ingreso</th>
                  <th>Modelo Vehículo</th>
                  <th>Placas Vehículo</th>
                  <th>Residente Responsable</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center">
                      No hay solicitudes registradas.
                    </td>
                  </tr>
                ) : (
                  solicitudesFiltradas.map((sol) => (
                    <tr key={sol.id_sol}>
                      <td>{sol.id_sol}</td>
                      <td>{sol.nombre_sol}</td>
                      <td>{sol.motivo_sol}</td>
                      <td>
                        <span
                          style={{
                            color:
                              sol.estado_sol === "pendiente"
                                ? "#FFA000"
                                : sol.estado_sol === "aceptada"
                                ? "#388E3C"
                                : "#D32F2F",
                            fontWeight: 600,
                          }}
                        >
                          {sol.estado_sol
                            ? sol.estado_sol.charAt(0).toUpperCase() + sol.estado_sol.slice(1)
                            : "—"}
                        </span>
                      </td>
                      <td>
                        {sol.fecha_visita_sol
                          ? new Date(sol.fecha_visita_sol).toLocaleString()
                          : "No especificada"}
                      </td>
                      <td>{sol.tipo_ingreso_sol || "—"}</td>
                      <td>{sol.modelo_veh_sol || "—"}</td>
                      <td>{sol.placas_veh_sol || "—"}</td>
                      <td>
                        {(() => {
                          const user = usuarios.find((u) => u.id_usu === sol.id_usu);
                          return user
                            ? `${user.nombre_usu} ${user.apellido_pat_usu}`
                            : "No especificado";
                        })()}
                      </td>
                      <td>{new Date(sol.fecha_reg_sol).toLocaleString()}</td>
                      <td>
                        {sol.estado_sol === "pendiente" ? (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              title="Aceptar"
                              onClick={() => actualizarEstadoSolicitud(sol.id_sol, "aceptada")}
                            >
                              <FaCheck />
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              title="Rechazar"
                              onClick={async () => {
                                const comentario = prompt("Ingresa el motivo del rechazo:");
                                if (!comentario) return;
                                await actualizarEstadoSolicitud(sol.id_sol, "rechazada");
                                await guardarComentarioEnFirebase(sol.id_sol, comentario);
                              }}
                            >
                              <FaTimes />
                            </button>
                          </>
                        ) : (
                          <span className="text-muted">Sin acciones</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}

        {/* ======== Filtros Usuarios ======== */}
        <Row className="mb-3">
          <Col md={3}>
            <Form.Select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="todos">Todos los tipos</option>
              <option value="monitor">Monitor</option>
              <option value="residente">Residente</option>
            </Form.Select>
          </Col>
          <Col md={9}>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre, apellido o correo"
              value={busquedaUsuario}
              onChange={(e) => setBusquedaUsuario(e.target.value)}
            />
          </Col>
        </Row>

        {/* ======== Tabla Usuarios con filas expandibles ======== */}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Tipo</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              usuariosFiltrados.map((user) => {
                const vehs = vehiculosPorUsuario[user.id_usu] || [];
                const expandido = expandedUser === user.id_usu;

                return (
                  <React.Fragment key={user.id_usu}>
                    <tr
                      onClick={() => toggleVehiculos(user.id_usu)}
                      style={{ cursor: "pointer" }}
                      title="Click para ver vehículos"
                    >
                      <td>{user.id_usu}</td>
                      <td>{user.nombre_usu}</td>
                      <td>{user.apellido_pat_usu}</td>
                      <td>{user.tipo_usu}</td>
                      <td>{user.correo_usu}</td>
                      <td>{user.tel_usu}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          title="Editar"
                          onClick={() => navigate(`/usuarios/editar/${user.id_usu}`)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          title="Eliminar"
                          onClick={() => eliminarUsuario(user.id_usu)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>

                    {expandido && (
                      <tr>
                        <td colSpan={7}>
                          {cargandoVehiculos && (
                            <div className="d-flex align-items-center gap-2">
                              <Spinner animation="border" size="sm" />
                              <span>Cargando vehículos...</span>
                            </div>
                          )}

                          {!cargandoVehiculos && vehs.length > 0 && (
                            <>
                              <strong>Vehículos registrados:</strong>
                              <ul className="mb-0">
                                {vehs.map((veh) => (
                                  <li key={veh.id_veh}>
                                    🚗 {veh.marca_veh} {veh.modelo_veh} | Placas: {veh.placas_veh}
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}

                          {!cargandoVehiculos && vehs.length === 0 && (
                            <span>Este usuario no tiene vehículos registrados.</span>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
