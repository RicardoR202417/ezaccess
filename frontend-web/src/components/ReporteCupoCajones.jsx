import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
  Legend
} from "recharts";
import { Card, Spinner, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";

export default function ReporteCupoCajones({ preview }) {
  const [ocupados, setOcupados] = useState(0);
  const [libres, setLibres] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [zonas, setZonas] = useState([]); // Estado para almacenar datos por zona

  useEffect(() => {
    const obtenerDatosCajones = async () => {
      try {
        const res = await fetch("https://ezaccess-backend.onrender.com/api/cajones");
        if (!res.ok) throw new Error("Error al obtener datos de cajones");
        const data = await res.json();
        const cajones = Array.isArray(data.datos) ? data.datos : Array.isArray(data) ? data : [];
        const totalOcupados = cajones.filter((c) => c.estado === "ocupado").length;
        const totalLibres = cajones.filter((c) => c.estado === "libre").length;
        setOcupados(totalOcupados);
        setLibres(totalLibres);
      } catch (error) {
        console.error(error);
        setOcupados(0);
        setLibres(0);
      } finally {
        setCargando(false);
      }
    };

    const normalizeZona = (zona) => zona.trim().toLowerCase().replace(/\s+/g, '_');

  const obtenerDatosPorZona = async () => {
    try {
      const zonas = ["Zona A", "Zona C", "Zona D", "Zona E"];
      
      const resultados = await Promise.all(
        zonas.map(async (zonaOriginal) => {
          try {
            // Primera: intentar con la ruta original (manteniendo espacios)
            let url = `https://ezaccess-backend.onrender.com/api/cajones/zona/${encodeURIComponent(zonaOriginal)}`;
            console.log("URL construida (original):", url);
            
            let res = await fetch(url);
            if (!res.ok) {
              // Segunda: intentar con zona normalizada
              const zonaNormalizada = zonaOriginal.toLowerCase().replace(/\s+/g, '_');
              url = `https://ezaccess-backend.onrender.com/api/cajones/zona/${zonaNormalizada}`;
              console.log("URL construida (normalizada):", url);
              res = await fetch(url);
            }
            
            if (!res.ok) {
              throw new Error(`Error ${res.status} para zona ${zonaOriginal}`);
            }
            
            const data = await res.json();
            return { zona: data.zona, ...data };
          } catch (error) {
            console.error(`Error al obtener datos para ${zonaOriginal}:`, error);
            // Retornar datos por defecto en caso de error
            return {
              zona: zonaOriginal,
              totalOcupados: 0,
              totalLibres: 0,
              totalCajones: 0
            };
          }
        })
      );
      setZonas(resultados);
    } catch (error) {
      console.error("Error al obtener datos por zona:", error);
      setZonas([]);
    }
  };    obtenerDatosCajones();
    if (!preview) obtenerDatosPorZona(); // Solo obtener datos por zona si no es vista previa
  }, [preview]);

  const datosGraficaVertical = [
    { name: "Libres", value: libres, fill: "#1565C0" },
    { name: "Ocupados", value: ocupados, fill: "#EF5350" },
  ];

  // Función para exportar a PDF
  const exportarPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de Cupo de Cajones", 14, 18);
    
    // Capturar gráfica general
    const chartElementGeneral = document.getElementById("grafica-cajones-general");
    if (chartElementGeneral) {
      const canvasGeneral = await html2canvas(chartElementGeneral);
      const imgDataGeneral = canvasGeneral.toDataURL("image/png");
      doc.addImage(imgDataGeneral, "PNG", 10, 28, 180, 70);
    }
    
    // Agregar resumen textual
    doc.text(`Libres: ${libres} | Ocupados: ${ocupados} | Total: ${libres + ocupados}`, 14, 110);
    
    // Si hay datos por zona, agregar en páginas adicionales
    if (zonas && zonas.length) {
      for (let i = 0; i < zonas.length; i++) {
        const zona = zonas[i];
        if (i > 0 || true) doc.addPage(); // Siempre nueva página para zonas
        
        doc.text(`Zona: ${zona.zona}`, 14, 18);
        
        const chartElementZona = document.getElementById(`grafica-zona-${zona.zona.replace(/\s+/g, '-').toLowerCase()}`);
        if (chartElementZona) {
          const canvasZona = await html2canvas(chartElementZona);
          const imgDataZona = canvasZona.toDataURL("image/png");
          doc.addImage(imgDataZona, "PNG", 10, 28, 180, 70);
        }
        
        doc.text(`Libres: ${zona.totalLibres} | Ocupados: ${zona.totalOcupados} | Total: ${zona.totalCajones || (zona.totalLibres + zona.totalOcupados)}`, 14, 110);
      }
    }
    
    doc.save("reporte_cupo_cajones.pdf");
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Cupo general de cajones</h5>
        {!preview && (
          <Button variant="success" onClick={exportarPDF} disabled={cargando}>
            Exportar PDF
          </Button>
        )}
      </div>
      <Card className="shadow-sm rounded-4 mb-4">
        <Card.Body>
          {cargando ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : (
            <div id="grafica-cajones-general">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={datosGraficaVertical}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => `${value} cajones`} />
                <Bar dataKey="value" barSize={40}>
                  <LabelList dataKey="value" position="top" fill="#222" />
                  {datosGraficaVertical.map((entry, idx) => (
                    <Bar key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            </div>
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
                <strong>Total:</strong> {ocupados + libres}
              </span>
            </div>
          )}
        </Card.Body>
      </Card>
      {!preview && (
        <>
          <h5 className="mb-3 text-center">Cupo por zona</h5>
          {zonas.map((zona) => (
            <Card className="shadow-sm rounded-4 mb-4" key={zona.zona}>
              <Card.Body>
                <h6 className="text-center">{zona.zona}</h6>
                <div id={`grafica-zona-${zona.zona.replace(/\s+/g, '-').toLowerCase()}`}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[
                      { name: "Libres", value: zona.totalLibres, fill: "#1565C0" },
                      { name: "Ocupados", value: zona.totalOcupados, fill: "#EF5350" },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value) => `${value} cajones`} />
                    <Bar dataKey="value" barSize={40}>
                      <LabelList dataKey="value" position="top" fill="#222" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}