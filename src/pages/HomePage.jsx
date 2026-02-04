import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="home-title">면접 준비,<br />시작해볼까요?</h1>
        <p className="home-subtitle">
          Notion에 정리한 지식을 면접 형식으로 복습하세요.
        </p>
      </div>
      <div className="home-cards">
        <Link to="/browse" className="home-card">
          <div className="home-card-icon browse-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>
          <h2 className="home-card-title">CS 공부</h2>
          <p className="home-card-desc">전체 CS 질문과 답변을 한눈에 확인하세요.</p>
        </Link>
        <Link to="/quiz" className="home-card">
          <div className="home-card-icon quiz-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 className="home-card-title">CS 면접</h2>
          <p className="home-card-desc">랜덤 순서로 CS 면접 질문에 답해보세요.</p>
        </Link>
        <Link to="/culture" className="home-card">
          <div className="home-card-icon culture-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h2 className="home-card-title">컬처핏 면접</h2>
          <p className="home-card-desc">인성 면접 질문과 답변을 정리하세요.</p>
        </Link>
      </div>
    </div>
  );
}
