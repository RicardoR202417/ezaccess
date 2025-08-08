import React, { useState, useEffect } from "react";
import { Alert, Button, Form, Table, Nav, Tab } from "react-bootstrap";
import NavBarMonitor from "../components/NavBarMonitor";
import "../styles/layout.css";

export default function ReportesPage() {
  const [usuario, setUsuario] = useState("");
  const [numeroCajon, setNumeroCajon] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleBuscar = async () => {
    setError("");
    setRegistros([]);
    setCargando(true);

    const params = new URLSearchParams();
    if (usuario) params.append("usuario", usuario);
    if (numeroCajon) params.append("numero_caj", numeroCajon);
    if (desde) params.append("desde", desde);
    if (hasta) params.append("hasta", hasta);

    const url =
      "https://ezaccess-backend.onrender.com/api/reportes/historial?" +
      params.toString();

    try {
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          msg = errJson.mensaje || JSON.stringify(errJson);
        } catch {}
        throw new Error(msg);
      }
      const { datos } = await res.json();
      setRegistros(datos);
    } catch (err) {
      setError("No se pudo cargar el historial. " + err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    handleBuscar();
    // eslint-disable-next-line
  }, []);

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
              <Form className="row g-3 align-items-end">
                <Form.Group className="col-md-3">
                  <Form.Label>Usuario (ID)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="e.j. 16"
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
                    onClick={handleBuscar}
                    disabled={cargando}
                  >
                    {cargando ? "Cargando..." : "Buscar"}
                  </Button>
                </div>
              </Form>
              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>ID Usuario</th>
                    <th>Usuario</th>
                    <th>Cajón</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {!cargando && registros.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No hay registros
                      </td>
                    </tr>
                  )}
                  {registros.map((r) => (
                    <tr key={r.id_historial}>
                      <td>{new Date(r.fecha).toLocaleString()}</td>
                      <td>{r.usuario.id_usu}</td>
                      <td>{r.usuario.nombre_usu}</td>
                      <td>{r.cajon.numero_caj}</td>
                      <td>{r.tipo_asig}</td>
                      <td>{r.estado_asig}</td>
                      <td>{r.accion}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="primary" disabled={registros.length === 0}>
                Exportar PDF
              </Button>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </>
  );
}