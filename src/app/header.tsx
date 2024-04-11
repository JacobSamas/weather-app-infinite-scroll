import React from 'react';


interface HeaderProps {
    filterQuery: string;
    setFilterQuery: React.Dispatch<React.SetStateAction<string>>;
  }
  
  const Header = ({ filterQuery, setFilterQuery }: HeaderProps) => {
  
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Weather App</h1>

        {/* Responsive Nav Toggle (for future use) */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            {/* Icon for menu (e.g., hamburger icon) */}
          </button>
        </div>

        <nav className="hidden md:flex space-x-4">
          {/* Navigation Links can be added here */}
          <a href="#" className="hover:text-gray-300">Home</a>
          {/* Add more links as needed */}
        </nav>

        <div className="relative">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter cities..."
            className="pl-8 pr-3 py-2 rounded leading-tight focus:outline-none bg-gray-700 text-white placeholder-gray-400"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-2">
            {/* Search Icon */}
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M21 21l-7-7m2 2a5 5 0 00-5-5 5 5 0 00-5 5 5 5 0 005 5 5 5 0 005-5z"></path></svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
