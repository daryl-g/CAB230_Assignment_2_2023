import Navigation from "./Nav";
import Picture3 from "./Picture3.png";

/**
 * @name Header function
 * 
 * @param isLoggedIn boolean value to check whether the user is logged in or not
 * @param activePage string value to check which page is currently active
 * 
 * Both of the variables above are passed down from App.js,
 * then it is continued to be passed down to Navigation.
 */
export default function Header({isLoggedIn, activePage}) {

  return (
    <header>
      <div id="icon">
        <a href = "/">
            <img
              width="90"
              alt="Movie icon"
              src={Picture3}
            />
          </a>
      </div>

      <div className = "login-and-nav">

        {/* If isLoggedIn is set to true, a welcome message that includes the user's email is displayed*/}
        {
          isLoggedIn == true ? <p className = "user-email"><b>Welcome {localStorage.getItem("userEmail")}!</b></p> : null
        }

        <Navigation isLoggedIn={isLoggedIn} activePage={activePage}/>
      </div>
    </header>
  );
}
