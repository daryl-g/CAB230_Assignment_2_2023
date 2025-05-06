import { Link } from "react-router-dom";

/**
 * @name Navigation function
 * @summary Renders the navigation bar when it is called
 * @param isLoggedIn boolean value to check whether the user is logged in or not
 * @param activePage string value to check which page is currently active
 * @returns HTML element of the navigation bar
 */
export default function Navigation({isLoggedIn, activePage}) {
  return (
    <nav>
      <ul>
        <li>
          <Link
            to="/"
            style={
              activePage === "Home"
                ? { color: '#95e3ff' }
                : { color: '#fa1593' }
            }
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/all_movies"
            style={
              activePage === "Movies"
                ? { color: '#95e3ff' }
                : { color: '#fa1593' }
            }
          >
            Movies
          </Link>
        {/*If isLoggedIn is true, display the Logout button. If false, display the Login button.*/}
        </li>
        {
          isLoggedIn != true ? <li><Link to="/login" style={activePage === "Login" ? {color: '#95e3ff'} : {color: '#fa1593'}}>Login</Link></li> : <li><Link to="/logout" style={activePage === "Logout" ? {color: '#95e3ff'} : {color: '#fa1593'}}>Logout</Link></li>
        }
      </ul>
    </nav>
  );
}
