const API_KEY = "b9864cdbbdcef170f412314e777c14f5";

// Get URL params
const params = new URLSearchParams(location.search);
const id = params.get("id");
const type = params.get("type") || "movie";

// Elements
const titleEl = document.getElementById("movieTitle");
const overviewEl = document.getElementById("movieOverview");
const ratingEl = document.getElementById("movieRating");
const genresEl = document.getElementById("movieGenres");
const watchBtn = document.getElementById("watchBtn");
const playerDiv = document.getElementById("player");

// Load movie details
fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`)
  .then(res => res.json())
  .then(movie => {
    titleEl.innerText = movie.title || movie.name;
    overviewEl.innerText = movie.overview || "No description.";
    ratingEl.innerText = movie.vote_average || "N/A";
    genresEl.innerText = movie.genres?.map(g => g.name).join(", ") || "N/A";

    // Load YouTube trailer
    return fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`);
  })
  .then(res => res.json())
  .then(videoData => {
    const trailer = videoData.results.find(v => v.site === "YouTube");
    if (trailer) {
      watchBtn.onclick = () => {
        playerDiv.innerHTML = `
          <iframe width="100%" height="400" 
            src="https://www.youtube.com/embed/${trailer.key}" 
            frameborder="0" allowfullscreen>
          </iframe>
        `;
      };
    } else {
      watchBtn.innerText = "Trailer not available";
    }
  })
  .catch(err => {
    console.error("Movie load error:", err);
  });