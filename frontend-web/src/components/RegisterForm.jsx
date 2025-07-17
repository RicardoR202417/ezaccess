import React, { useEffect, useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import { Button, Table, Alert } from 'react-bootstrap';
import NavBarMonitor from '../components/NavBarMonitor';

export default function UsuariosPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarSolicitudes, setMostrarSolicitudes] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  const token = localStorage.getItem('token');

  const obtenerUsuarios = async () => {
    try {
      const res = await fetch('https://ezaccess-backend.onrender.com/api/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error('Error al obtener usuarios', err);
    }
  };

  const obtenerSolicitudes = async () => {
    try {
      const res = await fetch('https://ezaccess-backend.onrender.com/api/solicitudes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSolicitudes(data.solicitudes);
    } catch (err) {
      console.error('Error al obtener solicitudes', err);
    }
  };

  const actualizarEstadoSolicitud = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`https://ezaccess-backend.onrender.com/api/solicitudes/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nuevoEstado })
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje(data.mensaje);
        obtenerSolicitudes();
      } else {
        console.error('Error al actualizar estado:', data.mensaje);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      const res = await fetch(`https://ezaccess-backend.onrender.com/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje(data.mensaje);
        obtenerUsuarios();
      } else {
        console.error('Error al eliminar usuario:', data.mensaje);
      }
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  const iniciarEdicion = (usuario) => {
    setUsuarioEditar(usuario);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setUsuarioEditar(null);
    setMostrarFormulario(false);
  };

  useEffect(() => {
    obtenerUsuarios();
    if (mostrarSolicitudes) obtenerSolicitudes();
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
            onClick={() => {
              setMostrarFormulario(!mostrarFormulario);
              setModoEdicion(false);
              setUsuarioEditar(null);
            }}
          >
            {mostrarFormulario && !modoEdicion ? 'Ocultar formulario' : 'Registrar nuevo'}
          </Button>
          <Button variant="primary" onClick={() => setMostrarSolicitudes(!mostrarSolicitudes)}>
            {mostrarSolicitudes ? 'Ocultar solicitudes de visita' : 'Ver solicitudes de visita'}
          </Button>
        </div>

        {mensaje && (
          <Alert variant="info" onClose={() => setMensaje('')} dismissible>
            {mensaje}
          </Alert>
        )}

        {mostrarFormulario && (
          <div className="card p-3 mb-4">
            <RegisterForm
              onRegistroExitoso={() => {
                obtenerUsuarios();
                cancelarEdicion();
              }}
              modoEdicion={modoEdicion}
              usuarioEditar={usuarioEditar}
              cancelarEdicion={cancelarEdicion}
            />
          </div>
        )}

        {mostrarSolicitudes && (
          <div className="card p-3 mb-4">
            <h4>Solicitudes de Visita</h4>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Fecha Visita</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((sol) => (
                  <tr key={sol.id_sol}>
                    <td>{`${sol.nombre_sol} ${sol.apellido_pat_sol || ''} ${sol.apellido_mat_sol || ''}`}</td>
                    <td>{sol.tel_sol || 'N/A'}</td>
                    <td>{sol.fecha_visita_sol}</td>
                    <td>{sol.motivo_sol}</td>
                    <td>{sol.estado_sol}</td>
                    <td>
                      {sol.estado_sol === 'pendiente' ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => actualizarEstadoSolicitud(sol.id_sol, 'aceptada')}
                          >
                            Aceptar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => actualizarEstadoSolicitud(sol.id_sol, 'rechazada')}
                          >
                            Rechazar
                          </Button>
                        </>
                      ) : (
                        <span className="text-muted">Sin acciones</span>
                      )}
                    </td>
                  </tr>
                ))}
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
                  <Button variant="warning" size="sm" className="me-2" onClick={() => iniciarEdicion(user)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => eliminarUsuario(user.id_usu)}>
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
