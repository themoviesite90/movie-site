// watch.js
const API_KEY = "b9864cdbbdcef170f412314e777c14f5";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type") || "movie";

// Mock player - in production, integrate with video streaming APIs
const videoSources = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
];

let player = null;
let currentSource = videoSources[0];

function initPlayer() {
  const playerDiv = document.getElementById("player");
  playerDiv.innerHTML = `
    <video id="videoPlayer" width="100%" controls autoplay>
      <source src="${currentSource}" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  `;
  
  player = document.getElementById("videoPlayer");
  
  // Load movie details
  fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("watchTitle").innerText = data.title || data.name;
      document.getElementById("watchOverview").innerText = data.overview;
    });
}

function togglePlay() {
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    player.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function toggleMute() {
  player.muted = !player.muted;
}

initPlayer();