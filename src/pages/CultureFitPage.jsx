import { useState, useEffect, useMemo } from 'react';
import { fetchCultureFit } from '../api/notion';
import QuestionCard from '../components/QuestionCard';
import CategoryFilter from '../components/CategoryFilter';
import Loading from '../components/Loading';
import './CultureFitPage.css';

export default function CultureFitPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchCultureFit()
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
      <div className="culture-error">
        <p>데이터를 불러올 수 없습니다.</p>
        <p className="culture-error-detail">{error}</p>
      </div>
    );
  }

  return (
    <div className="culture">
      <div className="culture-header">
        <h1 className="culture-title">컬처핏 면접</h1>
        <span className="culture-count">{filtered.length}개</span>
      </div>
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selected={category}
          onChange={setCategory}
        />
      )}
      <div className="culture-list">
        {filtered.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            simple
            showBookmark
            onBookmarkChange={handleBookmarkChange}
          />
        ))}
      </div>
    </div>
  );
}
