import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HistoricalData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceChartProps {
  historicalData: HistoricalData;
  predictedPrice: number;
  coinName: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ historicalData, predictedPrice, coinName }) => {
  if (!historicalData.prices || historicalData.prices.length === 0) {
    return <div className="text-center py-10">No data available</div>;
  }

  const prices = historicalData.prices.map(price => price[1]);
  const dates = historicalData.prices.map(price => {
    const date = new Date(price[0]);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  // Add prediction point
  const allDates = [...dates, 'Prediction'];
  const allPrices = [...prices, predictedPrice];

  const data = {
    labels: allDates,
    datasets: [
      {
        label: 'Price (USD)',
        data: allPrices,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: (ctx) => {
          // Make the prediction point larger
          return ctx.dataIndex === allPrices.length - 1 ? 6 : 2;
        },
        pointBackgroundColor: (ctx) => {
          return ctx.dataIndex === allPrices.length - 1 ? 'rgb(255, 99, 132)' : 'rgb(75, 192, 192)';
        },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      },
      title: {
        display: true,
        text: `${coinName} Price History with Prediction`,
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceChart;
