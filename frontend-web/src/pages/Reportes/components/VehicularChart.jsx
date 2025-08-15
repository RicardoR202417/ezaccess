import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

function VehicularChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <XAxis dataKey="nombre_usu" tickFormatter={v => v.length > 12 ? v.slice(0, 12) + '…' : v} />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis yAxisId="right" orientation="right" hide />
        <Tooltip formatter={(value, name) => name === 'porcentaje_vehicular' ? `${Number(value).toFixed(2)}%` : value} labelFormatter={label => `Usuario: ${label}`} />
        <Legend formatter={v => v === 'vehiculares' ? 'Vehiculares' : '% Vehicular'} />
        <Bar yAxisId="left" dataKey="vehiculares" name="Vehiculares" fill="#2e7d32" />
        <Line yAxisId="right" type="monotone" dataKey="porcentaje_vehicular" name="% Vehicular" stroke="#1976d2" dot={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default VehicularChart;
