import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import {
  Briefcase,
  CheckCircle,
  Clock,
  List,
  Loader2,
  TrendingUp,
  Sparkles,
} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatCard = ({ title, value, icon, gradient, bgColor }) => (
  <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group hover:scale-[1.02]">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`shrink-0 w-12 h-12 ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-300" />
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {title}
      </p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { api } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/api/projects/stats");
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [api]);

  const pieChartData = {
    labels: ["To-Do", "In Progress", "Done"],
    datasets: [
      {
        label: "Tasks Status",
        data: [
          stats?.tasksToDo || 0,
          stats?.tasksInProgress || 0,
          stats?.tasksDone || 0,
        ],
        backgroundColor: [
          "rgb(250, 204, 21)",
          "rgb(99, 102, 241)",
          "rgb(16, 185, 129)",
        ],
        borderColor: "rgb(255, 255, 255)",
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 13,
            weight: "600",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 14,
          weight: "600",
        },
        bodyFont: {
          size: 13,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2
            className="animate-spin text-indigo-600 mx-auto mb-4"
            size={48}
          />
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <p className="text-lg font-medium text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="shrink-0 w-12 h-12 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
            </div>
            <p className="text-gray-600 ml-15">
              Track your projects and tasks at a glance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <StatCard
              title="Total Projects"
              value={stats?.totalProjects || 0}
              icon={<Briefcase className="text-white" size={24} />}
              gradient="bg-linear-to-br from-indigo-500 to-indigo-600"
            />
            <StatCard
              title="Tasks Completed"
              value={stats?.tasksDone || 0}
              icon={<CheckCircle className="text-white" size={24} />}
              gradient="bg-linear-to-br from-green-500 to-green-600"
            />
            <StatCard
              title="Tasks In Progress"
              value={stats?.tasksInProgress || 0}
              icon={<Clock className="text-white" size={24} />}
              gradient="bg-linear-to-br from-yellow-500 to-yellow-600"
            />
            <StatCard
              title="Total Tasks"
              value={stats?.totalTasks || 0}
              icon={<List className="text-white" size={24} />}
              gradient="bg-linear-to-br from-purple-500 to-purple-600"
            />
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-linear-to-b from-indigo-600 to-purple-600 rounded-full"></div>
              Task Breakdown
            </h2>
            <div className="max-w-md mx-auto">
              {stats?.totalTasks > 0 ? (
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <Pie data={pieChartData} options={chartOptions} />
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-indigo-100 to-purple-100 rounded-2xl mb-4">
                    <List size={32} className="text-indigo-600" />
                  </div>
                  <p className="text-gray-600 font-medium">
                    No task data available to display.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Create your first project to get started!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
