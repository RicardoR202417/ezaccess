import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportVehicularPDF({ chartRef, data, filters, sorting, pagination }) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  doc.setFont('helvetica');
  doc.setFontSize(18);
  doc.text('Reporte Vehicular Clasificado', 40, 40);
  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date().toLocaleString()}`, 40, 65);

  // Filtros
  let filtrosTxt = `Filtros: `;
  if (filters.q) filtrosTxt += `Usuario contiene "${filters.q}". `;
  if (filters.min_total) filtrosTxt += `Mín. total: ${filters.min_total}. `;
  if (filters.min_veh) filtrosTxt += `Mín. vehiculares: ${filters.min_veh}. `;
  doc.text(filtrosTxt, 40, 85);

  // Gráfica
  if (chartRef.current) {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 40, 100, 500, 200);
  }

  // Tabla resumen (top 10)
  doc.setFontSize(12);
  doc.text('Resumen (top 10):', 40, 320);
  const headers = ['Usuario', 'Total', 'Vehiculares', '% Vehicular', 'Clasificación'];
  const rows = data.slice(0, 10).map(row => [
    `${row.nombre_usu} (#${row.id_usu})`,
    row.total_solicitudes,
    row.vehiculares,
    `${Number(row.porcentaje_vehicular).toFixed(2)}%`,
    row.clasificacion_vehicular
  ]);
  let y = 340;
  doc.setFontSize(10);
  doc.setTextColor(40);
  doc.text(headers.join(' | '), 40, y);
  y += 16;
  rows.forEach(r => {
    doc.text(r.join(' | '), 40, y);
    y += 14;
  });

  doc.save('reporte_vehicular_clasificado.pdf');
}
