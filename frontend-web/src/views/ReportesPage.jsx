import React, { useState, useEffect } from "react";
import { Table, Alert, Form, Button, Nav, Tab } from "react-bootstrap";
import NavBarMonitor from "../components/NavBarMonitor";
import "../styles/layout.css";

export default function ReportesPage() {
  const [registros, setRegistros] = useState([]);
  const [registrosFiltrados, setRegistrosFiltrados] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [numeroCajon, setNumeroCajon] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const obtenerHistorial = async () => {
      setCargando(true);
      setMensaje("");
      try {
        const res = await fetch(
          "https://ezaccess-backend.onrender.com/api/reportes/historial"
        );
        if (!res.ok) throw new Error("No se pudo obtener el historial");
        const data = await res.json();
        setRegistros(data);
        setRegistrosFiltrados(data);
      } catch (err) {
        setMensaje("No se pudo cargar el historial.");
      } finally {
        setCargando(false);
      }
    };
    obtenerHistorial();
  }, []);

  const handleFiltrar = (e) => {
    e.preventDefault();
    let filtrados = [...registros];
    if (usuario) {
      filtrados = filtrados.filter((r) =>
        r.usuario && r.usuario.toLowerCase().includes(usuario.toLowerCase())
      );
    }
    if (numeroCajon) {
      filtrados = filtrados.filter((r) =>
        r.cajon && r.cajon.toLowerCase().includes(numeroCajon.toLowerCase())
      );
    }
    if (desde) {
      filtrados = filtrados.filter((r) => r.fecha >= desde);
    }
    if (hasta) {
      filtrados = filtrados.filter((r) => r.fecha <= hasta + "T23:59:59");
    }
    setRegistrosFiltrados(filtrados);
  };

  return (
    <>
      <NavBarMonitor />
      <div className="container py-4">
        <h1>Reportes</h1>
        <Tab.Container defaultActiveKey="historial">
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="historial">Historial</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="historial">
              <Form
                className="row g-3 align-items-end"
                onSubmit={handleFiltrar}
              >
                <Form.Group className="col-md-3">
                  <Form.Label>Usuario (Nombre)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.j. Luis"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="col-md-3">
                  <Form.Label>Número de Cajón</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.j. C1"
                    value={numeroCajon}
                    onChange={(e) => setNumeroCajon(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="col-md-2">
                  <Form.Label>Desde</Form.Label>
                  <Form.Control
                    type="date"
                    value={desde}
                    onChange={(e) => setDesde(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="col-md-2">
                  <Form.Label>Hasta</Form.Label>
                  <Form.Control
                    type="date"
                    value={hasta}
                    onChange={(e) => setHasta(e.target.value)}
                  />
                </Form.Group>
                <div className="col-md-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={cargando}
                  >
                    {cargando ? "Cargando..." : "Buscar"}
                  </Button>
                </div>
              </Form>
              {mensaje && (
                <Alert variant="danger" className="mt-3">
                  {mensaje}
                </Alert>
              )}
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Cajón</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {!cargando && registrosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No hay registros
                      </td>
                    </tr>
                  )}
                  {registrosFiltrados.map((r) => (
                    <tr key={r.id_historial}>
                      <td>{new Date(r.fecha).toLocaleString()}</td>
                      <td>{r.usuario}</td>
                      <td>{r.cajon}</td>
                      <td>{r.tipo_asig}</td>
                      <td>{r.estado_asig}</td>
                      <td>{r.accion}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button
                variant="primary"
                disabled={registrosFiltrados.length === 0}
              >
                Exportar PDF
              </Button>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </>
  );
}