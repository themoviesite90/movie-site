const API_KEY = "b9864cdbbdcef170f412314e777c14f5";

const IMG = "https://image.tmdb.org/t/p/w500";

let currentType = "movie";

const moviesDiv = document.getElementById("movies");
const searchInput = document.getElementById("search");

// URLs
function getTrending() {
  return `https://api.themoviedb.org/3/trending/${currentType}/week?api_key=${API_KEY}`;
}

function getSearch(q) {
  return `https://api.themoviedb.org/3/search/${currentType}?api_key=${API_KEY}&query=${q}`;
}

function getDiscoverByLang(lang) {
  return `https://api.themoviedb.org/3/discover/${currentType}?api_key=${API_KEY}&with_original_language=${lang}`;
}

// Load
loadHero();let heroMovies = [];
let currentHero = 0;
let heroInterval;

function loadHero() {
  fetch(getTrending())
    .then(res => res.json())
    .then(data => {
      heroMovies = data.results.slice(0,5); // first 5 movies
      currentHero = 0;
      showHeroSlide();
      if(heroInterval) clearInterval(heroInterval);
      heroInterval = setInterval(nextHeroSlide, 5000); // change every 5 seconds
    });
}

function showHeroSlide() {
  const movie = heroMovies[currentHero];
  if(!movie) return;

  const hero = document.getElementById("hero");
  const title = document.getElementById("heroTitle");
  const overview = document.getElementById("heroOverview");
  const watchBtn = document.getElementById("heroWatch");

  hero.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
  title.innerText = movie.title || movie.name;
  overview.innerText = movie.overview.slice(0,120) + "...";
  watchBtn.onclick = () => {
    window.location.href = `movie.html?id=${movie.id}&type=${currentType}`;
  };
}

function nextHeroSlide() {
  currentHero = (currentHero + 1) % heroMovies.length;
  showHeroSlide();
}

loadMovies(getTrending());

// Fetch
function loadMovies(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => showMovies(data.results))
    .catch(err => console.log(err));
}

// Show
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

// Search
searchInput.addEventListener("keyup", function () {
  const value = searchInput.value;

  if (value.trim() === "") {
    loadMovies(getTrending());
  } else {
    loadMovies(getSearch(value));
  }
});

// Hero
function loadHero() {
  fetch(getTrending())
    .then(res => res.json())
    .then(data => {
      const movie = data.results[Math.floor(Math.random() * data.results.length)];
      const hero = document.getElementById("hero");

      hero.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

      hero.innerHTML = `
        <div class="hero-content">
          <h1>${movie.title || movie.name}</h1>
          <p>${movie.overview.slice(0, 120)}...</p>
          <button onclick="location.href='movie.html?id=${movie.id}&type=${currentType}'">▶ Watch</button>
        </div>
      `;
    });
}

// Buttons
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
