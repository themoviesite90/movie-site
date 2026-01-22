const API_KEY = "b9864cdbbdcef170f412314e777c14f5";
const IMG = "https://image.tmdb.org/t/p/w500";

const id = new URLSearchParams(window.location.search).get("id");
const detailsDiv = document.getElementById("movieDetails");

fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
  .then(res => res.json())
  .then(movie => {
    showDetails(movie);
  });

function showDetails(movie) {
  detailsDiv.innerHTML = `
    <div class="details-poster">
      <img src="${IMG + movie.poster_path}">
    </div>

    <div class="details-info">
      <h1>${movie.title}</h1>
      <p class="rating">⭐ ${movie.vote_average}</p>
      <p class="overview">${movie.overview}</p>

      <div class="buttons">
        <button id="trailerBtn">▶ Watch Trailer</button>
        <button id="favBtn">❤️ Add to Favorites</button>
      </div>
    </div>
  `;

  document.getElementById("trailerBtn").onclick = () => openTrailer(movie.id);
  document.getElementById("favBtn").onclick = () => addToFavorites(movie);
}

function openTrailer(id) {
  fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const trailer = data.results.find(v => v.site === "YouTube");
      if (trailer) {
        window.open(`https://youtube.com/watch?v=${trailer.key}`);
      } else {
        alert("No trailer found");
      }
    });
}

function addToFavorites(movie) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favs.find(m => m.id === movie.id)) {
    favs.push({ id: movie.id, title: movie.title, poster: movie.poster_path });
    localStorage.setItem("favorites", JSON.stringify(favs));
    alert("Added to favorites!");
  } else {
    alert("Already in favorites");
  }
}
const favBtn = document.getElementById("favBtn");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

favBtn.onclick = () => {
  const exists = favorites.find(m => m.id == movieData.id);

  if (!exists) {
    favorites.push({
      id: movieData.id,
      title: movieData.title,
      poster: movieData.poster_path
    });

    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Added to Favorites ❤️");
  } else {
    alert("Already in Favorites!");
  }
};