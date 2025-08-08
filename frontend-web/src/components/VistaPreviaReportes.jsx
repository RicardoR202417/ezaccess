import React from "react";
import ReporteHistorial from "./ReporteHistorial";
import ReporteCupoCajones from "./ReporteCupoCajones";

export default function VistaPreviaReportes() {
  return (
    <div className="vista-previa-reportes">
      <div className="row g-4">
        <div className="col-md-6">
          <div className="grafica-preview-card">
            <ReporteCupoCajones preview />
          </div>
        </div>
        <div className="col-md-6">
          <div className="grafica-preview-card">
            <ReporteHistorial preview />
          </div>
        </div>
      </div>
    </div>
  );
}