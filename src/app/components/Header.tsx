import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-800">
            MyWebsite
          </Link>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle navigation"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Navigation and Sign Out (desktop) */}
          <div className="hidden sm:flex items-center space-x-6">
            <nav className="space-x-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900"
              >
                Home
              </Link>
              
              
            </nav>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
        {/* Mobile menu dropdown */}
        {showMenu && (
          <div className="sm:hidden mt-2 bg-white rounded shadow-md py-2 px-4">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setShowMenu(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setShowMenu(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setShowMenu(false)}
              >
                Contact
              </Link>
              <button
                onClick={() => {
                  setShowMenu(false);
                  signOut();
                }}
                className="w-full text-left px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 mt-2"
              >
                Sign Out
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
