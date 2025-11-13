
import React from 'react';
import { HeartIcon } from './icons/HeartIcon';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-5xl mt-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 bg-white/30 backdrop-blur-md rounded-full shadow-lg border border-white/40">
          <p className="flex items-center gap-2 text-violet-700/90 font-medium">
            Made with <HeartIcon className="w-5 h-5 text-pink-500" /> for my jagooo
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
