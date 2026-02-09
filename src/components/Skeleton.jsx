import './Skeleton.css';

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-bookmark" />
      <div className="skeleton-title" />
      <div className="skeleton-chevron" />
    </div>
  );
}

export function SkeletonList({ count = 5 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonQuiz() {
  return (
    <div className="skeleton-quiz">
      <div className="skeleton-progress">
        <div className="skeleton-progress-text" />
        <div className="skeleton-progress-bar" />
      </div>
      <div className="skeleton-quiz-card">
        <div className="skeleton-question" />
        <div className="skeleton-question short" />
        <div className="skeleton-hint" />
      </div>
      <div className="skeleton-btn" />
    </div>
  );
}
