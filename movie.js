const API_KEY = "b9864cdbbdcef170f412314e777c14f5";
const IMG = "https://image.tmdb.org/t/p/w500";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type") || "movie";

function getDetails() {
  return `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`;
}

function getTrailer() {
  return `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`;
}

// Load details
fetch(getDetails())
  .then(res => res.json())
  .then(movie => {
    document.getElementById("title").innerText = movie.title || movie.name;
    document.getElementById("overview").innerText = movie.overview;
    document.getElementById("rating").innerText = "⭐ " + movie.vote_average.toFixed(1);

    document.getElementById("meta").innerText =
      `📅 ${movie.release_date || movie.first_air_date} | 🌍 ${movie.original_language.toUpperCase()}`;

    document.getElementById("poster").src = IMG + movie.poster_path;

    document.getElementById("detailsHero").style.backgroundImage =
      `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
  });

// Trailer button
document.getElementById("trailerBtn").onclick = () => {
  fetch(getTrailer())
    .then(res => res.json())
    .then(data => {
      const trailer = data.results.find(v => v.type === "Trailer");
      if (trailer) {
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`);
      } else {
        alert("No trailer found!");
      }
    });
};