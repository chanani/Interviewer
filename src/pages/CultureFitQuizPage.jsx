import { useState, useMemo } from 'react';
import { useCultureFitQuestions } from '../hooks/useQuestions';
import CategoryFilter from '../components/CategoryFilter';
import VoiceRecorder from '../components/VoiceRecorder';
import InterviewTimer from '../components/InterviewTimer';
import { SkeletonQuiz } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ContentTab from '../components/ContentTab';
import './CultureFitQuizPage.css';

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function CultureFitQuizPage() {
  const { data: allData = [], isLoading, error } = useCultureFitQuestions();
  const bookmarked = useMemo(() => allData.filter((q) => q.bookmarked), [allData]);

  const [category, setCategory] = useState('');
  const [shuffled, setShuffled] = useState(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [recorderKey, setRecorderKey] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  const categories = useMemo(() => {
    const set = new Set(bookmarked.map((q) => q.category).filter(Boolean));
    return [...set];
  }, [bookmarked]);

  const pool = useMemo(() => {
    return category ? bookmarked.filter((q) => q.category === category) : bookmarked;
  }, [bookmarked, category]);

  const questions = useMemo(() => {
    if (shuffled && shuffled.key === `${category}-${pool.length}`) {
      return shuffled.list;
    }
    return shuffle(pool);
  }, [pool, shuffled, category]);

  if (!shuffled && pool.length > 0) {
    setShuffled({ key: `${category}-${pool.length}`, list: shuffle(pool) });
  }

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    const filtered = cat ? bookmarked.filter((q) => q.category === cat) : bookmarked;
    setShuffled({ key: `${cat}-${filtered.length}`, list: shuffle(filtered) });
    setIndex(0);
    setRevealed(false);
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setRevealed(false);
      setRecorderKey((prev) => prev + 1);
      setTimerKey((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    const isLast = index >= questions.length - 1;
    if (isLast) {
      setShuffled({ key: `${category}-${pool.length}-${Date.now()}`, list: shuffle(questions) });
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
    setRevealed(false);
    setRecorderKey((prev) => prev + 1);
    setTimerKey((prev) => prev + 1);
  };

  if (isLoading) return <SkeletonQuiz />;

  if (error) {
    return (
      <div className="cf-quiz-error">
        <p>데이터를 불러올 수 없습니다.</p>
        <p className="cf-quiz-error-detail">{error.message}</p>
      </div>
    );
  }

  const current = shuffled?.list?.[index];

  if (!current) {
    return (
      <div className="cf-quiz">
        <EmptyState type="bookmark" />
      </div>
    );
  }

  const isLast = index >= (shuffled?.list?.length ?? 0) - 1;
  const total = shuffled?.list?.length ?? 0;

  return (
    <div className="cf-quiz">
      <ContentTab type="quiz" />

      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selected={category}
          onChange={handleCategoryChange}
        />
      )}

      <div className="cf-quiz-progress">
        <span className="cf-quiz-progress-text">
          {index + 1} / {total}
        </span>
        <div className="cf-quiz-progress-bar">
          <div
            className="cf-quiz-progress-fill"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <InterviewTimer key={timerKey} revealed={revealed} />

      <div className="cf-quiz-card">
        <h2 className="cf-quiz-question">{current.title}</h2>

        {!revealed && (
          <p className="cf-quiz-hint">머릿속으로 답변을 정리해보세요.</p>
        )}

        <VoiceRecorder key={recorderKey} />

        {revealed && current.answer && (
          <div className="cf-quiz-answer-section">
            <div className="cf-quiz-answer-card">
              <h4 className="cf-quiz-answer-label">면접 답변</h4>
              <p className="cf-quiz-answer-text">{current.answer}</p>
            </div>
          </div>
        )}
      </div>

      <div className="cf-quiz-actions">
        <button
          className="cf-quiz-btn secondary"
          onClick={handlePrev}
          disabled={index === 0}
        >
          이전
        </button>
        {!revealed && (
          <button className="cf-quiz-btn primary" onClick={handleReveal}>
            정답 보기
          </button>
        )}
        <button className="cf-quiz-btn success" onClick={handleNext}>
          {isLast ? '처음부터' : '다음'}
        </button>
      </div>
    </div>
  );
}
