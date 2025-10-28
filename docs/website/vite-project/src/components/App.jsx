import Nav from './Nav';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className='App'>
      {/* Navigation */}
      <Nav />

      {/* Main Content Container */}
      <div className='max-w-6xl mx-auto px-8 py-12'>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
