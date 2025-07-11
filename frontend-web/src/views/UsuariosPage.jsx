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

  const cargarUsuarios = () => {
    fetch('http://localhost:3000/api/usuarios', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('Error al obtener usuarios', err));
  };

  const cargarSolicitudes = () => {
    fetch('http://localhost:3000/api/solicitudes', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => setSolicitudes(data))
      .catch(err => console.error('Error al obtener solicitudes', err));
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`http://localhost:3000/api/solicitudes/${id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      const data = await res.json();
      setMensaje(data.mensaje || 'Estado actualizado');
      cargarSolicitudes();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div>
      <NavBarMonitor />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Gestión de Usuarios</h2>

        <div className="d-flex justify-content-end gap-2 mb-3">
          <Button
            className="btn-outline-custom"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? 'Ocultar formulario' : 'Registrar nuevo'}
          </Button>
          <Button
            className="btn-outline-custom"
            onClick={() => {
              setMostrarSolicitudes(!mostrarSolicitudes);
              if (!mostrarSolicitudes) cargarSolicitudes();
            }}
          >
            {mostrarSolicitudes ? 'Ocultar solicitudes' : 'Ver solicitudes de visita'}
          </Button>
        </div>

        {mensaje && <Alert variant="info">{mensaje}</Alert>}

        {mostrarFormulario && (
          <div className="card p-3 mb-4">
            <RegisterForm onRegistroExitoso={cargarUsuarios} />
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
          <>
            <h4 className="mt-5 mb-3">Solicitudes de Visita</h4>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Fecha de visita</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((sol) => (
                  <tr key={sol.id_sol}>
                    <td>{`${sol.nombre_sol} ${sol.apellido_pat_sol} ${sol.apellido_mat_sol || ''}`}</td>
                    <td>{sol.tel_sol || '-'}</td>
                    <td>{sol.fecha_visita_sol}</td>
                    <td>{sol.motivo_sol || '-'}</td>
                    <td>{sol.estado_sol}</td>
                    <td>
                      {sol.estado_sol === 'pendiente' ? (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            className="me-2"
                            onClick={() => actualizarEstado(sol.id_sol, 'aceptada')}
                          >
                            Aceptar
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => actualizarEstado(sol.id_sol, 'rechazada')}
                          >
                            Rechazar
                          </Button>
                        </>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </div>
    </div>
  );
}
