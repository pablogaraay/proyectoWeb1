import Nav from './Nav';
import Card from './Card';
import './Cards.css';

function App() {
  return (
    <>
      <div>
        <Nav />
      </div>
      <div className='Cards'>
        <Card />
        <Card />
        <Card />
      </div>
    </>
  );
}

export default App;
