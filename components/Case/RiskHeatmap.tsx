
import React from 'react';

interface RiskHeatmapProps {
  scores: {
    fire: number;
    flood: number;
    theft: number;
    structural: number;
  };
}

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ scores }) => {
  const categories = [
    { key: 'fire', label: 'Fire & Inferno', icon: 'fa-fire' },
    { key: 'flood', label: 'Flood & Water', icon: 'fa-droplet' },
    { key: 'theft', label: 'Theft & Intrusion', icon: 'fa-user-secret' },
    { key: 'structural', label: 'Structural Integrity', icon: 'fa-trowel-bricks' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {categories.map(cat => {
        const score = scores[cat.key as keyof typeof scores];
        const getColor = (s: number) => {
          if (s > 70) return 'text-rose-600 bg-rose-50 border-rose-200';
          if (s > 40) return 'text-amber-600 bg-amber-50 border-amber-200';
          return 'text-green-600 bg-green-50 border-green-200';
        };

        return (
          <div key={cat.key} className={`p-4 rounded-2xl border transition hover:shadow-md ${getColor(score)}`}>
            <div className="flex justify-between items-center mb-2">
              <i className={`fa-solid ${cat.icon}`}></i>
              <span className="font-black text-lg">{score}%</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">{cat.label}</p>
            <div className="mt-3 h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
              <div className="h-full bg-current rounded-full" style={{ width: `${score}%` }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RiskHeatmap;
