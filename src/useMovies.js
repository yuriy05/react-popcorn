import { useState, useEffect } from 'react';

const KEY = '324339c';

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          /*
        //*Fetching movies from API
        */
          setIsLoading(true);
          setError('');

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal },
          );

          const data = await res.json();
          console.log(data, 'DATA');

          if (!res.ok) throw new Error('Something went wrong...');

          if (data.Response === 'False')
            throw new Error('Movie was not found');

          setMovies(data.Search);

          setError('');
        } catch (err) {
          if (err.name !== 'AbortError') {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query],
  );

  return { movies, error, isLoading };
}
