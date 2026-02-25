import { useState, useMemo } from 'react';
import { useCultureFitQuestions } from '../hooks/useQuestions';
import QuestionCard from '../components/QuestionCard';
import CategoryFilter from '../components/CategoryFilter';
import SearchInput from '../components/SearchInput';
import ContentTab from '../components/ContentTab';
import { SkeletonList } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import './CultureFitPage.css';

const QUERY_KEY = ['culturefit-questions'];

export default function CultureFitPage() {
  const { data: questions = [], isLoading, error } = useCultureFitQuestions();
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const categories = useMemo(() => {
    const set = new Set(questions.map((q) => q.category).filter(Boolean));
    return [...set];
  }, [questions]);

  const bookmarkCount = useMemo(
    () => questions.filter((q) => q.bookmarked).length,
    [questions]
  );

  const filtered = useMemo(() => {
    let list = tab === 'bookmark'
      ? questions.filter((q) => q.bookmarked)
      : questions;

    if (category) {
      list = list.filter((q) => q.category === category);
    }

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      list = list.filter(
        (q) =>
          q.title.toLowerCase().includes(keyword) ||
          q.answer.toLowerCase().includes(keyword)
      );
    }

    return list;
  }, [questions, category, search, tab]);

  if (isLoading) {
    return (
      <div className="culture">
        <div className="culture-header">
          <h1 className="culture-title">컬처핏 공부</h1>
        </div>
        <SkeletonList count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="culture-error">
        <p>데이터를 불러올 수 없습니다.</p>
        <p className="culture-error-detail">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="culture">
      <div className="culture-header">
        <h1 className="culture-title">컬처핏 공부</h1>
        <span className="culture-count">{filtered.length}개</span>
      </div>
      <ContentTab value={tab} onChange={setTab} bookmarkCount={bookmarkCount} />
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
      <div className="culture-list">
        {filtered.length === 0 ? (
          <EmptyState type="search" />
        ) : (
          filtered.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              simple
              showBookmark
              queryKey={QUERY_KEY}
            />
          ))
        )}
      </div>
    </div>
  );
}
