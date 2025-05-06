import React, { useState, useEffect } from "react"; // Hooks to store states and fetch data
import { Button, Badge } from "reactstrap"; // Button and Badge components
import { Link, useNavigate, useSearchParams } from "react-router-dom"; // Routing hooks
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"; // Chart elements
import ChartDataLabels from "chartjs-plugin-datalabels"; // Data labels for the chart
import { Bar } from "react-chartjs-2"; // React version of Chartjs

import "../Styles.css";

// Template data
const sampleData = {
  title: "",
  year: 0,
  runtime: 0,
  genres: ["", "", ""],
  country: "",
  principals: [
    {
      id: "",
      category: "",
      name: "",
      characters: [""],
    },
  ],
  ratings: [
    {
      source: "",
      value: 0,
    },
    {
      source: "",
      value: 0,
    },
    {
      source: "",
      value: 0,
    },
  ],
  boxoffice: 0,
  poster: "",
  plot: "",
};

/** Function to generate randon numbers */
function RandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min));
}

/* Chart elements and functions */
/* 
  Author: react-chartjs-2/Dan Onoshko
  Date: n/d
  Source: https://codesandbox.io/s/github/reactchartjs/react-chartjs-2/tree/master/sandboxes/bar/vertical
*/
ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend);

export const options = {
  maintainAspectRatio: true,
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      ticks: {
        color: "#95deff",
        font: {
          family: "Verdana",
          size: 15,
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
      text: "Movie Ratings",
      color: "#95deff",
      font: {
        family: "Verdana",
        size: 25,
        weight: "bold",
      },
    },
  },
};

/**
 * @name IndividualMovie function
 * @summary Renders the Individual Movie page when it is called
 * @param setActivePage string value to indicate which page is currently active
 * @returns HTML element of the Individual Movie page
 */
export default function IndividualMovie({ setActivePage }) {
  // Row navigation
  const navigate = useNavigate();
  // Search params hook to find the specified tag in the link
  const [searchParams] = useSearchParams();
  const imdbId = searchParams.get("imdbID"); // imdbId for fetching from the API
  const BadgeColors = ["primary", "success", "danger", "warning", "info"];
  // Set the layout for the movie data to be populated
  const [movieData, setMovieData] = useState(sampleData);

  useEffect(() => {
    try {
      const individualMovie_fetch = async () => {
        const data = await (await fetch(`/movies/data/${imdbId}`)).json();
        setMovieData(data);
      };
      individualMovie_fetch();
    } catch (error) {
      throw error;
    }
  }, []);

  // Set the page's title and the active page as Movies
  useEffect(() => {
    document.title = "Movie Searcher | " + movieData.title;
    setActivePage("Movies");
  }, [movieData]);

  // Configs for the chart
  const labels = ["IMDb", "Rotten Tomatoes", "Metacritic"];
  const dataLabels = [
    movieData.ratings[0].value,
    movieData.ratings[1].value,
    movieData.ratings[2].value,
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Movie Ratings",
        data: movieData.ratings.map((rating) => {
          if (rating.source === "Internet Movie Database")
            return rating.value * 10;
          else return rating.value;
        }),
        backgroundColor: [
          "rgba(254, 222, 30, 0.2)",
          "rgba(224, 75, 139, 0.2)",
          "rgba(99, 249, 253, 0.2)",
        ],
        borderColor: [
          "rgb(254, 222, 30)",
          "rgb(222, 62, 146)",
          "rgb(99, 249, 253)",
        ],
        borderWidth: 2,
        datalabels: {
          align: "end",
          anchor: "end",
          color: "#95deff",
          font: {
            family: "Verdana",
            size: 20,
            weight: "bold",
          },
          formatter: function (value, context) {
            return dataLabels[context.dataIndex];
          },
        },
      },
    ],
  };

  // HTML section
  return (
    <div className="individual-movie">
      <img src={movieData.poster} alt="Movie poster" />
      <h1>
        <b>{movieData.title}</b>
      </h1>

      <div className="movie-info">
        <p>Release year: {movieData.year}</p>
        <p>Total runtime: {movieData.runtime} minutes</p>

        <div className="movie-genres">
          <p>
            Genres:&#xa0;
            {movieData.genres.map((genre) => {
              return (
                <Badge
                  color={BadgeColors[RandomNumber(0, BadgeColors.length)]}
                  pill
                >
                  {genre}
                </Badge>
              );
            })}
          </p>
        </div>

        <p>Produced in: {movieData.country}</p>
        <p>Box office revenue: ${movieData.boxoffice.toLocaleString()}</p>
      </div>

      <div className="movie-plot">
        <p>
          <b>
            <i>{movieData.plot}</i>
          </b>
        </p>
      </div>

      <div className="crew-and-ratings-wrapper">
        <div className="movie-crew">
          <h3>
            <b>Meet The Crew!</b>
          </h3>

          {/*
          -First element (category) is split into separate letters,
          then the first letter is taken, capitalised, and joined back with the rest of the letters
          -For every second element (name), a link is to that person's page is linked to 
          the name
          -Third element (character) has an if condition to check whether a specific member
          is an actor or an actress or not; if yes, their characters in the movie are listed;
          if no, it is ignored
        */}
          <p>
            {movieData.principals.map((member) => {
              return (
                <p>
                  <b>
                    {member.category
                      .split()
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )}
                  </b>
                  &nbsp;
                  <Link
                    to={`/individuals?id=${member.id}`}
                    style={{ color: "#ffffff" }}
                  >
                    {member.name}
                  </Link>
                  &nbsp;
                  {(member.category === "actor") |
                  (member.category === "actress")
                    ? "as " + member.characters.map((character) => character)
                    : ""}
                </p>
              );
            })}
          </p>
        </div>

        <div className="bar-chart">
          <Bar options={options} data={data} plugins={[ChartDataLabels]} />
        </div>
      </div>

      <div className="back-button">
        <Button color="info" outline onClick={() => navigate("/all_movies")}>
          &#x2190; Return to previous page
        </Button>
      </div>
    </div>
  );
}
