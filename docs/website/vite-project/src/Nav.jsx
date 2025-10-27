function Nav() {
  return (
    <>
      <header className='bg-white dark:bg-gray-900'>
        <nav
          aria-label='Global'
          className='flex items-center justify-between p-6 lg:px-8'
        >
          <div className='flex items-center gap-x-8 lg:flex-1'>
            <a href='#' className='-m-1.5 p-1.5'>
              <span className='sr-only'>Your Company</span>
              <img
                src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600'
                alt=''
                className='h-8 w-auto dark:hidden'
              />
              <img
                src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500'
                alt=''
                className='h-8 w-auto not-dark:hidden'
              />
            </a>
          </div>
          <div className='flex lg:hidden'>
            <button
              type='button'
              command='show-modal'
              commandfor='mobile-menu'
              className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-400'
            >
              <span className='sr-only'>Open main menu</span>
              <svg
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                data-slot='icon'
                aria-hidden='true'
                className='size-6'
              >
                <path
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </div>
          <div className='hidden lg:flex lg:gap-x-12'>
            <a
              href='#'
              className='text-sm/6 font-semibold text-gray-900 dark:text-white'
            >
              Product
            </a>
            <a
              href='#'
              className='text-sm/6 font-semibold text-gray-900 dark:text-white'
            >
              Features
            </a>
            <a
              href='#'
              className='text-sm/6 font-semibold text-gray-900 dark:text-white'
            >
              Marketplace
            </a>
            <a
              href='#'
              className='text-sm/6 font-semibold text-gray-900 dark:text-white'
            >
              Company
            </a>
          </div>
          <div className='hidden lg:flex lg:flex-1 lg:justify-end'>
            <a
              href='#'
              className='text-sm/6 font-semibold text-gray-900 dark:text-white'
            >
              Log in <span aria-hidden='true'>&rarr;</span>
            </a>
          </div>
        </nav>
        <el-dialog>
          <dialog
            id='mobile-menu'
            className='backdrop:bg-transparent lg:hidden'
          >
            <div tabIndex='0' className='fixed inset-0 focus:outline-none'>
              <el-dialog-panel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:sm:ring-gray-100/10'>
                <div className='flex items-center justify-between'>
                  <a href='#' className='-m-1.5 p-1.5'>
                    <span className='sr-only'>Your Company</span>
                    <img
                      src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600'
                      alt=''
                      className='h-8 w-auto dark:hidden'
                    />
                    <img
                      src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500'
                      alt=''
                      className='h-8 w-auto not-dark:hidden'
                    />
                  </a>
                  <button
                    type='button'
                    command='close'
                    commandfor='mobile-menu'
                    className='-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-400'
                  >
                    <span className='sr-only'>Close menu</span>
                    <svg
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      data-slot='icon'
                      aria-hidden='true'
                      className='size-6'
                    >
                      <path
                        d='M6 18 18 6M6 6l12 12'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
                </div>

                <div className='mt-6 flow-root'>
                  <div className='-my-6 divide-y divide-gray-500/10 dark:divide-white/10'>
                    <div className='space-y-2 py-6'>
                      <a
                        href='#'
                        className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5'
                      >
                        Product
                      </a>
                      <a
                        href='#'
                        className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5'
                      >
                        Features
                      </a>
                      <a
                        href='#'
                        className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5'
                      >
                        Marketplace
                      </a>
                      <a
                        href='#'
                        className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5'
                      >
                        Company
                      </a>
                    </div>
                    <div className='py-6'>
                      <a
                        href='#'
                        className='-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5'
                      >
                        Log in
                      </a>
                    </div>
                  </div>
                </div>
              </el-dialog-panel>
            </div>
          </dialog>
        </el-dialog>
      </header>
    </>
  );
}

export default Nav;
