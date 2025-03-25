import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-white p-4 shadow-sm">
      <div className="container mx-auto flex items-center">
      <div className="flex-1">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded">
            <span className="text-gray-500 text-sm">(Logo)</span>
          </div>
          <span className="font-semibold text-xl">Spark!Bytes</span>
        </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/profile" className="text-gray-700 hover:text-green-600">
            My Account
          </Link>
        </div>
        
        <div className="flex items-center">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white">
            A
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;