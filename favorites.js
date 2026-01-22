const IMG = "https://image.tmdb.org/t/p/w500";
const moviesDiv = document.getElementById("movies");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

if (favorites.length === 0) {
  moviesDiv.innerHTML = "<h3 style='color:white;padding:20px'>No favorites yet 😢</h3>";
}

favorites.forEach(movie => {
  const div = document.createElement("div");
  div.className = "movie";

  div.innerHTML = `
    <img src="${IMG + movie.poster}">
    <div class="title">${movie.title}</div>
    <button class="fav-btn">❌ Remove</button>
  `;

  div.querySelector("button").onclick = () => {
    removeMovie(movie.id);
  };

  moviesDiv.appendChild(div);
});

function removeMovie(id) {
  favorites = favorites.filter(m => m.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  location.reload();
}