import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';

export default function EditarUsuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    nombre_usu: '',
    apellido_pat_usu: '',
    apellido_mat_usu: '',
    fecha_nac_usu: '',
    tipo_usu: '',
    tel_usu: '',
    correo_usu: '',
    ciudad_usu: '',
    colonia_usu: '',
    calle_usu: '',
    num_ext_usu: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const obtenerUsuario = async () => {
    try {
      const res = await fetch(`https://ezaccess-backend.onrender.com/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(data);
      } else {
        setError('No se pudo cargar la información del usuario.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor.');
    }
  };

  useEffect(() => {
    obtenerUsuario();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://ezaccess-backend.onrender.com/api/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje('Usuario actualizado exitosamente');
        setError('');
        setTimeout(() => navigate('/usuarios'), 1500);
      } else {
        setError(data.mensaje || 'Error al actualizar');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Editar Usuario</h2>

      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre_usu"
                value={formData.nombre_usu}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Apellido Paterno</Form.Label>
              <Form.Control
                type="text"
                name="apellido_pat_usu"
                value={formData.apellido_pat_usu}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Apellido Materno</Form.Label>
              <Form.Control
                type="text"
                name="apellido_mat_usu"
                value={formData.apellido_mat_usu}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="fecha_nac_usu"
                value={formData.fecha_nac_usu?.split('T')[0]}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de usuario</Form.Label>
              <Form.Select
                name="tipo_usu"
                value={formData.tipo_usu}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="monitor">Monitor</option>
                <option value="residente">Residente</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="tel_usu"
                value={formData.tel_usu}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="correo_usu"
                value={formData.correo_usu}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                type="text"
                name="ciudad_usu"
                value={formData.ciudad_usu}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Colonia</Form.Label>
              <Form.Control
                type="text"
                name="colonia_usu"
                value={formData.colonia_usu}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Calle</Form.Label>
              <Form.Control
                type="text"
                name="calle_usu"
                value={formData.calle_usu}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Número exterior</Form.Label>
              <Form.Control
                type="text"
                name="num_ext_usu"
                value={formData.num_ext_usu}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-end">
          <Button type="submit" variant="primary">
            Guardar cambios
          </Button>
          <Button variant="secondary" className="ms-2" onClick={() => navigate('/usuarios')}>
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
}
