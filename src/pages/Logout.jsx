import React, { useState, useEffect } from "react"; // Hooks to store states and fetch data
import { useNavigate } from "react-router-dom"; // Navigation hook
import { Button } from "reactstrap"; // Button component

const API_URL = "";

/**
 * @name Logout function
 * @summary Renders the Logout page when it is called
 * @param setLoggedIn boolean value to check whether the user is logged in or not
 * @param setActivePage string value to indicate which page is currently active
 * @returns HTML elements of the Logout page
 */
export default function Logout({ setLoggedIn, setActivePage }) {
  // Set up navigation hook
  const navigate = useNavigate();
  // Error message
  const [errorMessage, setErrorMessage] = useState(null);
  // Retrieve refresh token
  const token = localStorage.getItem("refreshToken");

  /** Function to catch error from the client-side response */
  const catchError = (error) => {
    setErrorMessage(error.message + "!");
  };

  // Function to call the server to invalidate the specified refresh token
  const logging_out = () => {
    const url = `${API_URL}/user/logout`;

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
              "Request body incomplete, refresh token required"
            ) {
              setErrorMessage("Log out failed. Please try again!");
            } else {
              navigate("/unauthorised");
            }
          } else {
            localStorage.clear();
            navigate("/");
            setLoggedIn(false);
          }
        })
      );
    } catch (error) {
      catchError(error);
    }
  };

  // Set the page's title and the active page to Movies
  useEffect(() => {
    document.title = "Movie Searcher | Logout";
    setActivePage("Logout");
  }, []);

  return (
    <div className="logging-out">
      <img
        className="logout-gif"
        src="https://i.gifer.com/origin/2e/2ee85d2036a6b407820a61f9a107e25c.gif"
        alt="abe-simpson-leaving-gif"
      ></img>
      <h3>Are you sure you want to log out?</h3>
      <h3>Click the button below to log out!</h3>
      <Button color="danger" onClick={logging_out}>
        Logout
      </Button>
      {errorMessage != null ? (
        <p>
          <br></br>
          <b>{errorMessage}</b>
        </p>
      ) : (
        <p></p>
      )}
    </div>
  );
}
