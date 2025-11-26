import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './components/App.jsx';
import Home from './components/Home.jsx';
import AboutUs from './components/AboutUs.jsx';
import './css/App.css';
import Account from './components/Account.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Catalogo from './components/Catalogo.jsx';
import Noticias from './components/Noticias.jsx';
import './i18n';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Home />} />
          <Route path='aboutus' element={<AboutUs />} />
          <Route path='account' element={<Account />} />
          <Route path='login' element={<Login />} />
          <Route path='noticias' element={<Noticias />} />
          <Route path='catalogo' element={<Catalogo />} />
          <Route path='register' element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
