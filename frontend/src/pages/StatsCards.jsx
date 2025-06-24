import React from 'react';

const StatsCards = ({ title, value, icon, color }) => {
  return (
    <div className={`${color} p-4 rounded-lg border-1 shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</h3>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
};

export default StatsCards;