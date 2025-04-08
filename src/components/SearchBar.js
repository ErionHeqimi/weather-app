import React, { useState } from 'react';

const SearchBar = ({ city, onSearch }) => {
  const [inputValue, setInputValue] = useState(city);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    onSearch(inputValue);
  };

  return (
    <div className="search-bar">
      <input 
        type="text" 
        value={inputValue} 
        onChange={handleChange} 
        placeholder="Enter city" 
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
