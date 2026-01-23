const API_KEY = "b9864cdbbdcef170f412314e777c14f5";
const IMG = "https://image.tmdb.org/t/p/w500";

let currentType = "movie";

const moviesDiv = document.getElementById("movies");
const searchInput = document.getElementById("search");

// ================= URL BUILDERS =================
function getTrending() {
  return `https://api.themoviedb.org/3/trending/${currentType}/week?api_key=${API_KEY}`;
}

function getSearch(q) {
  return `https://api.themoviedb.org/3/search/${currentType}?api_key=${API_KEY}&query=${q}`;
}

function getDiscoverByLang(lang) {
  return `https://api.themoviedb.org/3/discover/${currentType}?api_key=${API_KEY}&with_original_language=${lang}`;
}

// ================= HERO SLIDER =================
let heroMovies = [];
let heroIndex = 0;
let heroTimer = null;

function loadHero() {
  fetch(getTrending())
    .then(res => res.json())
    .then(data => {
      heroMovies = data.results.slice(0, 5);
      heroIndex = 0;
      showHero();

      if (heroTimer) clearInterval(heroTimer);
      heroTimer = setInterval(nextHero, 5000);
    })
    .catch(err => console.log("Hero error:", err));
}

function showHero() {
  const movie = heroMovies[heroIndex];
  if (!movie) return;

  const hero = document.getElementById("hero");
  const title = document.getElementById("heroTitle");
  const overview = document.getElementById("heroOverview");
  const watchBtn = document.getElementById("heroWatch");

  hero.style.backgroundImage =
    `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

  title.innerText = movie.title || movie.name;
  overview.innerText = movie.overview.substring(0, 120) + "...";

  watchBtn.onclick = () => {
    window.location.href = `movie.html?id=${movie.id}&type=${currentType}`;
  };
}

function nextHero() {
  heroIndex = (heroIndex + 1) % heroMovies.length;
  showHero();
}

// ================= MOVIES GRID =================
function loadMovies(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => showMovies(data.results))
    .catch(err => console.log(err));
}

function showMovies(movies) {
  moviesDiv.innerHTML = "";

  movies.forEach(movie => {
    if (!movie.poster_path) return;

    const div = document.createElement("div");
    div.className = "movie";

    div.innerHTML = `
      <img src="${IMG + movie.poster_path}">
      <div class="title">${movie.title || movie.name}</div>
    `;

    div.onclick = () => {
      window.location.href = `movie.html?id=${movie.id}&type=${currentType}`;
    };

    moviesDiv.appendChild(div);
  });
}

// ================= SEARCH =================
searchInput.addEventListener("keyup", function () {
  const value = searchInput.value;

  if (value.trim() === "") {
    loadMovies(getTrending());
  } else {
    loadMovies(getSearch(value));
  }
});

// ================= BUTTONS =================
document.getElementById("moviesBtn").onclick = () => {
  currentType = "movie";
  loadHero();
  loadMovies(getTrending());
};

document.getElementById("tvBtn").onclick = () => {
  currentType = "tv";
  loadHero();
  loadMovies(getTrending());
};

document.querySelectorAll(".industry-filters button").forEach(btn => {
  btn.onclick = () => {
    const lang = btn.getAttribute("data-lang");
    loadMovies(getDiscoverByLang(lang));
  };
});

// ================= START =================
loadHero();
loadMovies(getTrending());