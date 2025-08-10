import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Box, Typography, Paper } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  title: string;
  data: PieChartData[];
  width?: number;
  height?: number;
  currencySymbol?: string;
}

const PieChart: React.FC<PieChartProps> = ({ title, data, width = 400, height = 400, currencySymbol = '¥' }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        borderColor: data.map(item => item.color),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toLocaleString()}${currencySymbol} (${percentage}%)`;
          }
        }
      }
    },
  };

  if (data.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          データがありません
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom textAlign="center">
        {title}
      </Typography>
      <Box sx={{ width, height, mx: 'auto' }}>
        <Pie data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default PieChart;
