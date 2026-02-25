import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.jsx';
import './BottomNav.css';

function NavPopup({ items, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div className="bottom-nav-popup" ref={ref}>
      {items.map((item) => (
        <button key={item.path} className="bottom-nav-popup-item" onClick={item.onClick}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default function BottomNav() {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [popup, setPopup] = useState(null);

  const isStudyActive = pathname === '/browse' || pathname === '/culture';
  const isQuizActive = pathname === '/quiz' || pathname === '/culture-quiz';

  const handleStudy = () => {
    setPopup(popup === 'study' ? null : 'study');
  };

  const handleQuiz = () => {
    setPopup(popup === 'quiz' ? null : 'quiz');
  };

  const goTo = (path) => {
    navigate(path);
    setPopup(null);
  };

  return (
    <nav className="bottom-nav">
      {popup && <div className="bottom-nav-overlay" onClick={() => setPopup(null)} />}

      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? 'active' : ''}`
        }
        onClick={() => setPopup(null)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>홈</span>
      </NavLink>

      <div className={`bottom-nav-item ${isStudyActive ? 'active' : ''}`} onClick={handleStudy}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <span>공부</span>
        {popup === 'study' && (
          <NavPopup
            items={[
              { label: 'CS 공부', path: '/browse', onClick: () => goTo('/browse') },
              { label: '컬처핏 공부', path: '/culture', onClick: () => goTo('/culture') },
            ]}
            onClose={() => setPopup(null)}
          />
        )}
      </div>

      <div className={`bottom-nav-item ${isQuizActive ? 'active' : ''}`} onClick={handleQuiz}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>면접</span>
        {popup === 'quiz' && (
          <NavPopup
            items={[
              { label: 'CS 면접', path: '/quiz', onClick: () => goTo('/quiz') },
              { label: '컬처핏 면접', path: '/culture-quiz', onClick: () => goTo('/culture-quiz') },
            ]}
            onClose={() => setPopup(null)}
          />
        )}
      </div>

      <button
        className="bottom-nav-item"
        onClick={() => { toggleTheme(); setPopup(null); }}
        aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
      >
        {theme === 'light' ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
        <span>{theme === 'light' ? '다크' : '라이트'}</span>
      </button>
    </nav>
  );
}
