import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre_usu: '',
    apellido_pat_usu: '',
    apellido_mat_usu: '',
    fecha_nac_usu: '',
    tipo_usu: 'residente',
    tel_usu: '',
    correo_usu: '',
    pass_usu: '',
    ciudad_usu: '',
    colonia_usu: '',
    calle_usu: '',
    num_ext_usu: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      nombre: formData.nombre_usu,
      apellido_paterno: formData.apellido_pat_usu,
      apellido_materno: formData.apellido_mat_usu,
      fecha_nac: formData.fecha_nac_usu,
      tipo: formData.tipo_usu,
      telefono: formData.tel_usu,
      correo: formData.correo_usu,
      contrasena: formData.pass_usu,
      ciudad: formData.ciudad_usu,
      colonia: formData.colonia_usu,
      calle: formData.calle_usu,
      num_ext: formData.num_ext_usu
    };

    try {
      const response = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log("Usuario registrado:", data);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="form-box">
      <Form.Group className="mb-2">
        <Form.Label>Nombre</Form.Label>
        <Form.Control type="text" name="nombre_usu" value={formData.nombre_usu} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Apellido paterno</Form.Label>
        <Form.Control type="text" name="apellido_pat_usu" value={formData.apellido_pat_usu} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Apellido materno</Form.Label>
        <Form.Control type="text" name="apellido_mat_usu" value={formData.apellido_mat_usu} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Fecha de nacimiento</Form.Label>
        <Form.Control type="date" name="fecha_nac_usu" value={formData.fecha_nac_usu} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Tipo de usuario</Form.Label>
        <Form.Select name="tipo_usu" value={formData.tipo_usu} onChange={handleChange} required>
          <option value="residente">Residente</option>
          <option value="monitor">Monitor</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control type="text" name="tel_usu" value={formData.tel_usu} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Correo electrónico</Form.Label>
        <Form.Control type="email" name="correo_usu" value={formData.correo_usu} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type="password" name="pass_usu" value={formData.pass_usu} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Ciudad</Form.Label>
        <Form.Control type="text" name="ciudad_usu" value={formData.ciudad_usu} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Colonia</Form.Label>
        <Form.Control type="text" name="colonia_usu" value={formData.colonia_usu} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Calle</Form.Label>
        <Form.Control type="text" name="calle_usu" value={formData.calle_usu} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Número exterior</Form.Label>
        <Form.Control type="text" name="num_ext_usu" value={formData.num_ext_usu} onChange={handleChange} />
      </Form.Group>
      <div className="text-center">
        <Button variant="primary" type="submit">Registrar</Button>
      </div>
    </Form>
  );
}