import { useState, useMemo, useRef } from 'react';
import { useCSQuestions } from '../hooks/useQuestions';
import { fetchPageBlocks } from '../api/notion';
import NotionRenderer from '../components/NotionRenderer';
import CategoryFilter from '../components/CategoryFilter';
import VoiceRecorder from '../components/VoiceRecorder';
import InterviewTimer from '../components/InterviewTimer';
import { SkeletonQuiz } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';
import ContentTab from '../components/ContentTab';
import './QuizPage.css';

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function QuizPage() {
  const { data: allData = [], isLoading, error } = useCSQuestions();
  const bookmarked = useMemo(() => allData.filter((q) => q.bookmarked), [allData]);
  const toast = useToast();

  const [category, setCategory] = useState('');
  const [shuffled, setShuffled] = useState(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [blocks, setBlocks] = useState(null);
  const [blocksLoading, setBlocksLoading] = useState(false);
  const [recorderKey, setRecorderKey] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  const categories = useMemo(() => {
    const set = new Set(bookmarked.map((q) => q.category).filter(Boolean));
    return [...set];
  }, [bookmarked]);

  // 현재 카테고리에 맞는 문제 목록
  const pool = useMemo(() => {
    return category ? bookmarked.filter((q) => q.category === category) : bookmarked;
  }, [bookmarked, category]);

  // 셔플 초기화: pool 변경 시 리셋
  const questions = useMemo(() => {
    if (shuffled && shuffled.key === `${category}-${pool.length}`) {
      return shuffled.list;
    }
    return shuffle(pool);
  }, [pool, shuffled, category]);

  // 셔플 상태가 없으면 초기화
  if (!shuffled && pool.length > 0) {
    setShuffled({ key: `${category}-${pool.length}`, list: shuffle(pool) });
  }

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    const filtered = cat ? bookmarked.filter((q) => q.category === cat) : bookmarked;
    setShuffled({ key: `${cat}-${filtered.length}`, list: shuffle(filtered) });
    resetQuiz();
  };

  function resetQuiz() {
    setIndex(0);
    setRevealed(false);
    setDetailOpen(false);
    setBlocks(null);
  }

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleDetail = async () => {
    const willOpen = !detailOpen;
    setDetailOpen(willOpen);

    if (willOpen && !blocks) {
      setBlocksLoading(true);
      try {
        const data = await fetchPageBlocks(questions[index].id);
        setBlocks(data);
      } catch {
        setBlocks([]);
        toast.error('상세 내용을 불러올 수 없습니다');
      } finally {
        setBlocksLoading(false);
      }
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setRevealed(false);
      setDetailOpen(false);
      setBlocks(null);
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
    setDetailOpen(false);
    setBlocks(null);
    setRecorderKey((prev) => prev + 1);
    setTimerKey((prev) => prev + 1);
  };

  if (isLoading) return <SkeletonQuiz />;

  if (error) {
    return (
      <div className="quiz-error">
        <p>데이터를 불러올 수 없습니다.</p>
        <p className="quiz-error-detail">{error.message}</p>
      </div>
    );
  }

  const current = shuffled?.list?.[index];

  if (!current) {
    return (
      <div className="quiz">
        <EmptyState type="bookmark" />
      </div>
    );
  }

  const isLast = index >= (shuffled?.list?.length ?? 0) - 1;
  const total = shuffled?.list?.length ?? 0;

  return (
    <div className="quiz">
      <ContentTab type="quiz" />

      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selected={category}
          onChange={handleCategoryChange}
        />
      )}

      <div className="quiz-progress">
        <span className="quiz-progress-text">
          {index + 1} / {total}
        </span>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <InterviewTimer key={timerKey} revealed={revealed} />

      <div className="quiz-card">
        <h2 className="quiz-question">{current.title}</h2>

        {!revealed && (
          <p className="quiz-hint">머릿속으로 답변을 정리해보세요.</p>
        )}

        <VoiceRecorder key={recorderKey} />

        {revealed && (
          <div className="quiz-answer-section">
            {current.answer && (
              <div className="quiz-answer-card">
                <h4 className="quiz-answer-label">면접 답변</h4>
                <p className="quiz-answer-text">{current.answer}</p>
              </div>
            )}

            <button
              className={`quiz-detail-toggle ${detailOpen ? 'open' : ''}`}
              onClick={handleDetail}
            >
              <span>자세히 보기</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div className={`quiz-detail ${detailOpen ? 'open' : ''}`}>
              <div className="quiz-detail-inner">
                {blocksLoading ? (
                  <div className="quiz-loading">
                    <div className="quiz-spinner" />
                  </div>
                ) : blocks ? (
                  <NotionRenderer blocks={blocks} />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="quiz-actions">
        <button
          className="quiz-btn secondary"
          onClick={handlePrev}
          disabled={index === 0}
        >
          이전
        </button>
        {!revealed && (
          <button className="quiz-btn primary" onClick={handleReveal}>
            정답 보기
          </button>
        )}
        <button className="quiz-btn success" onClick={handleNext}>
          {isLast ? '처음부터' : '다음'}
        </button>
      </div>
    </div>
  );
}
