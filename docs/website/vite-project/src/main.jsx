import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './components/App.jsx';
import Home from './components/Home.jsx';
import AboutUs from './components/AboutUs.jsx';
import './css/App.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Home />} />
          <Route path='aboutus' element={<AboutUs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
