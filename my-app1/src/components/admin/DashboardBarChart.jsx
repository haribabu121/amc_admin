import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function DashboardBarChart() {
  const [counts, setCounts] = useState({
    customers: 0,
    services: 0,
    amcs: 0,
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    const res = await axios.get("http://localhost:5000/api/counts");
    setCounts(res.data);
  };

  const labels = ["Customers", "Services", "AMCs"];

  const data = {
    labels,
    datasets: [
      {
        label: "Total Count",
        data: [counts.customers, counts.services, counts.amcs],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis:"x",
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "System Overview",
      },
      datalabels: {
        anchor: "end",
        align: "top",
        color: "#111",
        font: {
          weight: "bold",
          size: 12,
        },
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return `${label} (${value})`;
        },
      },
    },
  };

  return (
   <div className="flex justify-center items-center min-h-screen">
  <div className="w-[700px] h-[500px]">
    <Bar data={data} options={options} />
  </div>
</div>

  );
}
