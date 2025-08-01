import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditarUsuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [form, setForm] = useState({
    nombre_usu: "",
    apellido_pat_usu: "",
    apellido_mat_usu: "",
    fecha_nac_usu: "",
    tipo_usu: "",
    tel_usu: "",
    correo_usu: "",
    ciudad_usu: "",
    colonia_usu: "",
    calle_usu: "",
    num_ext_usu: ""
  });

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const res = await fetch(
          `https://ezaccess-backend.onrender.com/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (!res.ok) throw new Error("No se pudo obtener el usuario");
        const data = await res.json();
        setUsuario(data);
        setForm({
          nombre_usu: data.nombre_usu || "",
          apellido_pat_usu: data.apellido_pat_usu || "",
          apellido_mat_usu: data.apellido_mat_usu || "",
          fecha_nac_usu: data.fecha_nac_usu ? data.fecha_nac_usu.slice(0, 10) : "",
          tipo_usu: data.tipo_usu || "",
          tel_usu: data.tel_usu || "",
          correo_usu: data.correo_usu || "",
          ciudad_usu: data.ciudad_usu || "",
          colonia_usu: data.colonia_usu || "",
          calle_usu: data.calle_usu || "",
          num_ext_usu: data.num_ext_usu || ""
        });
      } catch (error) {
        setMensaje("Error de conexión con el servidor.");
      }
    };
    obtenerUsuario();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      const res = await fetch(
        `http://localhost:3000/api/usuarios/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(form)
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMensaje("Usuario actualizado correctamente.");
        setTimeout(() => navigate("/usuarios"), 1000);
      } else {
        setMensaje(data.mensaje || "Error al actualizar usuario.");
      }
    } catch (error) {
      setMensaje("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Editar Usuario</h2>
      {mensaje && (
        <div className={`alert ${mensaje.includes("correctamente") ? "alert-success" : "alert-danger"}`}>
          {mensaje}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Nombre</label>
            <input
              type="text"
              className="form-control"
              name="nombre_usu"
              value={form.nombre_usu}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Apellido Paterno</label>
            <input
              type="text"
              className="form-control"
              name="apellido_pat_usu"
              value={form.apellido_pat_usu}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Apellido Materno</label>
            <input
              type="text"
              className="form-control"
              name="apellido_mat_usu"
              value={form.apellido_mat_usu}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              className="form-control"
              name="fecha_nac_usu"
              value={form.fecha_nac_usu}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Tipo de usuario</label>
            <select
              className="form-control"
              name="tipo_usu"
              value={form.tipo_usu}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="monitor">Monitor</option>
              <option value="residente">Residente</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label>Teléfono</label>
            <input
              type="text"
              className="form-control"
              name="tel_usu"
              value={form.tel_usu}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              name="correo_usu"
              value={form.correo_usu}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Ciudad</label>
            <input
              type="text"
              className="form-control"
              name="ciudad_usu"
              value={form.ciudad_usu}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>Colonia</label>
            <input
              type="text"
              className="form-control"
              name="colonia_usu"
              value={form.colonia_usu}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>Calle</label>
            <input
              type="text"
              className="form-control"
              name="calle_usu"
              value={form.calle_usu}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>Número exterior</label>
            <input
              type="text"
              className="form-control"
              name="num_ext_usu"
              value={form.num_ext_usu}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          Guardar cambios
        </button>
        <button type="button" className="btn btn-secondary mt-2 ms-2" onClick={() => navigate("/usuarios")}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
