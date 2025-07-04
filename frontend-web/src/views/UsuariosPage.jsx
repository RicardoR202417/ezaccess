import React, { useEffect, useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import { Button, Table } from 'react-bootstrap';
import NavBarMonitor from '../components/NavBarMonitor';

export default function UsuariosPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/usuarios', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('Error al obtener usuarios', err));
  }, []);

  return (
    <div>
      <NavBarMonitor />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Gestión de Usuarios</h2>
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
            {mostrarFormulario ? 'Ocultar formulario' : 'Registrar nuevo'}
          </Button>
        </div>
        {mostrarFormulario && (
          <div className="card p-3 mb-4">
            <RegisterForm />
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
      </div>
    </div>
  );
}