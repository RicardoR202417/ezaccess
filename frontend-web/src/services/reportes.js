// Servicio para obtener el reporte vehicular clasificado
export async function fetchVehicularClasificado({ q, min_total, min_veh, orderBy, orderDir, limit, offset, signal }) {
  const params = new URLSearchParams();
  if (q) params.append('q', q);
  if (min_total !== undefined && min_total !== null && min_total !== '') params.append('min_total', Number(min_total));
  if (min_veh !== undefined && min_veh !== null && min_veh !== '') params.append('min_veh', Number(min_veh));
  if (orderBy) params.append('orderBy', orderBy);
  if (orderDir) params.append('orderDir', orderDir);
  if (limit !== undefined && limit !== null && limit !== '') params.append('limit', Number(limit));
  if (offset !== undefined && offset !== null && offset !== '') params.append('offset', Number(offset));

  const token = localStorage.getItem('token');
  const url = `https://ezaccess-backend.onrender.com/api/reportes/vehicular-clasificado?${params.toString()}`;
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(url, { method: 'GET', headers, signal });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw { status: response.status, ...error };
  }
  return response.json();
}
