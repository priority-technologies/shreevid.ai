import { X, TrendingUp, Activity, DollarSign } from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "../styles/ApiUsageModal.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ApiUsageModal({ isOpen, onClose, apiName, stats }) {
  if (!isOpen) return null;

  // Generate sample data based on API
  const getApiData = () => {
    if (apiName === "RunwayML Gen-4 Turbo") {
      return {
        title: "RunwayML Gen-4 Turbo Usage",
        description: "AI-powered video generation from images",
        usageData: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Videos Generated',
              data: [2, 4, 3, 5, 8, 6, 4],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true,
              borderWidth: 3,
            }
          ]
        },
        costData: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              label: 'API Cost ($)',
              data: [15, 28, 42, 38],
              backgroundColor: 'rgba(233, 69, 96, 0.6)',
              borderColor: '#e94560',
              borderWidth: 2,
              borderRadius: 8,
            }
          ]
        },
        metrics: [
          { label: 'Total Requests', value: stats?.totalProjects || 0, icon: Activity, color: '#3b82f6' },
          { label: 'Success Rate', value: '98%', icon: TrendingUp, color: '#43e97b' },
          { label: 'Avg Response Time', value: '45s', icon: Activity, color: '#f39c12' },
          { label: 'Total Cost', value: `$${stats?.totalProjects ? (stats.totalProjects * 0.26).toFixed(2) : '0.00'}`, icon: DollarSign, color: '#e94560' },
        ]
      };
    } else if (apiName === "Google Cloud TTS") {
      return {
        title: "Google Cloud Text-to-Speech Usage",
        description: "Neural voice synthesis for video narration",
        usageData: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Audio Files Generated',
              data: [3, 5, 4, 6, 9, 7, 5],
              borderColor: '#43e97b',
              backgroundColor: 'rgba(67, 233, 123, 0.1)',
              tension: 0.4,
              fill: true,
              borderWidth: 3,
            }
          ]
        },
        costData: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              label: 'API Cost ($)',
              data: [2, 4, 5, 4],
              backgroundColor: 'rgba(67, 233, 123, 0.6)',
              borderColor: '#43e97b',
              borderWidth: 2,
              borderRadius: 8,
            }
          ]
        },
        metrics: [
          { label: 'Total Requests', value: stats?.totalProjects || 0, icon: Activity, color: '#43e97b' },
          { label: 'Success Rate', value: '100%', icon: TrendingUp, color: '#43e97b' },
          { label: 'Avg Response Time', value: '2s', icon: Activity, color: '#3b82f6' },
          { label: 'Total Cost', value: `$${stats?.totalProjects ? (stats.totalProjects * 0.02).toFixed(2) : '0.00'}`, icon: DollarSign, color: '#e94560' },
        ]
      };
    }
    return null;
  };

  const data = getApiData();
  if (!data) return null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
          font: { size: 12, weight: "600" },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.6)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.6)",
        },
      },
    },
  };

  return (
    <div className="api-usage-modal-overlay" onClick={onClose}>
      <div className="api-usage-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="api-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="api-modal-header">
          <h2>{data.title}</h2>
          <p>{data.description}</p>
        </div>

        <div className="api-metrics-grid">
          {data.metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="api-metric-card">
                <div className="metric-icon" style={{ backgroundColor: `${metric.color}20`, color: metric.color }}>
                  <Icon size={24} />
                </div>
                <div className="metric-info">
                  <p className="metric-label">{metric.label}</p>
                  <h3 className="metric-value">{metric.value}</h3>
                </div>
              </div>
            );
          })}
        </div>

        <div className="api-charts-grid">
          <div className="api-chart-card">
            <h3>Weekly Usage Trend</h3>
            <div className="chart-wrapper">
              <Line data={data.usageData} options={chartOptions} />
            </div>
          </div>

          <div className="api-chart-card">
            <h3>Monthly Cost Analysis</h3>
            <div className="chart-wrapper">
              <Bar data={data.costData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
