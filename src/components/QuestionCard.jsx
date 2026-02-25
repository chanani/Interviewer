import { useState, useRef, useEffect } from 'react';
import { fetchPageBlocks } from '../api/notion';
import { useBookmarkMutation } from '../hooks/useQuestions';
import { useToast } from './Toast';
import NotionRenderer from './NotionRenderer';
import './QuestionCard.css';

export default function QuestionCard({ question, simple, showBookmark, queryKey }) {
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [blocks, setBlocks] = useState(null);
  const [loading, setLoading] = useState(false);
  const loaded = useRef(false);
  const toast = useToast();

  const bookmarkMutation = useBookmarkMutation(queryKey);

  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (!simple && open && !loaded.current) {
      loaded.current = true;
      setLoading(true);
      fetchPageBlocks(question.id)
        .then(setBlocks)
        .catch(() => {
          setBlocks([]);
          toast.error('내용을 불러올 수 없습니다');
        })
        .finally(() => setLoading(false));
    }
  }, [simple, open, question.id, toast]);

  const handleDetail = async () => {
    const willOpen = !detailOpen;
    setDetailOpen(willOpen);

    if (willOpen && !loaded.current) {
      loaded.current = true;
      setLoading(true);
      try {
        const data = await fetchPageBlocks(question.id);
        setBlocks(data);
      } catch {
        setBlocks([]);
        toast.error('내용을 불러올 수 없습니다');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBookmarkToggle = (e) => {
    e.stopPropagation();
    const newChecked = !question.bookmarked;
    toast.success(newChecked ? '즐겨찾기에 추가됨' : '즐겨찾기에서 제거됨');
    bookmarkMutation.mutate(
      { pageId: question.id, checked: newChecked },
      {
        onError: () => {
          toast.error('즐겨찾기 변경 실패');
        },
      }
    );
  };

  return (
    <div className={`question-card ${open ? 'open' : ''}`}>
      <button className="question-card-header" onClick={handleToggle}>
        {showBookmark && (
          <span
            role="button"
            tabIndex={0}
            className={`question-card-bookmark ${question.bookmarked ? 'active' : ''}`}
            onClick={handleBookmarkToggle}
            onKeyDown={(e) => { if (e.key === 'Enter') handleBookmarkToggle(e); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={question.bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </span>
        )}
        <span className="question-card-title">{question.title}</span>
        <svg
          className="question-card-chevron"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="question-card-collapse">
        <div className="question-card-body">
          {simple ? (
            question.answer ? (
              <div className="question-card-answer">
                <h4 className="question-card-label">면접 답변</h4>
                <p className="question-card-answer-text">{question.answer}</p>
              </div>
            ) : (
              <p className="question-card-empty">답변이 없습니다</p>
            )
          ) : (
            <>
              {question.answer && (
                <div className="question-card-answer">
                  <h4 className="question-card-label">면접 답변</h4>
                  <p className="question-card-answer-text">{question.answer}</p>
                </div>
              )}

              <button
                className={`question-card-detail-toggle ${detailOpen ? 'open' : ''}`}
                onClick={handleDetail}
              >
                <span>자세히 보기</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div className={`question-card-detail ${detailOpen ? 'open' : ''}`}>
                <div className="question-card-detail-inner">
                  {loading ? (
                    <div className="question-card-loading">
                      <div className="question-card-spinner" />
                    </div>
                  ) : blocks ? (
                    <NotionRenderer blocks={blocks} />
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
