import Header from './Header';
import BottomNav from './BottomNav';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="layout-main">{children}</main>
      <BottomNav />
    </>
  );
}
