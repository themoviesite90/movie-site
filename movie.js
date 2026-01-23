const API_KEY = "b9864cdbbdcef170f412314e777c14f5";

// Read URL params
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type") || "movie";

if (!id) {
  document.body.innerHTML = "No movie ID found in URL!";
  throw new Error("No ID");
}

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
    overviewEl.innerText = movie.overview;
    ratingEl.innerText = movie.vote_average;

    genresEl.innerText = movie.genres.map(g => g.name).join(", ");

    loadTrailer(id);
  })
  .catch(err => {
    document.body.innerHTML = "Error loading movie data";
    console.error(err);
  });

// Load trailer
function loadTrailer(id) {
  fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const trailer = data.results.find(v => v.site === "YouTube");
      if (!trailer) {
        watchBtn.innerText = "No trailer found";
        return;
      }

      watchBtn.onclick = () => {
        playerDiv.innerHTML = `
          <iframe width="100%" height="400"
            src="https://www.youtube.com/embed/${trailer.key}"
            frameborder="0"
            allowfullscreen>
          </iframe>
        `;
      };
    });
}