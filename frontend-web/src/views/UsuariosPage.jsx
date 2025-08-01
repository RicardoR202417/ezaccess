import React, { useEffect, useState } from "react";
import { Table, Alert, Form, Row, Col } from "react-bootstrap";
import RegisterForm from "../components/RegisterForm";
import NavBarMonitor from "../components/NavBarMonitor";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Firebase
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../firebaseConfig"; // Asegúrate que este archivo existe y exporta tu app

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mostrarSolicitudes, setMostrarSolicitudes] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);

  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [busquedaSolicitud, setBusquedaSolicitud] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const obtenerUsuarios = async () => {
    try {
      const res = await fetch(
        "https://ezaccess-backend.onrender.com/api/usuarios",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error("Error al obtener usuarios", err);
    }
  };

  const obtenerSolicitudes = async () => {
    try {
      const res = await fetch(
        "https://ezaccess-backend.onrender.com/api/solicitudes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setSolicitudes(data.solicitudes || []);
    } catch (err) {
      console.error("Error al obtener solicitudes", err);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.")) return;

    try {
      const res = await fetch(
        `https://ezaccess-backend.onrender.com/api/usuarios/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMensaje(data.mensaje);
        obtenerUsuarios();
      } else {
        setMensaje(data.mensaje || "Error al eliminar usuario");
      }
    } catch (err) {
      setMensaje("Error al eliminar usuario");
    }
  };

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
        setMensaje(data.mensaje);
        obtenerSolicitudes();
      } else {
        setMensaje(data.mensaje || "Error al actualizar estado");
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor");
    }
  };

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

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  useEffect(() => {
    if (mostrarSolicitudes) {
      obtenerSolicitudes();
    }
  }, [mostrarSolicitudes]);

  const usuariosFiltrados = usuarios.filter((user) => {
    const coincideTipo =
      filtroTipo === "todos" ? true : user.tipo_usu === filtroTipo;
    const coincideBusqueda =
      user.nombre_usu.toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
      user.apellido_pat_usu.toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
      user.correo_usu.toLowerCase().includes(busquedaUsuario.toLowerCase());
    return coincideTipo && coincideBusqueda;
  });

  const solicitudesFiltradas = solicitudes.filter((sol) => {
    const coincideFecha = filtroFecha
      ? new Date(sol.fecha_reg_sol).toISOString().slice(0, 10) === filtroFecha
      : true;
    const coincideBusqueda =
      sol.nombre_sol.toLowerCase().includes(busquedaSolicitud.toLowerCase()) ||
      sol.motivo_sol.toLowerCase().includes(busquedaSolicitud.toLowerCase());
    return coincideFecha && coincideBusqueda;
  });

  return (
    <div>
      <NavBarMonitor />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Gestión de Usuarios</h2>

        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn-main"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            type="button"
          >
            {mostrarFormulario ? "Ocultar formulario" : "Registrar nuevo"}
          </button>
          <button
            className="btn-main"
            onClick={() => setMostrarSolicitudes(!mostrarSolicitudes)}
            type="button"
          >
            {mostrarSolicitudes
              ? "Ocultar solicitudes visitas"
              : "Solicitudes visitas"}
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
              <Col md={4}>
                <Form.Control
                  type="date"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                  placeholder="Filtrar por fecha"
                />
              </Col>
              <Col md={8}>
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
                  <th>Fecha Registro</th>
                  <th>Tipo Ingreso</th>
                  <th>Modelo Vehículo</th>
                  <th>Placas Vehículo</th>
                  <th>ID Usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center">
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
                          {sol.estado_sol.charAt(0).toUpperCase() +
                            sol.estado_sol.slice(1)}
                        </span>
                      </td>
                      <td>{new Date(sol.fecha_reg_sol).toLocaleString()}</td>
                      <td>{sol.tipo_ingreso_sol}</td>
                      <td>{sol.modelo_veh_sol}</td>
                      <td>{sol.placas_veh_sol}</td>
                      <td>{sol.id_usu}</td>
                      <td>
                        {sol.estado_sol === "pendiente" ? (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              title="Aceptar"
                              onClick={() =>
                                actualizarEstadoSolicitud(sol.id_sol, "aceptada")
                              }
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

        <Row className="mb-3">
          <Col md={3}>
            <Form.Select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
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
              usuariosFiltrados.map((user) => (
                <tr key={user.id_usu}>
                  <td>{user.id_usu}</td>
                  <td>{user.nombre_usu}</td>
                  <td>{user.apellido_pat_usu}</td>
                  <td>{user.tipo_usu}</td>
                  <td>{user.correo_usu}</td>
                  <td>{user.tel_usu}</td>
                  <td>
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
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
