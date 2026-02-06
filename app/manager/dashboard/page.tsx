"use client";

import { useEffect, useState } from "react";
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

// Registracija neophodnih elemenata za Chart.js
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

  if (loading) return <div className="p-10 text-center">Učitavanje analitike...</div>;
  if (!stats) return <div className="p-10 text-center text-red-500">Greška pri prikazu podataka.</div>;

  const months = stats.monthlyData.map((m: any) => m.month);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Statistika</h1>

      <div className="flex flex-col gap-8">
        
        {/* 1. Najpopularnije sale - Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Najpopularnije sale (Top 5)</h2>
          <div className="h-[300px]">
            <Bar 
              options={{ maintainAspectRatio: false }}
              data={{
                labels: stats.popularHalls.map((h: any) => h.name),
                datasets: [{
                  label: "Ukupan broj rezervacija",
                  data: stats.popularHalls.map((h: any) => h.count),
                  backgroundColor: "rgba(124, 58, 237, 0.7)", // Ljubičasta
                  borderRadius: 8,
                }]
              }} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 2. Rezervacije po mjesecu - Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Broj rezervacija po mjesecu</h2>
            <div className="h-[300px]">
              <Line 
                options={{ maintainAspectRatio: false }}
                data={{
                  labels: months,
                  datasets: [{
                    label: "Rezervacije",
                    data: stats.monthlyData.map((m: any) => m.count),
                    borderColor: "#3b82f6", // Plava
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    fill: true,
                    tension: 0.4
                  }]
                }} 
              />
            </div>
          </div>

          {/* 3. Zarada po mjesecu - Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Zarada po mjesecu (EUR)</h2>
            <div className="h-[300px]">
              <Bar 
                options={{ maintainAspectRatio: false }}
                data={{
                  labels: months,
                  datasets: [{
                    label: "Zarada",
                    data: stats.monthlyData.map((m: any) => m.revenue),
                    backgroundColor: "rgba(16, 185, 129, 0.7)", // Zelena
                    borderRadius: 8,
                  }]
                }} 
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}