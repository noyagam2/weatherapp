import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <div className="search-bar">
      <form id="city-form" method="get">
        <input type="text" id="city-input" name="q" placeholder="Search for a city..." size={50} />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default SearchBar;
