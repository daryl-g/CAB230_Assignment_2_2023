import React, { useEffect } from "react"; // useEffect is used to update the page's title
import { useNavigate } from "react-router-dom"; // Routing hook
import { Button } from "reactstrap"; // Button component

/**
 * @name Unauthorised function
 * @summary Renders the entirety of the Unauthorised function
 * @returns HTML element of the Unauthorised page
 */
export default function Unauthorised() {
    // Set up the navigation hook
    const navigate = useNavigate();

    // Set the page's title
    useEffect(() => {
        document.title = "Movie Searcher | Unauthorised";
    }, []);

    return (
        <div className = "unauthorised-user">
            <img
            className = "unauthorised-gif"
            src = "https://media.tenor.com/bHGUqVIKzhoAAAAC/let-me-in-eric-andre.gif"
            alt = "eric-andre-let-me-in-gif"
            ></img>
            <h3>D'oh! You are not authorised to view this page!</h3>
            <h3>Click the button below to log in to view this page!</h3>
            <Button
                color = "info"
                onClick = {() => navigate("/login")}
            >
                Log in
            </Button>
        </div>
    )
}