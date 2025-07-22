import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import NavBarMonitor from '../components/NavBarMonitor';
import '../styles/layout.css';

export default function CajonesPage() {
  const [cajones, setCajones] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const token = localStorage.getItem('token');
  console.log('🧪 Token cargado desde localStorage:', token);

  const obtenerCajones = async () => {
    setCargando(true);
    try {
      console.log('📡 Realizando solicitud GET a /api/cajones...');
      const res = await fetch('https://ezaccess-backend.onrender.com/api/cajones', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('📥 Respuesta recibida:', res);

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();
      console.log('✅ Datos obtenidos:', data);
      setCajones(data);
    } catch (error) {
      console.error('❌ Error al obtener cajones:', error);
      setMensaje('No se pudo obtener el listado de cajones.');
    } finally {
      setCargando(false);
    }
  };

  const cambiarAsignacion = async (id_caj, accion) => {
    try {
      console.log(`⚙️ Cambiando estado del cajón ${id_caj} → acción: ${accion}`);
      const res = await fetch(`https://ezaccess-backend.onrender.com/api/cajones/${id_caj}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ accion })
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje(data.mensaje);
        obtenerCajones();
      } else {
        setMensaje(data.mensaje || 'Error al cambiar estado');
      }
    } catch (err) {
      console.error('❌ Error al cambiar estado:', err);
      setMensaje('Error en la conexión con el servidor.');
    }
  };

  useEffect(() => {
    obtenerCajones();
  }, []);

  return (
    <div>
      <NavBarMonitor />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Mapa de Cajones</h2>

        {mensaje && (
          <Alert variant="info" onClose={() => setMensaje('')} dismissible>
            {mensaje}
          </Alert>
        )}

        {cargando ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <div className="grid-cajones">
            {cajones.map((cajon) => (
              <div
                key={cajon.id_caj}
                className={`card-cajon ${cajon.estado === 'ocupado' ? 'ocupado' : 'libre'}`}
              >
                <h5>{cajon.numero_caj}</h5>
                <p className="ubicacion">{cajon.ubicacion_caj}</p>
                <p className="estado">
                  Estado: <strong>{cajon.estado}</strong>
                </p>
                <Button
                  variant={cajon.estado === 'ocupado' ? 'danger' : 'success'}
                  size="sm"
                  onClick={() =>
                    cambiarAsignacion(cajon.id_caj, cajon.estado === 'ocupado' ? 'finalizar' : 'activar')
                  }
                >
                  {cajon.estado === 'ocupado' ? 'Finalizar' : 'Activar'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
