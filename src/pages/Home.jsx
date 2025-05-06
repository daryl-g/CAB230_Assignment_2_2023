import React, { useEffect } from "react"; // useEffect to change the page's title
import "../Styles.css";

/**
 * @name Home function
 * @summary Renders the Home page when it is called
 * @param setActivePage string value to indicate which page is currently active, passed down from App.js
 * @returns HTML elements of the Home page
 */
export default function Home({setActivePage}) {
  
  // Set the page's title and active page to Home
  useEffect(() => {
    document.title = "Movie Searcher | Home";
    setActivePage("Home");
  }, []);

  return (
    <main>
      <Hero />
      <Features />
    </main>
  );
}

const Hero = () => (
  <section className="hero">
    {/* Content for the hero */}
    <div className="hero__content">
      <h1 className="hero__title">Welcome to Movie Searcher!</h1>
      <p className="hero__subtitle">
        Every movie from 1990 to the current date, we have them all!
      </p>
    </div>
  </section>
);

// Features section
function Features() {
  const featuresData = [
    {
      heading: "All Movies",
      text:
        "Search for every movie from 1990 to the current date from our extensive database!",
      img: {
        src:
          "https://icons-for-free.com/iconfiles/png/128/movie+video+icon-1320087274946223173.png",
        alt: "Movie icon"
      }
    },
    {
      heading: "Individual Movie",
      text:
        "View the details of each movie, including the people who took part in the production, and the movie's ratings!",
      img: {
        src: "https://www.shareicon.net/data/512x512/2015/10/07/114036_media_512x512.png",
        alt: "IMDB icon"
      }
    },
    {
      heading: "Actors/Actresses",
      text:
        "Find all movies that a specific actor/actresses has took part in and view their IMDb ratings over time!",
      img: {
        src: "https://cdn-icons-png.flaticon.com/128/475/475283.png",
        alt: "Actor icon"
      }
    }
  ];

  return (
    <article className="features">
      <div className="features__header">
        <h2>Web App Features</h2>
      </div>

      <div className="features__box-wrapper">
        {
          // Display the information for each of our features in their own Box
          featuresData.map((feature) => (
            <FeatureBox feature={feature} />
          ))
        }
      </div>
    </article>
  );
}

// Display a Feature box when passed in the information for the feature
const FeatureBox = ({ feature }) => (
  <div className="features__box">
    <img
      src={feature.img.src}
      alt={feature.img.alt}
      style={{ width: 126, height: 126 }}
    />
    <h5>{feature.heading}</h5>
    <p>{feature.text}</p>
  </div>
);
