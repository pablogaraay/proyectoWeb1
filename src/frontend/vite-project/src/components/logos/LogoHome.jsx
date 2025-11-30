function LogoHome() {
  return (
    <div className='flex justify-center mb-8'>
      <div className='w-56 h-56 bg-white rounded-full flex items-center justify-center p-4 shadow-lg overflow-hidden'>
        <img
          src='/src/assets/logo.png'
          alt='TimeRated Logo'
          className='w-full h-full object-contain'
        />
      </div>
    </div>
  );
}

export default LogoHome;
