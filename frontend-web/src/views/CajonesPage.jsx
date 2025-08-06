// src/views/CajonesPage.jsx
import React, { useEffect, useState } from "react";
import { Button, Spinner, Alert, Form } from "react-bootstrap";
import NavBarMonitor from "../components/NavBarMonitor";
import "../styles/layout.css";

export default function CajonesPage() {
  const [cajones, setCajones] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [zonaActiva, setZonaActiva] = useState("Zona A");
  const [filtroNumero, setFiltroNumero] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const token = localStorage.getItem("token");

  // 1) Traer cajones desde el endpoint que devuelve:
  //    [{ id_caj, numero_caj, ubicacion_caj, estado, usuario_ocupante, id_usuario_ocupante }, ...]
  const obtenerCajones = async () => {
    setCargando(true);
    try {
      const res = await fetch(
        "https://ezaccess-backend.onrender.com/api/cajones",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCajones(data);
    } catch (error) {
      console.error("Error al obtener cajones:", error);
      setMensaje("No se pudo obtener el listado de cajones.");
    } finally {
      setCargando(false);
    }
  };

  // 2) Llamada a activar/finalizar (manteniendo el id_usu en el body si es manual)
  const cambiarAsignacion = async (id_caj, accion) => {
    try {
      const body = { accion };
      // si es manual y viene el id de sesión, añádelo:
      const idUsu = localStorage.getItem("id_usuario");
      if (accion === "activar" && idUsu) body.id_usu = +idUsu;

      const res = await fetch(
        `https://ezaccess-backend.onrender.com/api/cajones/${id_caj}/estado`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      setMensaje(data.mensaje);
      await obtenerCajones();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      setMensaje("Error en la conexión con el servidor.");
    }
  };

  // 3) Activar/Finalizar todos
  const cambiarEstadoTodos = async (accion) => {
    setCargando(true);
    try {
      const body = { accion };
      const idUsu = localStorage.getItem("id_usuario");
      if (accion === "activar" && idUsu) body.id_usu = +idUsu;

      const res = await fetch(
        "https://ezaccess-backend.onrender.com/api/cajones/estado/todos",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      setMensaje(data.mensaje);
      await obtenerCajones();
    } catch (err) {
      console.error(err);
      setMensaje("Error al cambiar el estado de todos los cajones.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerCajones();
  }, []);

  const zonas = ["Zona A", "Zona C", "Zona D", "Zona E"];

  // 4) Filtrado
  const cajonesFiltrados = cajones.filter((cajon) => {
    const coincideZona =
      cajon.ubicacion_caj && cajon.ubicacion_caj.includes(zonaActiva);
    const coincideNumero = cajon.numero_caj
      .toLowerCase()
      .includes(filtroNumero.toLowerCase());
    const coincideEstado =
      filtroEstado === "todos" || cajon.estado === filtroEstado;
    return coincideZona && coincideNumero && coincideEstado;
  });

  return (
    <div>
      <NavBarMonitor />
      <div className="container mt-4">
        <h2 className="text-center mb-3">Mapa de Cajones</h2>

        <div className="text-end mb-2">
          <div className="btn-group" role="group">
            <Button
              className="btn-control-cajon activar btn-sm"
              onClick={() => cambiarEstadoTodos("activar")}
              disabled={cargando}
            >
              Activar todos
            </Button>
            <Button
              className="btn-control-cajon finalizar btn-sm"
              onClick={() => cambiarEstadoTodos("finalizar")}
              disabled={cargando}
            >
              Finalizar todos
            </Button>
          </div>
        </div>

        {mensaje && (
          <Alert variant="info" onClose={() => setMensaje("")} dismissible>
            {mensaje}
          </Alert>
        )}

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div className="zona-buttons">
            {zonas.map((zona) => (
              <Button
                key={zona}
                variant={zona === zonaActiva ? "primary" : "outline-primary"}
                className={`zona-btn ${
                  zona === zonaActiva ? "zona-activa" : ""
                }`}
                onClick={() => setZonaActiva(zona)}
              >
                {zona}
              </Button>
            ))}
          </div>

          <div className="d-flex flex-wrap align-items-center">
            <Form.Control
              type="text"
              placeholder="Buscar por número"
              value={filtroNumero}
              onChange={(e) => setFiltroNumero(e.target.value)}
              className="me-2 mb-2"
            />
            <Form.Select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="mb-2"
            >
              <option value="todos">Todos</option>
              <option value="libre">Libres</option>
              <option value="ocupado">Ocupados</option>
            </Form.Select>
          </div>
        </div>

        {cargando ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <div className="grid-cajones">
            {cajonesFiltrados.length > 0 ? (
              cajonesFiltrados.map((cajon) => (
                <div
                  key={cajon.id_caj}
                  className={`card-cajon ${
                    cajon.estado === "ocupado" ? "ocupado" : "libre"
                  }`}
                >
                  <h5>{cajon.numero_caj}</h5>
                  <p className="ubicacion">{cajon.ubicacion_caj}</p>
                  <p className="estado">
                    Estado: <strong>{cajon.estado}</strong>
                  </p>

                  {cajon.estado === "ocupado" ? (
                    <p className="residente-ocupante">
                      Ocupado por: <b>{cajon.usuario_ocupante}</b>
                    </p>
                  ) : (
                    <p className="residente-ocupante text-muted">Libre</p>
                  )}

                  <Button
                    variant={cajon.estado === "ocupado" ? "danger" : "success"}
                    size="sm"
                    onClick={() =>
                      cambiarAsignacion(
                        cajon.id_caj,
                        cajon.estado === "ocupado" ? "finalizar" : "activar"
                      )
                    }
                  >
                    {cajon.estado === "ocupado" ? "Finalizar" : "Activar"}
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center">
                No hay cajones que coincidan con los filtros.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
