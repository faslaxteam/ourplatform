import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StoryDetail from './pages/StoryDetail';

function App() {
  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<Home />} />
        
       
        <Route path="/story/:id" element={<StoryDetail />} />
      </Routes>
    </Router>
  );
}

export default App;