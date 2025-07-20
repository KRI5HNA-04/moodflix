import React from "react";
import Search from "./components/Search";
import {useEffect, useState} from 'react'
import { LoaderOne } from "./components/ui/loader";

import './index.css'

const API_BASE_URL = 'https://api.themoviedb.org/3';

// for create react app we use this format
// const API_KEY = process.env.VITE_TMDB_API_KEY;


// for vite we use this format
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};


const App = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async () => {

    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Failed to fetch the movies');
      }

      const data = await response.json();
      console.log(data);
      if(data.Response == 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
    } catch(error) {
      console.log(`Failed to fetch the movies: ${error}`);
      setErrorMessage("I don't know where the movies are, come back later !");
    } finally {
      setIsLoading(false);
    }

  }

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main className="hero-background">
      <div className="pattern"/>

      <div className="wrapper">
        <header>
          <img src="hero.png" alt="hero-banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without Hassle</h1>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        <section>
          <h2 className="mt-[40px]">All Movies</h2>
          {isLoading ? (
            <LoaderOne />
          ) : errorMessage ? (
            <p className="text-red-500">Failed to fetch the movies</p>
          ) : (
            <ul className="grid grid-cols-3 gap-x-8 gap-y-8 place-content-center">
              {movieList.map((movie) => (
                <li key={movie.id} className="text-white">
                  {/* <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" /> */}
                  <h3>{movie.title}</h3>
                  {/* <p>{movie.overview}</p> */}
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
  </main>
  );
}

export default App;