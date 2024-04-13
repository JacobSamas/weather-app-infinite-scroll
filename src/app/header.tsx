import React from 'react';

interface HeaderProps {
  filterQuery: string;
  setFilterQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Header = ({ filterQuery, setFilterQuery }: HeaderProps): JSX.Element => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg fixed top-0">
      <div className="container mx-auto flex justify-between items-center p-6">
        <h1 className="text-3xl font-bold flex items-center">
          {/* Optionally add an icon or logo here */}
          <span>Weather App</span>
        </h1>

        {/* Responsive Nav Toggle (for future use) */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            {/* Hamburger icon or similar */}
          </button>
        </div>

        <nav className="hidden md:flex space-x-6">
          {/* Navigation Links */}
          <a href="#" className="text-white hover:text-blue-200 transition duration-300">Home</a>
          {/* More links */}
        </nav>

        <div className="relative w-1/3">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter cities..."
            className="w-full pl-10 pr-4 py-2 rounded leading-tight focus:outline-none bg-gray-700 text-white placeholder-gray-400 transition duration-300 focus:bg-gray-600"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            {/* Search Icon */}
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M21 21l-7-7m2 2a5 5 0 00-5-5 5 5 0 00-5 5 5 5 0 005 5 5 5 0 005-5z"></path>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

