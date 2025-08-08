import React from "react";
import "../styles/layout.css";

export default function SidebarReportes({ reportes, activo, setActivo }) {
  return (
    <div className="sidebar-reportes">
      {reportes.map((r) => (
        <button
          key={r.key}
          className={`sidebar-btn-reportes ${activo === r.key ? "active" : ""}`}
          onClick={() => setActivo(r.key)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}