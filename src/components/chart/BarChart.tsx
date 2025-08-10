import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Box, Typography, Paper } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartData {
  month: string;
  income: number;
  expense: number;
}

interface BarChartProps {
  title: string;
  data: BarChartData[];
  currencySymbol?: string;
}

const BarChart: React.FC<BarChartProps> = ({ 
  title, 
  data, 
  currencySymbol = '¥' 
}) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: '収入',
        data: data.map(item => item.income),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: '支出',
        data: data.map(item => item.expense),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value.toLocaleString()}${currencySymbol}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString() + currencySymbol;
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
      <Box sx={{ 
        width: '100%', 
        height: { xs: 300, sm: 400, md: 450 }, 
        mx: 'auto',
        overflow: 'hidden'
      }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default BarChart;
