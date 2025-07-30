import React, { useEffect, useState } from "react";
import { Button, Spinner, Alert, Form, ButtonGroup } from "react-bootstrap";
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

  const obtenerCajones = async () => {
    setCargando(true);
    try {
      const res = await fetch(
        "https://ezaccess-backend.onrender.com/api/cajones/estado",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();
      setCajones(data);
    } catch (error) {
      console.error("Error al obtener cajones:", error);
      setMensaje("No se pudo obtener el listado de cajones.");
    } finally {
      setCargando(false);
    }
  };

  const cambiarAsignacion = async (id_caj, accion) => {
    try {
      const res = await fetch(
        `https://ezaccess-backend.onrender.com/api/cajones/${id_caj}/estado`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accion }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMensaje(data.mensaje);
        obtenerCajones();
      } else {
        setMensaje(data.mensaje || "Error al cambiar estado");
      }
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      setMensaje("Error en la conexión con el servidor.");
    }
  };

  const cambiarEstadoTodos = async (accion) => {
    setCargando(true);
    try {
      const res = await fetch(
        "https://ezaccess-backend.onrender.com/api/cajones/estado/todos",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accion }),
        }
      );
      const data = await res.json();
      setMensaje(data.mensaje);
      obtenerCajones();
    } catch (err) {
      setMensaje("Error al cambiar el estado de todos los cajones.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerCajones();
  }, []);

  const zonas = ["Zona A", "Zona C", "Zona D", "Zona E"];

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
        <h2 className="text-center mb-4">Mapa de Cajones</h2>

        {mensaje && (
          <Alert variant="info" onClose={() => setMensaje("")} dismissible>
            {mensaje}
          </Alert>
        )}

        {/* Filtros */}
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

        <div
          className="d-flex justify-content-center mb-3"
          style={{ gap: "0.5rem" }}
        >
          <Button
            variant="success"
            size="sm"
            onClick={() => cambiarEstadoTodos("activar")}
            disabled={cargando}
          >
            Activar todos
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => cambiarEstadoTodos("finalizar")}
            disabled={cargando}
          >
            Finalizar todos
          </Button>
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
