import React from 'react';

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface FeatureGridProps {
  items: FeatureItem[];
  columns?: 1 | 2 | 3 | 4;
  cardPadding?: number;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ items, columns = 3, cardPadding = 16 }) => {
  const template = `repeat(${columns}, minmax(0, 1fr))`;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: template, gap: 20 }}>
      {items.map((f, i) => (
        <div 
          key={i} 
          className="group bg-white border border-gray-200/60 rounded-2xl p-6 transition-all duration-300 hover:border-blue-300/60 hover:shadow-lg"
          style={{ padding: cardPadding }}
        >
          <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureGrid;