import React from "react";
import Search from "./components/Search";
import {useState} from 'react'


const App = () => {

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main className="hero-background">
      <div className="pattern"/>

      <div className="wrapper">
        <header>
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without Hassle</h1>
        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        <h1 className="text-white">{searchTerm}</h1>
      </div>
  </main>
  );
}

export default App;