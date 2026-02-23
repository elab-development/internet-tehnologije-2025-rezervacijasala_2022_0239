"use client";

import { useEffect, ReactNode, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registracija Chart.js komponenti
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ManagerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Greška pri učitavanju podataka:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-600 animate-pulse">Učitavanje analitike...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-red-500">Greška pri prikazu podataka.</p>
      </div>
    );
  }

  const months = stats.monthlyData.map((m: any) => m.month);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Statistika poslovanja</h1>
          <p className="text-gray-500 mt-2">Pregled rezervacija i prihoda u realnom vremenu.</p>
        </header>

        <div className="space-y-8">
          
          {/* 1. Najpopularnije sale - Full Width */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Najpopularnije sale (Top 5)</h2>
            <div className="h-[350px]">
              <Bar 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } } 
                }}
                data={{
                  labels: stats.popularHalls.map((h: any) => h.name),
                  datasets: [{
                    label: "Ukupan broj rezervacija",
                    data: stats.popularHalls.map((h: any) => h.count),
                    backgroundColor: "rgba(124, 58, 237, 0.8)",
                    borderRadius: 10,
                    barThickness: 40,
                  }]
                }} 
              />
            </div>
          </div>

          {/* Grid za manja dva grafikona */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 2. Rezervacije po mjesecu */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-6 text-gray-800">Broj rezervacija po mjesecu</h2>
              <div className="h-[300px]">
                <Line 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' as const } }
                  }}
                  data={{
                    labels: months,
                    datasets: [{
                      label: "Rezervacije",
                      data: stats.monthlyData.map((m: any) => m.count),
                      borderColor: "#3b82f6",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      fill: true,
                      tension: 0.4,
                      pointRadius: 5,
                      pointBackgroundColor: "#3b82f6"
                    }]
                  }} 
                />
              </div>
            </div>

            {/* 3. Zarada po mjesecu */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-6 text-gray-800">Zarada po mjesecu (EUR)</h2>
              <div className="h-[300px]">
                <Bar 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' as const } }
                  }}
                  data={{
                    labels: months,
                    datasets: [{
                      label: "Zarada (€)",
                      data: stats.monthlyData.map((m: any) => m.revenue),
                      backgroundColor: "rgba(16, 185, 129, 0.8)", 
                      borderRadius: 6,
                    }]
                  }} 
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}