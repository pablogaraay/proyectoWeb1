import { useNavigate } from 'react-router-dom';

function LogoNavBar() {
  const navigate = useNavigate();

  return (
    <div
      className='flex items-center cursor-pointer'
      onClick={() => navigate('/')}
    >
      <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center p-1'>
        <img
          src='/src/assets/logo.png'
          alt='TimeRated Logo'
          className='w-full h-full object-contain'
        />
      </div>
    </div>
  );
}

export default LogoNavBar;
