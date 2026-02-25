import { Link } from 'react-router-dom';
import './EmptyState.css';

export default function EmptyState({ type = 'bookmark' }) {
  if (type === 'bookmark') {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <h3 className="empty-state-title">즐겨찾기된 질문이 없습니다</h3>
        <p className="empty-state-desc">
          목록에서 별 아이콘을 눌러<br />
          연습할 질문을 추가해보세요.
        </p>
        <div className="empty-state-actions">
          <Link to="/browse" className="empty-state-btn primary">
            CS 목록 보기
          </Link>
          <Link to="/culture" className="empty-state-btn secondary">
            컬처핏 공부 보기
          </Link>
        </div>
      </div>
    );
  }

  if (type === 'search') {
    return (
      <div className="empty-state">
        <div className="empty-state-icon search">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <h3 className="empty-state-title">검색 결과가 없습니다</h3>
        <p className="empty-state-desc">
          다른 키워드로 검색해보세요.
        </p>
      </div>
    );
  }

  return null;
}
