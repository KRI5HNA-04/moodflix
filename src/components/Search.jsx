import React from 'react';

const Search = ({searchTerm, setSearchTerm}) => {
    // console.log(searchTerm);
    return (
        <div className="search">
            <div>
                <img src="search.svg" alt="Search icon" />

                <input 
                    type="text" 
                    placeholder='Search Through Thousands of Movies' 
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />

                
            </div>
        </div>
    )
}


export default Search;