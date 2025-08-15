import React from "react";
import { useNavigate } from "react-router-dom";
import ReporteHistorial from "./ReporteHistorial";
import ReporteCupoCajones from "./ReporteCupoCajones";
import ReporteVehicular from "./ReporteVehicular";

export default function VistaPreviaReportes() {
  const navigate = useNavigate();
  return (
    <div className="vista-previa-reportes">
      <h4 className="text-center mb-4">Resumen de Reportes</h4>
      <div className="row g-4">
        {/* Primera fila con 2 reportes más importantes */}
        <div className="col-md-6">
          <div className="grafica-preview-card" onClick={() => navigate("/reportes", { state: { reporteActivo: "cupo" } })}>
            <ReporteCupoCajones preview />
          </div>
        </div>
        <div className="col-md-6">
          <div className="grafica-preview-card" onClick={() => navigate("/reportes", { state: { reporteActivo: "historial" } })}>
            <ReporteHistorial preview />
          </div>
        </div>
        {/* Segunda fila con el tercer reporte centrado */}
        <div className="col-md-8 offset-md-2">
          <div className="grafica-preview-card" onClick={() => navigate("/reportes", { state: { reporteActivo: "vehicular" } })}>
            <ReporteVehicular preview />
          </div>
        </div>
      </div>
      <div className="text-center mt-3 text-muted small">
        Haga clic en una categoría específica para ver el reporte completo
      </div>
    </div>
  );
}