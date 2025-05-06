import React from "react";
import { AgGridReact } from "ag-grid-react"; // Table component
import { useState, useEffect, useMemo } from "react"; // Various hooks to store states, fetch data, and...
import { useNavigate } from "react-router-dom"; // Routing hook
import { Button } from "reactstrap"; // Button component for the Search button
import SearchBar from "../components/Search_Function"; // SearchBar component, from Search_Function.jsx
import Slider from "@mui/material/Slider"; // Slider component for the Year query
import FormControlLabel from "@mui/material/FormControlLabel"; // FormControlLabel for the CheckBox
import Checkbox from "@mui/material/Checkbox"; // Checkbox component

import "../Styles.css";

// Styling for the table component
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

// How many pages are loaded when the table component is rendered
const paginationPageSize = 14;
const marks = [
  {
    value: 1990,
    label: "1990",
  },
  {
    value: 2023,
    label: "2023",
  },
];

/**
 * @name Movies function
 * @summary Renders the Movies page of the application
 * @param setActivePage string value to indicate which page is currently active, passed down from App.js
 * @returns HTML element of the Movies page
 */
export default function Movies({ setActivePage }) {
  // Set grid API
  const [gridApi, setGridApi] = useState(null);
  // Set default value for movie name form
  const [movieName, setMovieName] = useState("");
  // Set value for queried year
  const [yearQueried, setYearQueried] = useState(undefined);
  // Set show all movies
  const [showAllMovies, setShowAllMovies] = useState(true);
  // Row navigation
  const navigate = useNavigate();

  // Columns for the table
  const columns = useMemo(() => {
    return [
      {
        headerName: "Title",
        field: "title",
      },
      {
        headerName: "Year",
        field: "year",
      },
      {
        headerName: "IMDb",
        field: "imdbRating",
      },
      {
        headerName: "Rotten Tomatoes",
        field: "rottenTomatoesRating",
      },
      {
        headerName: "Metacritic",
        field: "metacriticRating",
      },
      {
        headerName: "Classification",
        field: "classification",
      },
    ];
  });

  /*
   * Name: Create data source for the infinite scrolling
   * Author: Chad Gay
   * Source: https://codesandbox.io/s/smoosh-hill-6rqmxy
   */
  const createDataSource = async () => {
    const dataSource = {
      // params = grid object
      getRows: (params) => {
        let pageNumber = params.endRow / paginationPageSize;
        let url = `/movies/search?page=${pageNumber}`;

        // If the 'Show all movies' checkbox is unticked
        if (showAllMovies == false) {
          // Check to see if the movieName is an empty string or not.
          // If not, add the search tag to the tail of the url.
          if (movieName) {
            url += `&title=${movieName}`;
          }

          // Check to see if the yearQueried is equal to undefined or not.
          // If not, add the search tag to the tail of the url.
          if (yearQueried) {
            url += `&year=${yearQueried}`;
          }
        }

        try {
          const movieDB_fetch = async () => {
            const data = await fetch(url).then((res) => res.json());
            params.successCallback(data.data, data.pagination.total);
          };
          movieDB_fetch();
        } catch (error) {
          throw error;
        }
      },
    };

    return dataSource;
  };

  /*
   * Name: onGridReady for the infinite scrolling
   * Author: Chad Gay
   * Source: https://codesandbox.io/s/smoosh-hill-6rqmxy
   */
  const onGridReady = async (params) => {
    setGridApi(params.api);
    const dataSource = await createDataSource();
    params.api.setDatasource(dataSource);
  };

  /*
   * Name: Default column definitions for the table component
   * Author: Chad Gay
   * Source: https://codesandbox.io/s/smoosh-hill-6rqmxy
   */
  const defaultColDef = useMemo(() => {
    return {
      editable: false,
      enableRowGroup: false,
      enablePivot: false,
      enableValue: true,
      sortable: false,
      resizable: true,
      filter: false,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  // Set page's tab title and set the active page to Movies
  useEffect(() => {
    document.title = "Movie Searcher | All Movies";
    setActivePage("Movies");
  }, []);

  // Grid options for the table component
  const gridOptions = {
    columnDefs: columns,
    defaultColDef: defaultColDef,
    rowModelType: "infinite", // Infinite scrolling grid type
    pagination: true, // Separate the returned data out to multiple pages or not?
    paginationPageSize: paginationPageSize,
    onRowClicked: (row) => navigate(`/movie?imdbID=${row.data.imdbID}`),
    onGridReady: onGridReady, // Rebuild the data source whenever the grid changes
    onFirstDataRendered: (params) => params.api.sizeColumnsToFit(), // Auto resize the column widths
    cacheBlockSize: paginationPageSize,
    suppressBrowserResizeObserver: false,
  };

  // Similar to onGridReady, rebuilding dataSource whenever it is called
  // Mainly used for the Search button
  const handleSubmit = async () => {
    const dataSource = await createDataSource();
    gridApi.setDatasource(dataSource);
  };

  return (
    <div className="movie-content-wrapper">
      <h1>Movies Collection</h1>

      <div className="movie-searching">
        <div className="search-filters">
          <form
            className="movie-searchbar"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <p>Movie name</p>
            <SearchBar
              movieName={movieName}
              setMovieName={setMovieName}
              showAllMovies={showAllMovies}
            />
            <Button
              id="search-button"
              type="submit"
              color="info"
              onClick={handleSubmit}
            >
              Search
            </Button>
          </form>

          <p className="year-title">Year</p>

          <div className="slider">
            <Slider
              className="year-slider"
              min={1990}
              max={2023}
              defaultValue={2022}
              aria-label="Years"
              valueLabelDisplay="auto"
              disabled={showAllMovies}
              onChange={(event) => {
                setYearQueried(event.target.value);
              }}
              marks={marks}
              sx={{
                maxWidth: "85%",
                height: 5,
                color: "#79e0b4",
                "& .MuiSlider-markLabel": {
                  color: "#79e0b4",
                },
              }}
            />
          </div>

          <div className="checkbox">
            <FormControlLabel
              control={
                <Checkbox
                  checked={showAllMovies}
                  onChange={(event) => {
                    setShowAllMovies(event.target.checked);
                  }}
                  sx={{
                    color: "#79e0b4",
                    "&.Mui-checked": {
                      color: "#fa1593",
                    },
                  }}
                />
              }
              label="Show all movies"
              sx={{
                color: "#79e0b4",
              }}
            />
          </div>
        </div>

        <div className="movies-table">
          <div className="ag-theme-balham" style={{ height: "500px" }}>
            <AgGridReact gridOptions={gridOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
