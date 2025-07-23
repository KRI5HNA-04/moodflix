import React from "react";
import Search from "./components/Search";
import {useEffect, useState} from 'react'
import { LoaderOne } from "./components/ui/loader";
import {useDebounce} from 'react-use';
import { getTrendingMovies, updateSearchCount } from "./appwrite";

import Silk from './components/ui/Silk';
import './App.css'



import './index.css'
import MovieCard from "./components/MovieCard";

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
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '') => {

    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

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

      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch(error) {
      console.log(`Failed to fetch the movies: ${error}`);
      setErrorMessage("I don't know where the movies are, come back later !");
    } finally {
      setIsLoading(false);
    }

  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch(error) {
      console.log(`Failed to fetch the trending movies: ${error}`);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <div className="app-root">
      <div className="main-content">
        <main>
          <div className="wrapper">
            <header className="hero-header">
              <div className="silk-bg-container">
                <Silk />
              </div>
              <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without Hassle</h1>
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            </header>

            {trendingMovies.length > 0 && (
              <section className="trending">
                <h2>Trending Movies</h2>

                <ul>
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.$id}>
                      <p>{index+1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))}
                </ul>
              </section>)}
            
            <section className="all-movies">
              <h2 className="mt-[40px]">All Movies</h2>
              {isLoading ? (
                <LoaderOne />
              ) : errorMessage ? (
                <p className="text-red-500">Failed to fetch the movies</p>
              ) : (
                <ul>
                  {movieList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie}/>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;