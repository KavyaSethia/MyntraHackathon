import React, { useState } from "react";
import "./SearchBar.css";
import { Link } from "react-router-dom";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    fetch(`http://localhost:5000/search/user?query=${searchQuery}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setSearchResults(result.users);
      });
  };

  return (
    <div className="sidebar">
      <input
        type="text"
        className="search-bar"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
      <div className="search-results">
        {searchResults.map((user) => (
          <Link
            to={`/profile/${user._id}`}
            key={user._id}
            className="search-result-item"
          >
            <div key={user._id} className="search-result-item">
              {user.name} (@{user.userName})
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
