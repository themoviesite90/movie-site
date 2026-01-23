const API_KEY = "b9864cdbbdcef170f412314e777c14f5";

const IMG = "https://image.tmdb.org/t/p/w500";
const TRENDING = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
const SEARCH = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;
const DISCOVER = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=`;

const moviesDiv = document.getElementById("movies");
const searchInput = document.getElementById("search");

// Load trending first
loadHero();
loadMovies(TRENDING);

function loadMovies(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => showMovies(data.results));
}

function showMovies(movies) {
  moviesDiv.innerHTML = "";

  movies.forEach(movie => {
    if (!movie.poster_path) return;

    const div = document.createElement("div");
    div.className = "movie";

    div.innerHTML = `
      <img src="${IMG + movie.poster_path}">
      <div class="title">${movie.title}</div>
    `;

    div.onclick = () => {
      window.location.href = `movie.html?id=${movie.id}`;
    };

    moviesDiv.appendChild(div);
  });
}

// Search
searchInput.addEventListener("keyup", function () {
  const value = searchInput.value;

  if (value.trim() === "") {
    loadMovies(TRENDING);
  } else {
    loadMovies(SEARCH + value);
  }
});

// Categories
document.querySelectorAll(".categories button").forEach(btn => {
  btn.onclick = () => {
    const genre = btn.getAttribute("data-genre");

    if (genre === "trending") {
      loadMovies(TRENDING);
    } else {
      loadMovies(DISCOVER + genre);
    }
  };
});function loadHero() {
  fetch(TRENDING)
    .then(res => res.json())
    .then(data => {
      const movie = data.results[Math.floor(Math.random() * data.results.length)];

      const hero = document.getElementById("hero");

      hero.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

      hero.innerHTML = `
        <div class="hero-content">
          <h1>${movie.title}</h1>
          <p>${movie.overview.slice(0, 120)}...</p>
          <button onclick="location.href='movie.html?id=${movie.id}'">▶ Watch</button>
        </div>
      `;
    });
}