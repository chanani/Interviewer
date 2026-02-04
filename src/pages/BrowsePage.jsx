import { useState, useEffect, useMemo } from 'react';
import { fetchQuestions } from '../api/notion';
import QuestionCard from '../components/QuestionCard';
import CategoryFilter from '../components/CategoryFilter';
import Loading from '../components/Loading';
import './BrowsePage.css';

export default function BrowsePage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchQuestions()
      .then(setQuestions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(questions.map((q) => q.category).filter(Boolean));
    return [...set];
  }, [questions]);

  const filtered = useMemo(() => {
    const list = category
      ? questions.filter((q) => q.category === category)
      : questions;
    return [...list].sort((a, b) => (b.bookmarked ? 1 : 0) - (a.bookmarked ? 1 : 0));
  }, [questions, category]);

  const handleBookmarkChange = (id, checked) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, bookmarked: checked } : q))
    );
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="browse-error">
        <p>데이터를 불러올 수 없습니다.</p>
        <p className="browse-error-detail">{error}</p>
      </div>
    );
  }

  return (
    <div className="browse">
      <div className="browse-header">
        <h1 className="browse-title">CS 공부</h1>
        <span className="browse-count">{filtered.length}개</span>
      </div>
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selected={category}
          onChange={setCategory}
        />
      )}
      <div className="browse-list">
        {filtered.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            showBookmark
            onBookmarkChange={handleBookmarkChange}
          />
        ))}
      </div>
    </div>
  );
}
