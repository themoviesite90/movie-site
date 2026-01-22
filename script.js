const API_KEY = "b9864cdbbdcef170f412314e777c14f5";

const IMG = "https://image.tmdb.org/t/p/w500";
const TRENDING = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
const SEARCH = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

const moviesDiv = document.getElementById("movies");
const searchInput = document.getElementById("search");

// Load trending first
fetch(TRENDING)
  .then(res => res.json())
  .then(data => showMovies(data.results));

function showMovies(movies) {
  moviesDiv.innerHTML = "";

  movies.forEach(movie => {
    if (!movie.poster_path) return;

    const div = document.createElement("div");
    div.className = "movie";
div.onclick = () => {
  window.location.href = `movie.html?id=${movie.id}`;
};

    div.innerHTML = `
  <img src="${IMG + movie.poster_path}">
  <div class="title">${movie.title}</div>
`;

    moviesDiv.appendChild(div);
  });
}

// Search
searchInput.addEventListener("keyup", function () {
  const value = searchInput.value;

  if (value.trim() === "") {
    fetch(TRENDING)
      .then(res => res.json())
      .then(data => showMovies(data.results));
  } else {
    fetch(SEARCH + value)
      .then(res => res.json())
      .then(data => showMovies(data.results));
  }
});