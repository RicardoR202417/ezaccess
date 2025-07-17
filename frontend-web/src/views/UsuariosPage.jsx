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
          <Button
            variant="primary"
            className="me-2"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? "Ocultar formulario" : "Registrar nuevo"}
          </Button>
          <Button
            variant="info"
            onClick={() => setMostrarSolicitudes(!mostrarSolicitudes)}
          >
            {mostrarSolicitudes
              ? "Ocultar solicitudes visitas"
              : "Solicitudes visitas"}
          </Button>
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
                </tr>
              </thead>
              <tbody>
                {solicitudes.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center">
                      No hay solicitudes registradas.
                    </td>
                  </tr>
                ) : (
                  solicitudes.map((sol) => (
                    <tr key={sol.id_sol}>
                      <td>{sol.id_sol}</td>
                      <td>{sol.nombre_sol}</td>
                      <td>{sol.motivo_sol}</td>
                      <td>{sol.estado_sol}</td>
                      <td>{new Date(sol.fecha_reg_sol).toLocaleString()}</td>
                      <td>{sol.tipo_ingreso_sol}</td>
                      <td>{sol.modelo_veh_sol}</td>
                      <td>{sol.placas_veh_sol}</td>
                      <td>{sol.id_usu}</td>
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
