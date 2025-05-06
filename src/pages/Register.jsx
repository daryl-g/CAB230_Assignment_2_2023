import React, { useState, useEffect } from "react"; // Hooks to store states and fetch data
import { Link, useNavigate } from "react-router-dom"; // Navigation hooks
import { Button } from "reactstrap"; // Button component

const API_URL = ``;

/**
 * @name Register function
 * @summary Renders the Register page when it is called
 * @param setActivePage string value to indicate which page is currently active
 * @returns HTML elements of the Register page
 */
export default function Register({ setActivePage }) {
  // Set the default email
  const [userEmail, setEmail] = useState("");
  // Set the default password
  const [userPassword, setPassword] = useState("");
  // Set the error message
  const [errorMessage, setMessage] = useState(null);
  // Set up the navigation hook
  const navigate = useNavigate();

  // Error handling the errors from the server-side response
  const catchError = (error) => {
    setMessage(error.message);
  };

  // Set the page's title and the active page as Login
  useEffect(() => {
    document.title = "Movie Searcher | Register";
    setActivePage("Login");
  }, []);

  /**
   * @name Register function
   * @summary Send a fetch function with the user's information to register with the server
   * @returns A fetch promise
   */
  function register() {
    const url = `${API_URL}/user/register`;

    try {
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail, password: userPassword }),
      }).then((response) =>
        response.json().then((response) => {
          if (response.error === true) setMessage(response.message + "!");
          else navigate("/login");
        })
      );
    } catch (error) {
      catchError(error);
    }
  }

  // Using Regex to check whether an email is valid or not
  return (
    <div className="lgrg-box-wrapper">
      {/* Page title */}
      <h2>
        <b>Register</b>
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
              setMessage("Email is not in the correct format!");
            } else {
              setMessage(null);
            }
            setEmail(event.target.value);
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
              setMessage(
                "Password must contain at least one uppercase letter, at least one digit, and at least one special character!"
              );
            } else {
              setMessage(null);
            }
            setPassword(event.target.value);
          }}
        />
      </form>
      {errorMessage != null ? (
        <p>
          <br></br>
          <b>{errorMessage}</b>
        </p>
      ) : (
        <Button color="info" className="lgrg-button" onClick={register}>
          Register
        </Button>
      )}

      <p className="lgrg-message">
        Already have an account?{" "}
        <Link to="/login" className="lgrg-link">
          Login
        </Link>{" "}
        here!
      </p>
    </div>
  );
}
