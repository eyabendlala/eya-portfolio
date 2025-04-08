import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const ChartComponent = ({ data, label }) => {
  const chartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: label,
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: data,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        ticks: {
          precision: 0, 
        },
      },
    },
  };

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;