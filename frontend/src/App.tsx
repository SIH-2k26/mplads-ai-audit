// App.tsx — frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Alerts from './pages/Alerts';
import Cases from './pages/Cases';
import Contractors from './pages/Contractors';
import Agencies from './pages/Agencies';
import Simulation from './pages/Simulation';
import System from './pages/System';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="cases" element={<Cases />} />
          <Route path="contractors" element={<Contractors />} />
          <Route path="agencies" element={<Agencies />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="system" element={<System />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
