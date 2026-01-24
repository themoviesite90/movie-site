const API_KEY = "b9864cdbbdcef170f412314e777c14f5";

// Read URL parameters
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type") || "movie";

// Elements
const titleEl = document.getElementById("movieTitle");
const overviewEl = document.getElementById("movieOverview");
const ratingEl = document.getElementById("movieRating");
const genresEl = document.getElementById("movieGenres");
const watchBtn = document.getElementById("watchBtn");
const playerDiv = document.getElementById("player");
const backdrop = document.getElementById("backdrop");

if (!id) {
  titleEl.innerText = "No movie selected!";
  throw new Error("No ID in URL");
}

// Load movie details
fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`)
  .then(res => res.json())
  .then(movie => {
    titleEl.innerText = movie.title || movie.name;
    overviewEl.innerText = movie.overview || "No description available.";
    ratingEl.innerText = movie.vote_average || "N/A";
    genresEl.innerText = movie.genres?.map(g => g.name).join(", ") || "N/A";

    if (movie.backdrop_path) {
      backdrop.style.backgroundImage =
        `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
    }

    // Fetch trailer
    return fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`);
  })
  .then(res => res.json())
  .then(videoData => {
    const trailer = videoData.results.find(v => v.site === "YouTube");

    if (!trailer) {
      watchBtn.innerText = "Trailer not available";
      watchBtn.disabled = true;
      return;
    }

    watchBtn.onclick = () => {
      playerDiv.innerHTML = `
        <iframe 
          src="https://www.youtube.com/embed/${trailer.key}?autoplay=1"
          allowfullscreen>
        </iframe>
      `;
    };
  })
  .catch(err => {
    console.error("Error loading movie:", err);
    titleEl.innerText = "Failed to load movie.";
  });