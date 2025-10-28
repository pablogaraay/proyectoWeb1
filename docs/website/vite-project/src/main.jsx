import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './components/Home.jsx';
import './css/Home.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='Home'>
      <Home />
    </div>
  </StrictMode>
);
