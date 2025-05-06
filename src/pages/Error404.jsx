import React, { useEffect } from "react"; // useEffect hook to rename the page's title
import { useNavigate } from "react-router-dom"; // Routing hook
import { Button } from "reactstrap"; // Button component

/**
 * @name Error404 function
 * @summary Renders the 404 page when it is called
 * @returns HTML elements of the 404 page
 */
export default function Error404() {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "Movie Searcher | Error 404";
    }, []);
    return (
        <div className = "page-not-found">
            <img
                className = "error-gif"
                src = "https://media.tenor.com/_BiwWBWhYucAAAAd/what-huh.gif"
                alt = "john-travolta-confused-gif"
            ></img>
            <h2>Uh oh! Are you lost?</h2>
            <p className = "back-home">Let's go back <Button color="primary" size="sm" onClick={() => navigate("/")}>home</Button>!</p>
        </div>
    );
}