import React, { useEffect, useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import { Button, Table } from 'react-bootstrap';
import NavBarMonitor from '../components/NavBarMonitor';

export default function UsuariosPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarSolicitudes, setMostrarSolicitudes] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);

  // Obtener usuarios
  const obtenerUsuarios = () => {
    fetch('ezaccess-backend.onrender.com/api/usuarios', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('Error al obtener usuarios', err));
  };

  // Obtener solicitudes
  const obtenerSolicitudes = () => {
    fetch('ezaccess-backend.onrender.com/api/solicitudes', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => setSolicitudes(data.solicitudes)) // asegúrate que en el backend esté como { solicitudes: [...] }
      .catch(err => console.error('Error al obtener solicitudes', err));
  };

  // Actualizar estado de solicitud
  const actualizarEstadoSolicitud = (id, nuevoEstado) => {
    fetch(`ezaccess-backend.onrender.com/api/solicitudes/${id}/estado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ nuevoEstado }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.mensaje);
        obtenerSolicitudes(); // Recargar tabla
      })
      .catch(err => console.error('Error al actualizar estado:', err));
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const toggleSolicitudes = () => {
    if (!mostrarSolicitudes) {
      obtenerSolicitudes();
    }
    setMostrarSolicitudes(!mostrarSolicitudes);
  };

  return (
    <div>
      <NavBarMonitor />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Gestión de Usuarios</h2>

        <div className="d-flex justify-content-end mb-3 gap-2">
          <Button className="btn-outline-custom" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
            {mostrarFormulario ? 'Ocultar formulario' : 'Registrar nuevo'}
          </Button>

          <Button className="btn-outline-custom" onClick={toggleSolicitudes}>
            {mostrarSolicitudes ? 'Ocultar solicitudes de visita' : 'Ver solicitudes de visita'}
          </Button>
        </div>

        {mostrarFormulario && (
          <div className="card p-3 mb-4">
            <RegisterForm actualizarLista={obtenerUsuarios} />
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
              </tr>
            ))}
          </tbody>
        </Table>

        {mostrarSolicitudes && (
          <div className="mt-5">
            <h4>Solicitudes de Visita</h4>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Fecha de Visita</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((sol) => (
                  <tr key={sol.id_sol}>
                    <td>{sol.nombre_sol}</td>
                    <td>{sol.tel_sol || 'Sin número'}</td>
                    <td>{sol.fecha_visita_sol}</td>
                    <td>{sol.motivo_sol}</td>
                    <td>{sol.estado_sol}</td>
                    <td>
                      {sol.estado_sol === 'pendiente' ? (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            className="me-1"
                            onClick={() => actualizarEstadoSolicitud(sol.id_sol, 'aceptada')}
                          >
                            Aceptar
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => actualizarEstadoSolicitud(sol.id_sol, 'rechazada')}
                          >
                            Rechazar
                          </Button>
                        </>
                      ) : (
                        <span className={`text-${sol.estado_sol === 'aceptada' ? 'success' : 'danger'}`}>
                          {sol.estado_sol.charAt(0).toUpperCase() + sol.estado_sol.slice(1)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
