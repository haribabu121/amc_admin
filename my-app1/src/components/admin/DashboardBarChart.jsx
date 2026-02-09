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
import {
  FiUsers,
  FiSettings,
  FiClipboard,
  FiTrendingUp,
} from "react-icons/fi";

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
    revenue: 0,
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    const res = await axios.get("http://localhost:5000/api/counts");
    setCounts(res.data);
  };

  /* =======================
     STAT CARDS DATA
  ======================== */
  const stats = [
    {
      title: "TOTAL CUSTOMERS",
      value: counts.customers,
      icon: <FiUsers size={24} />,
      bg: "from-pink-200 to-pink-50",
      iconBg: "bg-pink-500",
    },
    {
      title: "SERVICES",
      value: counts.services,
      icon: <FiSettings size={24} />,
      bg: "from-blue-200 to-blue-50",
      iconBg: "bg-blue-500",
    },
    {
      title: "AMCs",
      value: counts.amcs,
      icon: <FiClipboard size={24} />,
      bg: "from-yellow-200 to-yellow-50",
      iconBg: "bg-yellow-500",
    },
  ];

  /* =======================
     CHART DATA
  ======================== */
  const data = {
    labels: ["Customers", "Services", "AMCs"],
    datasets: [
      {
        label: "Total Count",
        data: [counts.customers, counts.services, counts.amcs],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "System Overview",
        font: { size: 18, weight: "bold" },
        color: "#111827",
      },
      datalabels: {
        anchor: "end",
        align: "top",
        color: "#111827",
        font: { weight: "bold" },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#111827" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#e5e7eb" },
        ticks: { color: "#111827" },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl shadow-md bg-gradient-to-r ${item.bg} p-5`}
          >
            <div
              className={`absolute right-4 top-4 text-white p-3 rounded-full ${item.iconBg}`}
            >
              {item.icon}
            </div>

            <p className="text-sm font-semibold text-gray-600">
              {item.title}
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ================= BAR CHART ================= */}
      <div className="bg-white shadow-lg rounded-xl p-4 h-[450px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
