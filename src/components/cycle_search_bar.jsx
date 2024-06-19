// src/components/SearchBar.jsx
import React from 'react';
import searchIcon from '../assets/Icons/search.svg'

const CycleSearchBar = ({ searchTerm, onSearchChange, sortYears, sortMonths, onYearChange, onMonthChange, yearValue, monthValue }) => {
    return (
        <div className=' flex items-center justify-start'>
            <div
                className="bg-superLight mr-2 rounded-lg flex items-center justify-around"><img src={searchIcon} alt="Action Icon" className="w-4 h-4 ml-3 " />
                <input
                    type="text"
                    placeholder="Matricule, Nom, Prénom"
                    value={searchTerm}
                    onChange={onSearchChange}
                    className="bg-superLight p-2 mr-2 rounded-lg focus:outline-none"
                /></div>
            <select onChange={onYearChange} className='border-2 p-2 mr-2 rounded-lg select-none focus:outline-none text-black font-normal w-24' value={yearValue}>
                {sortYears.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <select onChange={onMonthChange} className='border-2 p-2 mr-2 rounded-lg select-none focus:outline-none text-black font-normal w-32' value={monthValue}>
                {sortMonths.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CycleSearchBar;
