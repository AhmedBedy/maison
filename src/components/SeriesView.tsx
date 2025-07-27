import React from 'react';
import '../styles/SeriesView.css'; // Make sure this is imported!

type SeriesViewProps = {
  series: { id: number; title: string; icon: string }[];
  onSelect: (id: number) => void;
};

const SeriesView: React.FC<SeriesViewProps> = ({ series, onSelect }) => {
  return (
    <div className="series-container">
      <div className="series-list">
        {series.map((s) => (
          <div
            key={s.id}
            className="series-card"
            onClick={() => onSelect(s.id)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                {s.icon.startsWith('http') ? (
                  <img src={s.icon} alt={s.title} className="serie-icon" />
                ) : (
                  <div className="serie-icon">{s.icon}</div>
                )}
                <p>{s.title}</p>
              </div>
              <div className="flip-card-back">
                <p>{s.title}</p>
                <p>Click to view grades</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeriesView;
