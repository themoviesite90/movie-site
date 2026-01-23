// ================= CONSTANTS =================
const API_KEY = "b9864cdbbdcef170f412314e777c14f5";
const IMG = "https://image.tmdb.org/t/p/w500";
let currentType = "movie";

const moviesDiv = document.getElementById("movies");
const searchInput = document.getElementById("search");
const searchSuggestions = document.getElementById("search-suggestions");

// ================= HERO SLIDER =================
let heroMovies = [];
let heroIndex = 0;
let heroTimer = null;

function loadHero() {
  fetch(`https://api.themoviedb.org/3/trending/${currentType}/week?api_key=${API_KEY}`)
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
    .catch(err => console.log("Movies error:", err));
}

function showMovies(movies) {
  moviesDiv.innerHTML = "";

  movies.forEach(movie => {
    if (!movie.poster_path) return;

    const div = document.createElement("div");
    div.className = "movie";

    div.innerHTML = `
      <img src="${IMG + movie.poster_path}" alt="${movie.title || movie.name}">
      <div class="title">${movie.title || movie.name}</div>
      <button class="fav-btn" id="fav-${movie.id}">❤️ Add to My List</button>
    `;

    // Click to go to movie page
    div.onclick = (e) => {
      if (!e.target.classList.contains("fav-btn")) {
        window.location.href = `movie.html?id=${movie.id}&type=${currentType}`;
      }
    };

    // Favorite button logic
    const favBtn = div.querySelector(`#fav-${movie.id}`);
    favBtn.onclick = async (e) => {
      e.stopPropagation();
      const user = auth.currentUser;
      if (!user) {
        alert("Please login to add to favorites!");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().favorites?.includes(movie.id)) {
        await updateDoc(docRef, { favorites: arrayRemove(movie.id) });
        favBtn.innerText = "❤️ Add to My List";
      } else {
        await setDoc(docRef, { favorites: arrayUnion(movie.id) }, { merge: true });
        favBtn.innerText = "💛 Remove from My List";
      }
    };

    moviesDiv.appendChild(div);
  });
}

// ================= SEARCH =================
let searchTimeout;

searchInput.addEventListener("input", e => {
  const query = e.target.value.trim();

  if (!query) {
    loadMovies(`https://api.themoviedb.org/3/trending/${currentType}/week?api_key=${API_KEY}`);
    searchSuggestions.innerHTML = "";
    searchSuggestions.style.display = "none";
    return;
  }

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetch(`https://api.themoviedb.org/3/search/${currentType}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        showMovies(data.results);
        showSearchSuggestions(data.results);
      });
  }, 300);
});

function showSearchSuggestions(results) {
  searchSuggestions.innerHTML = "";
  if (!results || results.length === 0) {
    searchSuggestions.style.display = "none";
    return;
  }

  results.slice(0, 5).forEach(movie => {
    const div = document.createElement("div");
    div.className = "suggestion";
    div.innerHTML = `
      <img src="${IMG + movie.poster_path}" alt="${movie.title || movie.name}">
      <span>${movie.title || movie.name}</span>
    `;
    div.onclick = () => {
      window.location.href = `movie.html?id=${movie.id}&type=${currentType}`;
    };
    searchSuggestions.appendChild(div);
  });

  searchSuggestions.style.display = "block";
}

// ================= FILTER BUTTONS =================
document.getElementById("moviesBtn").onclick = () => {
  currentType = "movie";
  toggleActiveButton("moviesBtn", ".filter-btn");
  loadHero();
  loadMovies(`https://api.themoviedb.org/3/trending/${currentType}/week?api_key=${API_KEY}`);
};

document.getElementById("tvBtn").onclick = () => {
  currentType = "tv";
  toggleActiveButton("tvBtn", ".filter-btn");
  loadHero();
  loadMovies(`https://api.themoviedb.org/3/trending/${currentType}/week?api_key=${API_KEY}`);
};

document.querySelectorAll(".industry-filters button").forEach(btn => {
  btn.onclick = () => {
    const lang = btn.getAttribute("data-lang");
    loadMovies(`https://api.themoviedb.org/3/discover/${currentType}?api_key=${API_KEY}&with_original_language=${lang}`);
    toggleActiveButton(btn, ".industry-btn");
  };
});

document.querySelectorAll(".genre-filters button").forEach(btn => {
  btn.onclick = () => {
    const genre = btn.getAttribute("data-genre");
    const url = genre === "trending"
      ? `https://api.themoviedb.org/3/trending/${currentType}/week?api_key=${API_KEY}`
      : `https://api.themoviedb.org/3/discover/${currentType}?api_key=${API_KEY}&with_genres=${genre}`;
    loadMovies(url);
    toggleActiveButton(btn, ".genre-btn");
  };
});

// ================= HELPER =================
function toggleActiveButton(activeBtn, selector) {
  if (typeof activeBtn === "string") {
    document.querySelectorAll(selector).forEach(btn => btn.classList.remove("active"));
    document.getElementById(activeBtn).classList.add("active");
  } else {
    document.querySelectorAll(selector).forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  }
}

// ================= INITIAL LOAD =================
loadHero();
loadMovies(`https://api.themoviedb.org/3/trending/${currentType}/week?api_key=${API_KEY}`);
