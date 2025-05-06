import React, { useState, useEffect, useCallback, useRef } from "react"; // Hooks to retrieve the grid's reference, store states, and fetch data
import { AgGridReact } from "ag-grid-react"; // Table component
import { useNavigate, useSearchParams } from "react-router-dom"; // Routing and tag searching hooks
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"; // Chart component
import { Chart } from "react-chartjs-2"; // React's version of Chartjs

// Styling for the table component
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

const API_URL = "";

// Data template
const samplePerson = {
  name: "",
  birthYear: 0,
  deathYear: null,
  roles: [
    {
      movieName: "",
      movieId: "",
      category: "",
      characters: [""],
      imdbRating: 0,
    },
  ],
};

/* Chart elements and functions */
/* 
  Author: react-chartjs-2/Dan Onoshko
  Date: n/d
  Source: https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/bar/vertical
*/
ChartJS.register(
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const rgb_colors = [
  "rgb(237, 28, 36)",
  "rgb(255, 174, 201)",
  "rgb(255, 127, 39)",
  "rgb(255, 201, 14)",
  "rgb(255, 242, 0)",
  "rgb(239, 228, 176)",
  "rgb(34, 177, 76)",
  "rgb(181, 230, 29)",
  "rgb(0, 162, 232)",
  "rgb(153, 217, 234)",
  "rgb(63, 72, 204)",
  "rgb(112, 146, 190)",
  "rgb(163, 73, 164)",
  "rgb(200, 191, 231)",
  "rgb(136, 0, 21)",
  "rgb(185, 122, 87)",
];

/**
 * Function to capitalise the first letter of the string
 */
/*
 * Author: Bamdad Fard
 * Date: July 14th, 2020
 * Source: https://blog.ag-grid.com/formatting-numbers-strings-currency-in-ag-grid/
 */
function stringFormatter(params) {
  var string = params.value;
  var firstChar = string.slice(0, 1).toUpperCase();
  return firstChar + string.slice(1);
}

/**
 * @name Individual function
 * @summary Renders the Individual page when it is called
 * @param setActivePage string value to indicate which page is currently active
 * @returns HTML element of the Individual page
 */
export default function Individual({ setActivePage }) {
  // Row navigation
  const navigate = useNavigate();
  // Retrieve grid reference
  const gridRef = useRef();
  // Retrieve imdbId of the queried person
  const [searchParams] = useSearchParams();
  const imdbId = searchParams.get("id");
  // Set sample data
  const [individualData, setIndividualData] = useState(samplePerson);
  // Retrieve user's bearer token from the local storage
  const bearerToken = localStorage.getItem("bearerToken");
  // Error message
  const [errorMessage, setErrorMessage] = useState(null);

  /** Function to catch error from the client-side response */
  const catchError = (error) => {
    setErrorMessage(error.message);
  };

  // Fetch data from the server
  useEffect(() => {
    try {
      const individuals_fetch = async () => {
        const data = await (
          await fetch(`${API_URL}/people/${imdbId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${bearerToken}`,
            },
          })
        ).json();

        // Error handling
        if (data.error === true) {
          if (data.message === "JWT token has expired")
            getBearerToken(localStorage.getItem("refreshToken"));
          else if (data.message === "No record exists of a person with this ID")
            navigate("/error404");
          else if (
            data.message ===
              "Authorization header ('Bearer token') not found" ||
            data.message === "Invalid JWT token"
          )
            navigate("/unauthorised");
        } else setIndividualData(data);
      };
      individuals_fetch();
    } catch (error) {
      catchError(error);
    }
  }, []);

  /**
   * @name getBearerToken function
   * @summary Retrieve a new bearer token from the server using the existing refresh token
   * @param token The token being used to get the new bearer token
   * @returns The result of a fetch promise
   */
  function getBearerToken(token) {
    const url = `${API_URL}/user/refresh`;

    try {
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: token }),
      }).then((response) =>
        response.json().then((response) => {
          if (response.error === true) {
            if (
              response.message ===
                "Invalid query parameters: year. Query parameters are not permitted." ||
              response.message === "No record exists of a person with this ID"
            ) {
              setErrorMessage(response.message + "!");
            } else navigate("/unauthorised");
          } else {
            localStorage.removeItem("bearerToken");
            localStorage.removeItem("refreshToken");

            localStorage.setItem("bearerToken", response.bearerToken.token);
            localStorage.setItem("refreshToken", response.refreshToken.token);
          }
        })
      );
    } catch (error) {
      catchError(error);
    }
  }

  // Set the page's title and active page as Movies
  useEffect(() => {
    document.title = "Movie Searcher | " + individualData.name;
    setActivePage("Movies");
  }, [individualData]);

  /** Function to autosize columns according to the grid's width by default */
  const sizeToFit = useCallback(() => {
    gridRef.current.api.sizeColumnsToFit();
  }, []);

  // Configs for the chart
  const options = {
    maintainAspectRatio: true,
    scales: {
      x: {
        ticks: {
          color: "#95deff",
          font: {
            family: "Verdana",
            size: 11,
            weight: "bold",
          },
        },
      },
      y: {
        ticks: {
          color: "#95deff",
          font: {
            family: "Verdana",
            size: 14,
            weight: "bold",
          },
        },
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#95deff",
          font: {
            family: "Verdana",
            weight: "bold",
          },
        },
      },
      title: {
        display: true,
        text: "IMDb Ratings History of " + individualData.name,
        color: "#95deff",
        font: {
          family: "Verdana",
          size: 20,
          weight: "bold",
        },
      },
    },
  };

  const data = {
    labels: individualData.roles.map((role) => role.movieName),
    datasets: [
      {
        type: "line",
        label: "IMDb Ratings",
        data: individualData.roles.map((role) => role.imdbRating),
        fill: false,
        borderColor: "#fa1593",
        pointBorderColor: rgb_colors,
        borderWidth: 2,
        datalabels: {
          align: "end",
          anchor: "end",
          color: "#95deff",
          font: {
            family: "Verdana",
            size: 10,
          },
        },
      },
    ],
  };

  // Column definitions and options
  const columnNames = [
    {
      headerName: "Role",
      field: "category",
      valueFormatter: stringFormatter,
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        valueFormatter: stringFormatter,
      },
    },
    {
      headerName: "Movie",
      field: "movieName",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Characters",
      field: "characters",
      filter: "agTextColumnFilter",
    },
    {
      headerName: "IMDb",
      field: "imdbRating",
      sortable: true,
      filter: "agNumberColumnFilter",
    },
  ];

  if (errorMessage === null) {
    return (
      <div className="person-wrapper">
        <div className="person-info">
          <h2>
            <b>{individualData.name}</b>
          </h2>
          <h3>
            <b>
              {individualData.birthYear}-{individualData.deathYear}
            </b>
          </h3>
        </div>

        <div className="roles-and-ratings-wrapper">
          <div className="roles-table">
            <div
              className="ag-theme-balham"
              style={{ height: "500px", width: "100%" }}
            >
              <AgGridReact
                ref={gridRef}
                columnDefs={columnNames}
                rowData={individualData.roles}
                pagination={true}
                paginationPageSize={50}
                onRowClicked={(row) =>
                  navigate(`/movie?imdbID=${row.data.movieId}`)
                }
                onGridSizeChanged={sizeToFit}
              />
            </div>
          </div>

          <div className="ratings-graph">
            <Chart type="line" options={options} data={data} />
          </div>
        </div>
      </div>
    );
  } else {
    return <h2>{errorMessage}. Please try again.</h2>;
  }
}
