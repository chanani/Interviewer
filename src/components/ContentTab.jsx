import './ContentTab.css';

export default function ContentTab({ value, onChange, bookmarkCount }) {
  return (
    <div className="content-tab">
      <button
        className={`content-tab-btn ${value === 'all' ? 'active' : ''}`}
        onClick={() => onChange('all')}
      >
        전체
      </button>
      <button
        className={`content-tab-btn ${value === 'bookmark' ? 'active' : ''}`}
        onClick={() => onChange('bookmark')}
      >
        즐겨찾기{bookmarkCount > 0 && <span className="content-tab-badge">{bookmarkCount}</span>}
      </button>
    </div>
  );
}
