import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import QuizPage from './pages/QuizPage';
import CultureFitPage from './pages/CultureFitPage';
import CultureFitQuizPage from './pages/CultureFitQuizPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/culture" element={<CultureFitPage />} />
        <Route path="/culture-quiz" element={<CultureFitQuizPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
