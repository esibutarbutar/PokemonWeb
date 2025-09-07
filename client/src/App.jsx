import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import SearchPage from './pages/GatchaSearch';
import GatchaPage from './pages/GatchaPage';
import PokemonDetail from './pages/PokemonDetail';

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  const isOnGatchaPage = location.pathname === "/gatcha";

  return (
    <>
      {!isOnGatchaPage && (
        <div className="fixed top-4 right-4 z-50">
          <Link
            to="/gatcha"
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            Gatcha
          </Link>
        </div>
      )}

      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/gatcha" element={<GatchaPage />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
      </Routes>
    </>
  );
}

export default App;
