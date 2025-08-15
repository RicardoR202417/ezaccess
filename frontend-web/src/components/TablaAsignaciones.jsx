import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Spinner } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TablaAsignaciones = ({ filtros }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://ezaccess-backend.onrender.com/api/reportes/asignaciones');
        const result = await res.json();
        if (Array.isArray(result.datos) && result.datos.length > 0) {
          console.log('Claves de los primeros objetos:', Object.keys(result.datos[0]), Object.keys(result.datos[1]), Object.keys(result.datos[2]));
        }
        console.log('Asignaciones recibidas:', result.datos);
  setData(Array.isArray(result.datos) ? result.datos : []);
      } catch (err) {
        setError('Error al cargar asignaciones');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Asignaciones de Cajones', 14, 16);
    doc.autoTable({
      startY: 22,
      head: [[
        'Fecha Asignación',
        'Usuario',
        'Cajón',
        'Estado',
        'Observaciones'
      ]],
      body: data.map(item => [
        item.fechaAsignacion || '',
        item.usuarioNombre || '',
        item.cajonNombre || '',
        item.estado || '',
        item.observaciones || ''
      ]),
    });
    doc.save('asignaciones.pdf');
  };

  return (
    <div className="tabla-reporte">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Historial de Asignaciones</h5>
        <Button variant="primary" onClick={exportPDF} disabled={loading || !data.length}>
          Exportar PDF
        </Button>
      </div>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>Fecha Asignación</th>
              <th>Usuario</th>
              <th>Cajón</th>
              <th>Estado</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={5} className="text-center">Sin resultados</td></tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.fechaAsignacion}</td>
                  <td>{item.usuarioNombre}</td>
                  <td>{item.cajonNombre}</td>
                  <td>{item.estado}</td>
                  <td>{item.observaciones}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TablaAsignaciones;
