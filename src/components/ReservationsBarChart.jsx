import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReservationsBarChart = ({ reservations }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!reservations || reservations.length === 0) {
      setChartData([]);
      return;
    }

    const reservationsByDay = reservations.reduce((acc, reservation) => {
      const reservationDate = new Date(reservation.date || reservation.createdAt);
      const dateKey = reservationDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          count: 0,
          displayDate: reservationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };
      }
      
      acc[dateKey].count += 1;
      return acc;
    }, {});

    const dataArray = Object.values(reservationsByDay);
    dataArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    const recentData = dataArray.slice(-7);
    setChartData(recentData);
  }, [reservations]);

  if (chartData.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Reservations per Day</h2>
        <p className="text-gray-400 italic">No reservation data available for chart</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Reservations per Day</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fill: '#ddd' }}
              axisLine={{ stroke: '#555' }}
            />
            <YAxis 
              tick={{ fill: '#ddd' }}
              axisLine={{ stroke: '#555' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
            />
            <Bar dataKey="count" name="Reservations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReservationsBarChart;