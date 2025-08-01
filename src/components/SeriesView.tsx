// src/components/SeriesView.tsx
import React from 'react';
import '../styles/SeriesView.css';

type Series = {
  id: number;
  title: string;
  icon: string; // emoji or icon text
};

type SeriesViewProps = {
  series: Series[];
  onSelect: (id: number) => void;
};

const SeriesView: React.FC<SeriesViewProps> = ({ series, onSelect }) => {
  return (
    <div className="series-container">
      <div className="series-list">
        {series.map((serie) => {
          // split icon (emoji) from description if any
          const [emoji, ...descParts] = serie.icon.split(' ');
          const description = descParts.join(' ');

          return (
            <div
              key={serie.id}
              className="series-card"
              onClick={() => onSelect(serie.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelect(serie.id); }}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="serie-icon">{emoji}</div>
                  <p>{serie.title}</p>
                </div>
                <div className="flip-card-back">
                  <p>{serie.title}</p>
                  <p className="serie-desc">{description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeriesView;
