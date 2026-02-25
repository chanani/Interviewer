import { useNavigate, useLocation } from 'react-router-dom';
import './ContentTab.css';

const TABS = [
  { label: 'CS', paths: { browse: '/browse', quiz: '/quiz' } },
  { label: '컬처핏', paths: { browse: '/culture', quiz: '/culture-quiz' } },
];

export default function ContentTab({ type }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="content-tab">
      {TABS.map((tab) => (
        <button
          key={tab.label}
          className={`content-tab-btn ${pathname === tab.paths[type] ? 'active' : ''}`}
          onClick={() => navigate(tab.paths[type])}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
