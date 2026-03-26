import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewGlucose from './pages/NewGlucose';
import NewMeal from './pages/NewMeal';
import History from './pages/History';
import Login from './pages/Login';

function App() {
  const isAuthenticated = localStorage.getItem('glicotrack_auth') === 'true';

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/glucose/new" element={<NewGlucose />} />
              <Route path="/glucose/edit/:id" element={<NewGlucose />} />
              <Route path="/meal/new" element={<NewMeal />} />
              <Route path="/meal/edit/:id" element={<NewMeal />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  )
}

export default App;
