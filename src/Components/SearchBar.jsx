import React, { useState } from "react";

const SearchBar = ({ onSearch, enable }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(query);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      setQuery(event.target.value); // Prevent default form submission behavior
      handleSearchClick(); // Trigger search on Enter key press
    }
  };

  return (
    <>
      <div className="input-group mb-1" style={{ width: "auto !important" }}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="form-control"
          placeholder="Search Products"
          id="searchInput"
        />
        <button
          onClick={handleSearchClick}
          className="btn btn-primary"
          style={{ width: "auto !important" }}
        >
          Search
        </button>
      </div>
    </>
  );
};

export default SearchBar;
