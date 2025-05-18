import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MemeStatsChart = ({ meme }) => {
  const data = {
    labels: ["Views", "Likes", "Dislikes", "Comments"],
    datasets: [
      {
        label: "Meme Stats",
        data: [
          meme.views || 0,
          meme.likes || 0,
          meme.dislikes || 0,
          meme.comments?.length || 0,
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#ef4444", "#f59e0b"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="w-full h-[300px] sm:h-[400px] md:h-[450px] p-4">
      <Bar data={data} options={options} />
    </div>
  );
};

export default MemeStatsChart;
