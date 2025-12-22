import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import GetStarted from './pages/GetStarted';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more routes here */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
