import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";

// Versión simplificada para depuración
function ReporteVehicular() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Cargando reporte vehicular...");
    async function cargarDatos() {
      setCargando(true);
      try {
        console.log("Iniciando fetch...");
        const response = await fetch('https://ezaccess-backend.onrender.com/api/reportes/vehicular-clasificado');
        console.log("Respuesta recibida:", response.status);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Datos recibidos:", data);
        setDatos(Array.isArray(data.datos) ? data.datos : []);
        setError(null);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError(err.message || "Error al cargar el reporte vehicular clasificado");
      } finally {
        setCargando(false);
      }
    }
    
    cargarDatos();
  }, []);

  if (cargando) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-3">Cargando reporte vehicular...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <Alert.Heading>Error al cargar el reporte</Alert.Heading>
        <p>{error}</p>
        <Button 
          variant="outline-danger" 
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </Alert>
    );
  }

  if (!datos.length) {
    return (
      <Alert variant="info" className="m-3">
        <Alert.Heading>Sin datos</Alert.Heading>
        <p>No hay registros vehiculares para mostrar.</p>
      </Alert>
    );
  }
  const exportarPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte Vehicular Clasificado", 14, 18);
    
    // Capturar gráfica
    const chartElement = document.getElementById("grafica-vehicular");
    if (chartElement) {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 28, 180, 60);
    }

    // Tabla
    doc.addPage();
    doc.text("Detalle por Usuario", 14, 18);
    
    autoTable(doc, {
      head: [["Usuario", "Total Solicitudes", "Vehiculares", "% Vehicular", "Clasificación"]],
      body: datos.map((item) => [
        `${item.nombre_usu} (#${item.id_usu})`,
        item.total_solicitudes,
        item.vehiculares,
        `${Number(item.porcentaje_vehicular).toFixed(2)}%`,
        item.clasificacion_vehicular
      ]),
      startY: 28,
    });

    doc.save("reporte_vehicular_clasificado.pdf");
  };

  return (
    <Card className="shadow-sm m-3">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">Vehicular clasificado</h4>
          <p className="text-muted small mb-0">
            Distribución de solicitudes vehiculares por usuario (porcentaje vs total)
          </p>
        </div>
        <Button variant="success" onClick={exportarPDF} disabled={datos.length === 0}>
          Exportar PDF
        </Button>
      </Card.Header>
      <Card.Body>
        {/* Gráfica sencilla */}
        <div id="grafica-vehicular" className="mb-4" style={{ height: '300px', background: "#fff", borderRadius: 8, padding: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre_usu" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => Number(value)} />
              <Legend />
              <Bar dataKey="vehiculares" fill="#8884d8" name="Vehiculares" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Tabla básica */}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Total Solicitudes</th>
              <th>Vehiculares</th>
              <th>% Vehicular</th>
              <th>Clasificación</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((item) => (
              <tr key={item.id_usu}>
                <td>
                  {item.nombre_usu}
                  <small className="text-muted d-block">#{item.id_usu}</small>
                </td>
                <td className="text-end">{item.total_solicitudes}</td>
                <td className="text-end">{item.vehiculares}</td>
                <td className="text-end">
                  {Number(item.porcentaje_vehicular).toFixed(2)}%
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{ width: `${item.porcentaje_vehicular}%` }}
                      role="progressbar"
                      aria-valuenow={item.porcentaje_vehicular} 
                      aria-valuemin="0" 
                      aria-valuemax="100">
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${item.clasificacion_vehicular === "Mayor o igual al promedio" 
                    ? "bg-success" 
                    : "bg-warning text-dark"}`}>
                    {item.clasificacion_vehicular}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default ReporteVehicular;
