import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import NavBarMonitor from "../components/NavBarMonitor";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [ocupados, setOcupados] = useState(0);
  const [libres, setLibres] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [plumaEntrada, setPlumaEntrada] = useState("cerrada");
  const [plumaSalida, setPlumaSalida] = useState("cerrada");

  useEffect(() => {
    const obtenerDatosCajones = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://ezaccess-backend.onrender.com/api/cajones", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }

        const data = await res.json();
        const totalOcupados = data.filter((c) => c.estado === "ocupado").length;
        const totalLibres = data.filter((c) => c.estado === "libre").length;

        setOcupados(totalOcupados);
        setLibres(totalLibres);
      } catch (error) {
        console.error("Error al obtener los cajones:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatosCajones();
  }, []);

  const total = ocupados + libres;

  const datosGrafica = [
    {
      name: "Cupo",
      ocupados: ocupados,
      libres: libres,
    },
  ];

  const togglePluma = (tipo) => {
    if (tipo === "entrada") {
      setPlumaEntrada((prev) => (prev === "abierta" ? "cerrada" : "abierta"));
    } else {
      setPlumaSalida((prev) => (prev === "abierta" ? "cerrada" : "abierta"));
    }
  };

  return (
    <div>
      <NavBarMonitor />
      <Container className="mt-4">
        <h2 className="mb-4">Panel de Control</h2>
        <Row>
          <Col md={4} className="mb-3">
            <Card className="shadow-sm rounded-4">
              <Card.Body>
                <Card.Title>Gestión de Usuarios</Card.Title>
                <Card.Text>
                  Administra y registra usuarios residentes y monitores del sistema.
                </Card.Text>
                <Button variant="primary" onClick={() => navigate("/usuarios")}>
                  Ir a Usuarios
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="shadow-sm rounded-4">
              <Card.Body>
                <Card.Title>Estado de Cajones</Card.Title>
                <Card.Text>
                  Visualiza los cajones disponibles, ocupados o reservados.
                </Card.Text>
                <Button variant="primary" onClick={() => navigate("/cajones")}>
                  Ver Cajones
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="shadow-sm rounded-4">
              <Card.Body>
                <Card.Title>Reportes</Card.Title>
                <Card.Text>
                  Consulta estadísticas de uso, frecuencia de entradas y salidas.
                </Card.Text>
                <Button variant="primary" onClick={() => navigate("/reportes")}>
                  Ver Reportes
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tarjetas de plumas */}
        <Row className="mb-4 justify-content-center">
          <Col md={5} className="mb-3">
            <Card className="shadow-sm rounded-4">
              <Card.Body className="text-center">
                <Card.Title className="mb-2">Pluma de Entrada</Card.Title>
                <Card.Text className="mb-3">
                  Estado actual:{" "}
                  <strong
                    className={plumaEntrada === "abierta" ? "text-success" : "text-danger"}
                  >
                    {plumaEntrada.toUpperCase()}
                  </strong>
                </Card.Text>
                <Button
                  variant={plumaEntrada === "abierta" ? "danger" : "success"}
                  onClick={() => togglePluma("entrada")}
                >
                  {plumaEntrada === "abierta" ? "Cerrar" : "Abrir"} Pluma
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5} className="mb-3">
            <Card className="shadow-sm rounded-4">
              <Card.Body className="text-center">
                <Card.Title className="mb-2">Pluma de Salida</Card.Title>
                <Card.Text className="mb-3">
                  Estado actual:{" "}
                  <strong
                    className={plumaSalida === "abierta" ? "text-success" : "text-danger"}
                  >
                    {plumaSalida.toUpperCase()}
                  </strong>
                </Card.Text>
                <Button
                  variant={plumaSalida === "abierta" ? "danger" : "success"}
                  onClick={() => togglePluma("salida")}
                >
                  {plumaSalida === "abierta" ? "Cerrar" : "Abrir"} Pluma
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Gráfico de barras */}
        <Row className="mt-4">
          <Col>
            <Card className="shadow-sm rounded-4">
              <Card.Body>
                <Card.Title>Cupo total del estacionamiento</Card.Title>
                {cargando ? (
                  <p>Cargando gráfico...</p>
                ) : (
                  <ResponsiveContainer width="100%" height={100}>
                    <BarChart
                      layout="vertical"
                      data={datosGrafica}
                      stackOffset="expand"
                      margin={{ left: 20 }}
                    >
                      <defs>
                        <filter id="barShadow" x="-10%" y="-10%" width="130%" height="130%">
                          <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#aaa" />
                        </filter>
                      </defs>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" hide />
                      <Tooltip formatter={(value) => `${value} cajones`} />
                      <Bar
                        dataKey="libres"
                        stackId="a"
                        fill="#1565C0"
                        radius={[10, 0, 0, 10]}
                        isAnimationActive={true}
                        barSize={40}
                        filter="url(#barShadow)"
                      >
                        <LabelList dataKey="libres" position="insideLeft" fill="#fff" />
                      </Bar>
                      <Bar
                        dataKey="ocupados"
                        stackId="a"
                        fill="#EF5350"
                        radius={[0, 10, 10, 0]}
                        isAnimationActive={true}
                        barSize={40}
                        filter="url(#barShadow)"
                      >
                        <LabelList dataKey="ocupados" position="insideRight" fill="#fff" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {!cargando && (
                  <div className="mt-3 resumen-cajones text-center">
                    <span className="me-3">
                      <strong>Libres:</strong> {libres}
                    </span>
                    <span className="me-3">
                      <strong>Ocupados:</strong> {ocupados}
                    </span>
                    <span>
                      <strong>Total:</strong> {total}
                    </span>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
