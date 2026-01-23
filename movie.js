import { auth, db } from "./auth.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const API_KEY = "b9864cdbbdcef170f412314e777c14f5";
const IMG = "https://image.tmdb.org/t/p/w500";

// Get movie id and type from URL
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");
const type = params.get("type") || "movie";

const poster = document.getElementById("moviePoster");
const title = document.getElementById("movieTitle");
const overview = document.getElementById("movieOverview");
const rating = document.getElementById("movieRating");
const genres = document.getElementById("movieGenres");
const watchTrailerBtn = document.getElementById("watchTrailerBtn");
const favBtn = document.getElementById("favBtn");

const trailerModal = document.getElementById("trailerModal");
const trailerIframe = document.getElementById("trailerIframe");
const closeTrailer = document.getElementById("closeTrailer");

// ================= LOAD MOVIE DETAILS =================
fetch(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=${API_KEY}&language=en-US`)
  .then(res => res.json())
  .then(data => {
    poster.src = IMG + data.poster_path;
    title.innerText = data.title || data.name;
    overview.innerText = data.overview;
    rating.innerText = data.vote_average;
    genres.innerText = data.genres.map(g => g.name).join(", ");

    // Get YouTube trailer
    fetch(`https://api.themoviedb.org/3/${type}/${movieId}/videos?api_key=${API_KEY}&language=en-US`)
      .then(res => res.json())
      .then(videoData => {
        const trailer = videoData.results.find(v => v.type === "Trailer" && v.site === "YouTube");
        if (trailer) {
          watchTrailerBtn.onclick = () => {
            trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
            trailerModal.style.display = "block";
          };
        } else {
          watchTrailerBtn.disabled = true;
          watchTrailerBtn.innerText = "Trailer not available";
        }
      });
  });

// ================= CLOSE TRAILER MODAL =================
closeTrailer.onclick = () => {
  trailerIframe.src = "";
  trailerModal.style.display = "none";
};

window.onclick = function(event) {
  if (event.target === trailerModal) {
    trailerIframe.src = "";
    trailerModal.style.display = "none";
  }
};

// ================= FAVORITES =================
auth.onAuthStateChanged(user => {
  if (!user) {
    favBtn.onclick = () => alert("Please login to add to favorites!");
    return;
  }

  const docRef = doc(db, "users", user.uid);

  // Check if already in favorites
  getDoc(docRef).then(docSnap => {
    if (docSnap.exists() && docSnap.data().favorites?.includes(Number(movieId))) {
      favBtn.innerText = "💛 Remove from My List";
    }
  });

  favBtn.onclick = async () => {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().favorites?.includes(Number(movieId))) {
      await updateDoc(docRef, { favorites: arrayRemove(Number(movieId)) });
      favBtn.innerText = "❤️ Add to My List";
    } else {
      await setDoc(docRef, { favorites: arrayUnion(Number(movieId)) }, { merge: true });
      favBtn.innerText = "💛 Remove from My List";
    }
  };
});