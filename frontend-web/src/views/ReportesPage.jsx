import React, { useState } from "react";
import SidebarReportes from "../components/SidebarReportes";
import VistaPreviaReportes from "../components/VistaPreviaReportes";
import ReporteHistorial from "../components/ReporteHistorial";
import ReporteCupoCajones from "../components/ReporteCupoCajones";
import ReporteVehicular from "../components/ReporteVehicular";
import NavBarMonitor from "../components/NavBarMonitor";
import "../styles/layout.css";

const REPORTES = [
  { key: "preview", label: "Vista previa" },
  { key: "historial", label: "Historial de asignaciones" },
  { key: "cupo", label: "Cupo actual de cajones" },
  { key: "vehicular", label: "Vehicular clasificado" },
];

export default function ReportesPage() {
  const [reporteActivo, setReporteActivo] = useState("preview");

  return (
    <div>
      <NavBarMonitor />
      <div className="container mt-4">
        <h2 className="text-center mb-3">Reportes</h2>
        <div className="row">
          <div className="col-md-3 mb-3">
            <SidebarReportes
              reportes={REPORTES}
              activo={reporteActivo}
              setActivo={setReporteActivo}
            />
          </div>
          <div className="col-md-9">
            {reporteActivo === "preview" && <VistaPreviaReportes />}
            {reporteActivo === "historial" && <ReporteHistorial />}
            {reporteActivo === "cupo" && <ReporteCupoCajones />}
            {reporteActivo === "vehicular" && <ReporteVehicular />}
          </div>
        </div>
      </div>
    </div>
  );
}