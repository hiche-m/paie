// src/components/SearchBar.jsx
import React from 'react';
import searchIcon from '../assets/Icons/search.svg'

const SearchBar = ({ searchTerm, onSearchChange, sortOptions, onSortChange }) => {
    return (
        <div className=' flex items-center justify-start'>
            <div
                className="bg-superLight mr-2 rounded-lg flex items-center justify-around"><img src={searchIcon} alt="Action Icon" className="w-4 h-4 ml-3 " />
                <input
                    type="text"
                    placeholder="Nom ou prénom..."
                    value={searchTerm}
                    onChange={onSearchChange}
                    className="bg-superLight p-2 mr-2 rounded-lg focus:outline-none"
                /></div>
            <div className="border-2 p-2 mr-2 rounded-lg text-textSecound font-medium select-none">
                Trier par:
                <select onChange={onSortChange} className='focus:outline-none text-black font-normal'>
                    <option>Selectionner</option>
                    {sortOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SearchBar;
