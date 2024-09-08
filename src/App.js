import { useState, useEffect } from 'react';
import StarRating from './StarRating';

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = '324339c';

export default function App() {
  const [query, setQuery] = useState('Matrix');
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(() => {
    const watchedList = localStorage.getItem('watched');
    return JSON.parse(watchedList);
  });
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  };

  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  const handleAddWatchedMovie = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };

  const handleRemoveWatchedMovie = (id) => {
    setWatched((watched) =>
      watched.filter((movie) => movie.imdbID !== id),
    );
  };

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMovies = async () => {
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
    };

    handleCloseMovie();
    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <SearchResult movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {!selectedId && (
            <>
              <Summary watched={watched} />
              <WatchedMovies
                watched={watched}
                onRemoveWacthedMovie={handleRemoveWatchedMovie}
                onSelectMovie={handleSelectMovie}
              />
            </>
          )}

          {isLoadingDetails && <Loader />}
          {selectedId && (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onLoadingDetails={setIsLoadingDetails}
              onAddWatchedMovie={handleAddWatchedMovie}
              onRemoveWacthedMovie={handleRemoveWatchedMovie}
              watched={watched}
            />
          )}
        </Box>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function SearchResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function MovieDetails({
  selectedId,
  onCloseMovie,
  onLoadingDetails,
  onAddWatchedMovie,
  onRemoveWacthedMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState('');

  const isWatched = watched
    .map((movie) => movie.imdbID)
    .includes(selectedId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId,
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
    };

    onAddWatchedMovie(newWatchedMovie);
    onCloseMovie();
  };

  useEffect(() => {
    const fetchMovie = async () => {
      onLoadingDetails(true);

      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
      );

      const data = await res.json();

      setMovie(data);
      onLoadingDetails(false);
    };
    fetchMovie();
  }, [selectedId, onLoadingDetails]);

  useEffect(() => {
    if (!title) return;

    document.title = `| ${title}`;

    return () => {
      document.title = 'React App';
    };
  }, [title]);

  useEffect(() => {
    const callback = (e) => {
      if (e.code === 'Escape') {
        onCloseMovie();
      }
    };

    document.addEventListener('keydown', callback);

    return document.addEventListener('keydown', callback);
  }, [onCloseMovie]);

  return (
    <div className="details">
      <>
        <header>
          <button className="btn-back" onClick={() => onCloseMovie()}>
            &larr;
          </button>
          <img src={poster} alt={`Poster of ${movie} movie`} />
          <div className="details-overview">
            <h2>{title}</h2>
            <p>
              {released} &bull; {runtime}
            </p>
            <p>{genre}</p>
            <p>
              <span>⭐️</span>
              {imdbRating} IMDb rating
            </p>
          </div>
        </header>
        <section>
          <div className="rating">
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </div>

          <div>
            {isWatched ? (
              <div className="rating">
                <p>
                  You rated with movie {watchedUserRating} <span>⭐️</span>
                </p>
                <button
                  className="btn-add"
                  onClick={() => onRemoveWacthedMovie(movie.imdbID)}
                >
                  Remove movie from wacthed list
                </button>
              </div>
            ) : (
              <div className="rating">
                <StarRating maxRating={10} onSetRating={setUserRating} />
                {userRating > 0 && (
                  <button className="btn-add" onClick={() => handleAdd()}>
                    Add to watched list
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </>
    </div>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed()} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovies({ watched, onRemoveWacthedMovie, onSelectMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
          <img src={movie.poster} alt={`${movie.title} poster`} />
          <h3>{movie.title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
          </div>
          <button
            className="btn-delete"
            onClick={() => onRemoveWacthedMovie(movie.imdbID)}
          >
            X
          </button>
        </li>
      ))}
    </ul>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔️</span> {message}
    </p>
  );
}

function Loader() {
  return (
    <div>
      <div className="skeleton-body"></div>
    </div>
  );
}
