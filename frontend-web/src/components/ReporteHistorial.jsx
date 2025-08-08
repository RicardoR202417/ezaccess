import React, { useEffect, useState } from "react";
import { Table, Button, Alert, Form } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export default function ReporteHistorial({ preview }) {
  const [registros, setRegistros] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    tipo: "",
    estado: "",
    cajon: "",
  });

  useEffect(() => {
    const obtenerHistorial = async () => {
      setCargando(true);
      setMensaje("");
      try {
        const res = await fetch(
          "https://ezaccess-backend.onrender.com/api/reportes/historial"
        );
        const data = await res.json();
        setRegistros(Array.isArray(data.datos) ? data.datos : []);
      } catch (err) {
        setMensaje("No se pudo cargar el historial.");
      } finally {
        setCargando(false);
      }
    };
    obtenerHistorial();
  }, []);

  // Filtrar registros según los filtros seleccionados
  const registrosFiltrados = registros.filter((r) => {
    const fecha = new Date(r.fecha).toISOString().slice(0, 10);
    const cumpleFechaInicio = filtros.fechaInicio ? fecha >= filtros.fechaInicio : true;
    const cumpleFechaFin = filtros.fechaFin ? fecha <= filtros.fechaFin : true;
    const cumpleTipo = filtros.tipo ? r.tipo_asig === filtros.tipo : true;
    const cumpleEstado = filtros.estado ? r.estado_asig === filtros.estado : true;
    const cumpleCajon = filtros.cajon ? r.cajon === filtros.cajon : true;
    return cumpleFechaInicio && cumpleFechaFin && cumpleTipo && cumpleEstado && cumpleCajon;
  });

  // Agrupa por día para el histograma
  const registrosPorDia = registrosFiltrados.reduce((acc, r) => {
    const fecha = new Date(r.fecha).toISOString().slice(0, 10);
    acc[fecha] = (acc[fecha] || 0) + 1;
    return acc;
  }, {});
  const dataGrafica = Object.entries(registrosPorDia).map(([fecha, cantidad]) => ({
    fecha,
    cantidad,
  }));

  // Manual vs Automática
  const tipoAsignaciones = registrosFiltrados.reduce(
    (acc, r) => {
      if (r.tipo_asig === "manual") acc.manual += 1;
      else acc.automatica += 1;
      return acc;
    },
    { manual: 0, automatica: 0 }
  );
  const dataTipo = [
    { tipo: "Manual", cantidad: tipoAsignaciones.manual, fill: "#2980b9" },
    { tipo: "Automática", cantidad: tipoAsignaciones.automatica, fill: "#27ae60" },
  ];

  // Exportar PDF con gráfica y tabla
  const exportarPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de Historial", 14, 18);

    // Gráfica de tendencia
    const chartElement = document.getElementById("grafica-historial");
    if (chartElement) {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 28, 180, 60);
    }

    // Gráfica manual vs automática
    const chartTipo = document.getElementById("grafica-tipo-asig");
    if (chartTipo) {
      const canvasTipo = await html2canvas(chartTipo);
      const imgDataTipo = canvasTipo.toDataURL("image/png");
      doc.addPage();
      doc.text("Asignaciones Manuales vs Automáticas", 14, 18);
      doc.addImage(imgDataTipo, "PNG", 10, 28, 180, 60);
    }

    // Tabla
    doc.addPage();
    doc.text("Reporte en Tabla", 14, 18);
    autoTable(doc, {
      head: [["Fecha", "Usuario", "Cajón", "Tipo", "Estado", "Acción"]],
      body: registrosFiltrados.map((r) => [
        new Date(r.fecha).toLocaleString(),
        r.usuario,
        r.cajon,
        r.tipo_asig,
        r.estado_asig,
        r.accion,
      ]),
      startY: 28,
    });

    doc.save("reporte_historial.pdf");
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Historial de asignaciones</h5>
        {!preview && (
          <Button variant="success" onClick={exportarPDF} disabled={registrosFiltrados.length === 0}>
            Exportar PDF
          </Button>
        )}
      </div>
      <div id="grafica-historial" style={{ background: "#fff", borderRadius: 8, padding: 12 }}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dataGrafica} barCategoryGap={0}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#3498db" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3" id="grafica-tipo-asig" style={{ background: "#fff", borderRadius: 8, padding: 12 }}>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={dataTipo}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad">
              {dataTipo.map((entry, index) => (
                <Bar key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {!preview && (
        <Form className="mt-4">
          <div className="row g-3">
            <div className="col-md-3">
              <Form.Label>Fecha inicio</Form.Label>
              <Form.Control
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <Form.Label>Fecha fin</Form.Label>
              <Form.Control
                type="date"
                value={filtros.fechaFin}
                onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                value={filtros.tipo}
                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
              >
                <option value="">Todos</option>
                <option value="manual">Manual</option>
                <option value="automatica">Automática</option>
              </Form.Select>
            </div>
            <div className="col-md-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={filtros.estado}
                onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
              >
                <option value="">Todos</option>
                <option value="activa">Activa</option>
                <option value="finalizada">Finalizada</option>
              </Form.Select>
            </div>
            <div className="col-md-3">
              <Form.Label>Cajón</Form.Label>
              <Form.Control
                type="text"
                value={filtros.cajon}
                onChange={(e) => setFiltros({ ...filtros, cajon: e.target.value })}
                placeholder="Número de cajón"
              />
            </div>
          </div>
        </Form>
      )}
      {!preview && (
        <div className="mt-4">
          {mensaje && <Alert variant="danger">{mensaje}</Alert>}
          <Table striped bordered hover>
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
        </div>
      )}
    </div>
  );
}