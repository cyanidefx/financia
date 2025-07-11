import React, { useRef, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

export default function ChartWrapper({ expenses }) {
  // Example data: you can make this smarter
  const data = {
    labels: expenses.map(e => e.title),
    datasets: [
      {
        label: 'Amount',
        data: expenses.map(e => e.amount),
        backgroundColor: 'rgba(0,112,243,0.5)'
      }
    ]
  };

  return (
    <div>
      <Line data={data} />
      <Pie data={data} style={{ marginTop: '2rem' }} />
    </div>
  );
}
