import { useState, useMemo } from 'react';
import { useCSQuestions } from '../hooks/useQuestions';
import QuestionCard from '../components/QuestionCard';
import CategoryFilter from '../components/CategoryFilter';
import SearchInput from '../components/SearchInput';
import { SkeletonList } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import './BrowsePage.css';

const QUERY_KEY = ['cs-questions'];

export default function BrowsePage() {
  const { data: questions = [], isLoading, error } = useCSQuestions();
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const categories = useMemo(() => {
    const set = new Set(questions.map((q) => q.category).filter(Boolean));
    return [...set];
  }, [questions]);

  const filtered = useMemo(() => {
    let list = category
      ? questions.filter((q) => q.category === category)
      : questions;

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      list = list.filter(
        (q) =>
          q.title.toLowerCase().includes(keyword) ||
          q.answer.toLowerCase().includes(keyword)
      );
    }

    return [...list].sort((a, b) => (b.bookmarked ? 1 : 0) - (a.bookmarked ? 1 : 0));
  }, [questions, category, search]);

  if (isLoading) {
    return (
      <div className="browse">
        <div className="browse-header">
          <h1 className="browse-title">CS 공부</h1>
        </div>
        <SkeletonList count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="browse-error">
        <p>데이터를 불러올 수 없습니다.</p>
        <p className="browse-error-detail">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="browse">
      <div className="browse-header">
        <h1 className="browse-title">CS 공부</h1>
        <span className="browse-count">{filtered.length}개</span>
      </div>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="질문 또는 답변 검색..."
      />
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selected={category}
          onChange={setCategory}
        />
      )}
      <div className="browse-list">
        {filtered.length === 0 ? (
          <EmptyState type="search" />
        ) : (
          filtered.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              showBookmark
              queryKey={QUERY_KEY}
            />
          ))
        )}
      </div>
    </div>
  );
}
