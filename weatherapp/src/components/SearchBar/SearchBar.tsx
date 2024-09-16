import React, { FormEvent } from 'react';
import "./SearchBar.css"

interface SearchBarProps {
  placeholder: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  cityInput: string;
  setCityInput: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = ({ placeholder, onSubmit, cityInput, setCityInput }: SearchBarProps) => {
  return (
    <div className="search-bar">
      <form id="city-form" onSubmit={onSubmit}>
        <input
          type="text"
          id="city-input"
          name="q"
          placeholder={placeholder}
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)} // Update the state with user input
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;
