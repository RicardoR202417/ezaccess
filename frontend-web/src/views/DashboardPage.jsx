import React, { useEffect, useRef, useState } from "react";
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
import WeatherWidget from "../components/WeatherWidget";

// === Ajusta esta URL a tu backend principal (mismo host de cajones) ===
const API_BASE = "https://ezaccess-backend.onrender.com";

export default function DashboardPage() {
  const navigate = useNavigate();

  // Estado cajones (ya lo tenías)
  const [ocupados, setOcupados] = useState(0);
  const [libres, setLibres] = useState(0);
  const [cargando, setCargando] = useState(true);

  // Estado de plumas (refleja backend IoT)
  // Valores: "abierta" cuando flag=1 (solicitud emitida/pendiente de consumo por ESP),
  // "cerrada" cuando flag=0.
  const [plumaEntrada, setPlumaEntrada] = useState("cerrada");
  const [plumaSalida, setPlumaSalida] = useState("cerrada");

  // Control del polling
  const pollRef = useRef(null);

  // Helper de fetch con token
  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} - ${text || res.statusText}`);
    }
    return res.json();
  };

  // Cargar resumen de cajones (tal como lo tenías)
  useEffect(() => {
    const obtenerDatosCajones = async () => {
      try {
        const data = await authFetch(`${API_BASE}/api/cajones`);
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

  // Polling de estado de plumas (cada 1.5s)
  const leerEstadoPlumas = async () => {
    try {
      const data = await authFetch(`${API_BASE}/api/iot/plumas`); // sin oneshot
      // Backend te da 0|1; mapeamos a texto
      setPlumaEntrada(data.entrada === 1 ? "abierta" : "cerrada");
      setPlumaSalida(data.salida === 1 ? "abierta" : "cerrada");
    } catch (err) {
      console.error("No se pudo leer /iot/plumas:", err);
    }
  };

  useEffect(() => {
    // primera lectura inmediata
    leerEstadoPlumas();
    // intervalo de polling
    pollRef.current = setInterval(leerEstadoPlumas, 1500);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Acción: abrir/cerrar pluma ENTRADA o SALIDA
  const togglePluma = async (tipo) => {
    try {
      // Determina el nuevo valor deseado (optimista)
      if (tipo === "entrada") {
        const abrir = plumaEntrada !== "abierta";
        setPlumaEntrada(abrir ? "abierta" : "cerrada"); // optimista
        await authFetch(`${API_BASE}/api/iot/plumas/set`, {
          method: "POST",
          body: JSON.stringify({ entrada: abrir ? 1 : 0 }),
        });
      } else {
        const abrir = plumaSalida !== "abierta";
        setPlumaSalida(abrir ? "abierta" : "cerrada"); // optimista
        await authFetch(`${API_BASE}/api/iot/plumas/set`, {
          method: "POST",
          body: JSON.stringify({ salida: abrir ? 1 : 0 }),
        });
      }
      // La lectura real se corregirá en el siguiente poll
    } catch (err) {
      console.error("No se pudo enviar orden a /iot/plumas/set:", err);
      // Revertimos el optimista si falló
      await leerEstadoPlumas();
      alert("No se pudo ejecutar la acción en la pluma. Revise conexión.");
    }
  };

  const total = ocupados + libres;
  const datosGrafica = [{ name: "Cupo", ocupados, libres }];

  return (
    <div>
      <NavBarMonitor />
      <Container className="mt-4">
        <h2 className="mb-4 text-center">Panel de Control</h2>

        {/* Primera fila: Tarjetas principales */}
        <Row className="mb-4">
          <Col md={4}>
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
          <Col md={4}>
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
          <Col md={4}>
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

        {/* Segunda fila: Plumas */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="shadow-sm rounded-4">
              <Card.Body className="text-center">
                <Card.Title className="mb-2">Pluma de Entrada</Card.Title>
                <Card.Text className="mb-3">
                  Estado actual:{" "}
                  <strong className={plumaEntrada === "abierta" ? "text-success" : "text-danger"}>
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
          <Col md={6}>
            <Card className="shadow-sm rounded-4">
              <Card.Body className="text-center">
                <Card.Title className="mb-2">Pluma de Salida</Card.Title>
                <Card.Text className="mb-3">
                  Estado actual:{" "}
                  <strong className={plumaSalida === "abierta" ? "text-success" : "text-danger"}>
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

        {/* Tercera fila: Gráfico y clima */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="shadow-sm rounded-4">
              <Card.Body>
                <Card.Title>Cupo total del estacionamiento</Card.Title>
                {cargando ? (
                  <p>Cargando gráfico...</p>
                ) : (
                  <ResponsiveContainer width="100%" height={162}>
                    <BarChart layout="vertical" data={datosGrafica} stackOffset="expand" margin={{ left: 20 }}>
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
          <Col md={6}>
            <Card className="shadow-sm rounded-4">
              <Card.Body>
                <WeatherWidget />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
