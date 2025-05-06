/**
 * @name SearchBar function
 * @summary Renders a search bar for the Search function in the Movies page
 * @param movieName the current movie name being input into the search bar, passed down from All_Movies.jsx
 * @param setMovieName function to set the input movie name, passed down from All_Movies.jsx
 * @param showAllMovies boolean value to indicate whether the 'Show all movies' checkbox is checked or not
 * @returns HTML element of a search bar
 */
export default function SearchBar({props, movieName, setMovieName, showAllMovies}) {

    return (
      <div>
        <input
          aria-labelledby = "search-button"
          type = "search"
          name = "movie-name"
          id = "movie-name"
          placeholder = "Enter movie name"
          disabled = {showAllMovies}
          value = {showAllMovies === true ? '' : movieName}
          onChange = {(event) => setMovieName(event.target.value)}
        />
      </div>
    );
}