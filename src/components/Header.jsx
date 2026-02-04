import { NavLink } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to="/" className="header-logo">
          Interviewer
        </NavLink>
        <nav className="header-nav">
          <NavLink
            to="/browse"
            className={({ isActive }) =>
              `header-link ${isActive ? 'active' : ''}`
            }
          >
            CS 공부
          </NavLink>
          <NavLink
            to="/quiz"
            className={({ isActive }) =>
              `header-link ${isActive ? 'active' : ''}`
            }
          >
            CS 면접
          </NavLink>
          <NavLink
            to="/culture"
            className={({ isActive }) =>
              `header-link ${isActive ? 'active' : ''}`
            }
          >
            컬처핏
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
