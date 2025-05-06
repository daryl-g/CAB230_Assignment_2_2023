import React from "react";
import { useState, useEffect } from "react"; // Hooks to store states and fetch data
import { Link, useNavigate } from "react-router-dom"; // Routing hooks
import { Button } from "reactstrap"; // Button component

const API_URL = ``;

/**
 * @name Login function
 * @summary Renders the Login page when it is called
 * @param setLoggedIn boolean value to see if the user is logged in or not
 * @param setActivePage string value to indicate which page is active
 * @returns HTML element of the Login page
 */
export default function Login({ setLoggedIn, setActivePage }) {
  // Set the default email
  const [userEmail, setDefaultEmail] = useState("");
  // Set the default password
  const [userPassword, setDefaultPassword] = useState("");
  // Set the error message
  const [errorMessage, setErrorMessage] = useState(null);
  // Set up navigation hook
  const navigate = useNavigate();

  // Function to catch error from the server-side response
  const catchError = (error) => {
    setErrorMessage(error.message);
  };

  // Set the page's title and the active page to Movies
  useEffect(() => {
    document.title = "Movie Searcher | Login";
    setActivePage("Login");
  }, []);

  /**
   * @name Login function
   * @summary Send a fetch function to the /user/login endpoint to retrieve tokens
   * @returns A fetch promise
   */
  function login() {
    const url = `${API_URL}/user/login`;

    try {
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail, password: userPassword }),
      }).then((response) =>
        response.json().then((response) => {
          if (response.error === true) {
            if (
              response.message ===
              "Request body incomplete, both email and password are required"
            ) {
              setErrorMessage("Missing email and/or password!");
            } else setErrorMessage(response.message + "!");
          } else {
            localStorage.setItem("userEmail", userEmail);
            localStorage.setItem("bearerToken", response.bearerToken.token);
            localStorage.setItem("refreshToken", response.refreshToken.token);
            setLoggedIn(true);
            navigate("/");
          }
        })
      );
    } catch (error) {
      catchError(error);
    }
  }

  // Using Regex to check whether the input email/password is valid or not
  return (
    <div className="lgrg-box-wrapper">
      {/* Page title */}
      <h2>
        <b>Login</b>
      </h2>

      <form
        className="email-form"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <img
          className="email-img"
          src="https://cdn-icons-png.flaticon.com/512/3178/3178283.png"
          alt="Email icon"
          style={{ width: "24px", height: "24px" }}
        />
        <input
          type="text"
          name="email"
          id="email"
          placeholder="Email"
          value={userEmail}
          onChange={(event) => {
            const { value } = event.target;
            if (!/@(?:.{1,}\.(com|co|org|edu|gov).{0,})/.test(value)) {
              setErrorMessage("Email is not in the correct format!");
            } else {
              setErrorMessage(null);
            }
            setDefaultEmail(event.target.value);
          }}
        />
      </form>

      <form
        className="password-form"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <img
          className="password-img"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Circle-icons-locked.svg/2048px-Circle-icons-locked.svg.png"
          alt="Lock icon"
          style={{ width: "24px", height: "24px" }}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={userPassword}
          onChange={(event) => {
            const { value } = event.target;
            if (
              !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-={}|\[\]\\;':",.\/<>?]).{0,}$/.test(
                value
              )
            ) {
              setErrorMessage(
                "Password must contain at least one uppercase letter, at least one digit, and at least one special character!"
              );
            } else {
              setErrorMessage(null);
            }
            setDefaultPassword(event.target.value);
          }}
        />
      </form>
      {errorMessage != null ? (
        <p>
          <br></br>
          <b>{errorMessage}</b>
        </p>
      ) : (
        <Button color="info" className="lgrg-button" onClick={login}>
          Log in
        </Button>
      )}

      <p className="lgrg-message">
        Don't have an account?{" "}
        <Link to="/register" className="lgrg-link">
          Register
        </Link>{" "}
        here!
      </p>
    </div>
  );
}
