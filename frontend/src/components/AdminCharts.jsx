import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import '../styles/AdminCharts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminCharts({ stats }) {
  // Sample data - in production this would come from real statistics
  const userGrowthData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
    datasets: [
      {
        label: 'New Users',
        data: [5, 10, 15, 22, 28, 35, 42],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  };

  const revenueData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [1000, 2500, 3200, 4100, 5200, 6800, 8500],
        backgroundColor: [
          'rgba(233, 69, 96, 0.3)',
          'rgba(243, 156, 18, 0.3)',
          'rgba(67, 233, 123, 0.3)',
          'rgba(59, 130, 246, 0.3)',
          'rgba(168, 85, 247, 0.3)',
          'rgba(59, 130, 246, 0.3)',
          'rgba(233, 69, 96, 0.3)'
        ],
        borderColor: [
          '#e94560',
          '#f39c12',
          '#43e97b',
          '#3b82f6',
          '#a855f7',
          '#3b82f6',
          '#e94560'
        ],
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  const projectStatusData = {
    labels: ['Completed', 'Processing', 'Pending', 'Failed'],
    datasets: [
      {
        data: [45, 20, 10, 5],
        backgroundColor: [
          'rgba(67, 233, 123, 0.3)',
          'rgba(59, 130, 246, 0.3)',
          'rgba(243, 156, 18, 0.3)',
          'rgba(233, 69, 96, 0.3)'
        ],
        borderColor: [
          '#43e97b',
          '#3b82f6',
          '#f39c12',
          '#e94560'
        ],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
            weight: '600'
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        }
      }
    }
  };

  return (
    <div className="charts-container">
      <div className="charts-grid">
        <div className="chart-card">
          <h4>User Growth</h4>
          <div className="chart-wrapper">
            <Line data={userGrowthData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h4>Revenue Trend</h4>
          <div className="chart-wrapper">
            <Bar data={revenueData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h4>Project Status</h4>
          <div className="chart-wrapper chart-doughnut">
            <Doughnut data={projectStatusData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
