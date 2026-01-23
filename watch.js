const API_KEY = "b9864cdbbdcef170f412314e777c14f5";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type") || "movie";

const titleEl = document.getElementById("watchTitle");
const overviewEl = document.getElementById("watchOverview");
const playerDiv = document.getElementById("player");

async function loadMovie() {
  const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`);
  const movie = await res.json();

  titleEl.innerText = movie.title || movie.name;
  overviewEl.innerText = movie.overview;

  // Save to recently watched
  saveRecentlyWatched(movie);

  // Load YouTube trailer
  const videoRes = await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`);
  const videoData = await videoRes.json();

  const trailer = videoData.results.find(v => v.site === "YouTube");

  if (trailer) {
    playerDiv.innerHTML = `
      <iframe 
        width="100%" height="500"
        src="https://www.youtube.com/embed/${trailer.key}"
        frameborder="0" 
        allowfullscreen>
      </iframe>
    `;
  } else {
    playerDiv.innerHTML = "<p>No trailer found.</p>";
  }
}

function saveRecentlyWatched(movie) {
  let list = JSON.parse(localStorage.getItem("recentlyWatched")) || [];
  list = list.filter(m => m.id !== movie.id);
  list.unshift({
    id: movie.id,
    type: type,
    title: movie.title || movie.name,
    poster: movie.poster_path
  });
  list = list.slice(0, 20);
  localStorage.setItem("recentlyWatched", JSON.stringify(list));
}

loadMovie();