import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchQuestions, fetchPageBlocks } from '../api/notion';
import NotionRenderer from '../components/NotionRenderer';
import CategoryFilter from '../components/CategoryFilter';
import Loading from '../components/Loading';
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
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [blocks, setBlocks] = useState(null);
  const [blocksLoading, setBlocksLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');

  const loadQuestions = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchQuestions()
      .then((data) => {
        const quizOnly = data.filter((q) => q.bookmarked);
        setAllQuestions(quizOnly);
        setQuestions(shuffle(quizOnly));
        resetQuiz();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const categories = useMemo(() => {
    const set = new Set(allQuestions.map((q) => q.category).filter(Boolean));
    return [...set];
  }, [allQuestions]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    const filtered = cat
      ? allQuestions.filter((q) => q.category === cat)
      : allQuestions;
    setQuestions(shuffle(filtered));
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
      } finally {
        setBlocksLoading(false);
      }
    }
  };

  const handleNext = () => {
    const isLast = index >= questions.length - 1;
    if (isLast) {
      setQuestions(shuffle(questions));
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
    setRevealed(false);
    setDetailOpen(false);
    setBlocks(null);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="quiz-error">
        <p>데이터를 불러올 수 없습니다.</p>
        <p className="quiz-error-detail">{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz">
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selected={category}
            onChange={handleCategoryChange}
          />
        )}
        <div className="quiz-error">
          <p>등록된 질문이 없습니다.</p>
        </div>
      </div>
    );
  }

  const current = questions[index];
  const isLast = index >= questions.length - 1;

  return (
    <div className="quiz">
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selected={category}
          onChange={handleCategoryChange}
        />
      )}

      <div className="quiz-progress">
        <span className="quiz-progress-text">
          {index + 1} / {questions.length}
        </span>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="quiz-card">
        <h2 className="quiz-question">{current.title}</h2>

        {!revealed && (
          <p className="quiz-hint">머릿속으로 답변을 정리해보세요.</p>
        )}

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
        {!revealed ? (
          <button className="quiz-btn primary" onClick={handleReveal}>
            정답 보기
          </button>
        ) : (
          <button className="quiz-btn success" onClick={handleNext}>
            {isLast ? '처음부터 다시' : '다음 문제'}
          </button>
        )}
      </div>
    </div>
  );
}
