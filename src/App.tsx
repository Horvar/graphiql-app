import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GraphiQLPage from './pages/GraphiQLPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/graphiql" element={<GraphiQLPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
