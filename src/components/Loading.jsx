import './Loading.css';

export default function Loading() {
  return (
    <div className="loading">
      <div className="loading-spinner" />
      <p className="loading-text">불러오는 중...</p>
    </div>
  );
}
