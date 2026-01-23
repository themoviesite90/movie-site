import { auth } from "./auth.js";

const API_KEY = "b9864cdbbdcef170f412314e777c14f5";
const IMG = "https://image.tmdb.org/t/p/w500";

// Get movie id and type from URL
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");
const type = params.get("type") || "movie";

const titleEl = document.getElementById("movieTitle");
const overviewEl = document.getElementById("movieOverview");
const iframe = document.getElementById("videoIframe");

// Fetch movie details
fetch(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=${API_KEY}&language=en-US`)
  .then(res => res.json())
  .then(data => {
    titleEl.innerText = data.title || data.name;
    overviewEl.innerText = data.overview;

    // Fetch trailer
    fetch(`https://api.themoviedb.org/3/${type}/${movieId}/videos?api_key=${API_KEY}&language=en-US`)
      .then(res => res.json())
      .then(videoData => {
        const trailer = videoData.results.find(v => v.type === "Trailer" && v.site === "YouTube");

        if (trailer) {
          iframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
        } else {
          iframe.remove();
          const fallback = document.createElement("p");
          fallback.innerText = "Trailer not available for this movie.";
          overviewEl.after(fallback);
        }
      });
  })
  .catch(err => console.log("Watch page error:", err));

// Optional: auth check
auth.onAuthStateChanged(user => {
  if (!user) return;
  // Could save watch history here
});