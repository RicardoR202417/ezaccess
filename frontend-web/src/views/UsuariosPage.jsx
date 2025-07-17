// views/UsuariosPage.jsx
import React, { useEffect, useState } from "react";
import { Button, Table, Alert } from "react-bootstrap";
import RegisterForm from "../components/RegisterForm";
import NavBarMonitor from "../components/NavBarMonitor";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mostrarSolicitudes, setMostrarSolicitudes] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);

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
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

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
        console.error("Error al eliminar usuario:", data.mensaje);
      }
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
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

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  useEffect(() => {
    if (mostrarSolicitudes) {
      obtenerSolicitudes();
    }
  }, [mostrarSolicitudes]);

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
                {solicitudes.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center">
                      No hay solicitudes registradas.
                    </td>
                  </tr>
                ) : (
                  solicitudes.map((sol) => (
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
                              onClick={() =>
                                actualizarEstadoSolicitud(sol.id_sol, "aceptada")
                              }
                            >
                              Aceptar
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                actualizarEstadoSolicitud(sol.id_sol, "rechazada")
                              }
                            >
                              Rechazar
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
            {usuarios.map((user) => (
              <tr key={user.id_usu}>
                <td>{user.id_usu}</td>
                <td>{user.nombre_usu}</td>
                <td>{user.apellido_pat_usu}</td>
                <td>{user.tipo_usu}</td>
                <td>{user.correo_usu}</td>
                <td>{user.tel_usu}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() =>
                      (window.location.href = `/usuarios/editar/${user.id_usu}`)
                    }
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => eliminarUsuario(user.id_usu)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
