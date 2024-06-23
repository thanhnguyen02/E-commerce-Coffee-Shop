import React, { useState } from 'react';
import './Search.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { IoIosSearch } from "react-icons/io";

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    const handleSearch = async () => {
        if (searchQuery.trim() !== '') {
            navigate(`/search/${encodeURIComponent(searchQuery)}`); // Navigate to search results page
        }
    };

    return (
        <div className="search-bar">
            <div className="search-input">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm"
                />
                <button onClick={handleSearch}><IoIosSearch /></button>
            </div>
        </div>
    );
};

export default SearchBar;
