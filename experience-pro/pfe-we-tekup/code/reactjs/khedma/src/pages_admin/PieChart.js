import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data , name ,labels, colors }) => {
  let chartData = undefined
  if(name === 'gender'){
    chartData = {
      labels: labels,
      datasets: [
        {
          data: [data.Homme, data.Femme, data.Autres],
          backgroundColor: colors, 
        },
      ],
    };
  }else{
    chartData = {
      labels: labels,
      datasets: [
        {
          data: [data.societes, data.employers],
          backgroundColor: colors, 
        },
      ],
    };
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    width: 512, 
    height: 512, 
    legend: {
      position: 'top', 
    },
  };

  return (
    <div>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;