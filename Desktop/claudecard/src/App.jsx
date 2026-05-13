import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import HomePage from './pages/HomePage';
import RewardsPage from './pages/RewardsPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import './styles/globals.css';

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/rewards"       element={<RewardsPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}
