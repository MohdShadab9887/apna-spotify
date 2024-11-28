console.log("Lets write JavaScript Code");
let songId = "mp3";
let i = 0;
let currFolder;
var currentSong = null;
function convertSecondsToMinutes(totalSeconds) {
  const seconds = Math.floor(totalSeconds);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  const owner = "MohdShadab9887";
  const repo = "apna-spotify";
  const path = "/song";

  let response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents${path}`
  );
  let files = await response.json();

  // To get songs Links
  let songs = [];
  for (let index = 0; index < files.length; index++) {
    if (files[index].download_url.includes(songId)) {
      songs.push(files[index].download_url);
    }
  }

  // setting 1st song to play
  if (!currentSong) {
    playMusic(songs[0]);
    currentSong.pause();
    playButton.src = "icons/playSong.svg";
    currentSongName();
  }
  return songs;
}

// Playing song
function playMusic(track) {
  if (currentSong) {
    currentSong.pause();
  }

  currentSong = new Audio(track);
  currentSong?.play();
  playButton.src = "icons/pauseSong.svg";

  // TimeDuration of the Song
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".timer").innerHTML = `${convertSecondsToMinutes(
      currentSong.currentTime
    )} / ${convertSecondsToMinutes(currentSong.duration)}`;
    document.querySelector(".pointer").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
}

// Play-Pause toggle
let playButton = document.getElementById("play");
playButton.addEventListener("click", (e) => {
  if (currentSong.paused) {
    currentSong?.play();
    playButton.src = "icons/pauseSong.svg";
  } else {
    currentSong?.pause();
    playButton.src = "icons/playSong.svg";
  }
});

// Volume (+ or -)
let vol = document
  .querySelector(".range")
  .getElementsByTagName("input")[0]
  .addEventListener("change", (e) => {
    currentSong.volume = e.target.value / 100;
  });

// Mute Unmute functioning
let setVolume = document.querySelector(".volume_png");
document.querySelector(".volume_png").addEventListener("click", (e) => {
  if (currentSong.muted) {
    currentSong.muted = false;
    setVolume.src = "/icons/Volume.svg";
  } else {
    currentSong.muted = true;
    setVolume.src = "/icons/Volume_mute.svg";
  }
});

// seekBar placement
document.querySelector(".trackBar").addEventListener("click", (e) => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".pointer").style.left = percent + "%";
  currentSong.currentTime = (currentSong.duration * percent) / 100;
});

// Displaying currentSong Name
function currentSongName() {
  let div = (document.querySelector(
    ".songName"
  ).innerHTML = `<div> ${currentSong.src
    .split("/song/")[1]
    .replaceAll("%20", " ")} </div>`);
}

const mysongDiv = document.querySelector(".rightContainer");
mysongDiv.addEventListener("click", (event) => {
  const clickedElement = event.target.closest(".singerFolder");
  if (clickedElement) {
    songId = clickedElement.id;
    main();
  }
});

document.getElementById("showAll").addEventListener("click", () => {
  songId = "mp3";
  main(); // Re-render the list
});

async function main() {
  let songs = await getSongs();
  // Prev song
  prev.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
    currentSongName();
  });

  // Next Song
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
    currentSongName();
  });

  const myfunc = () => {
    // Showing all the songs in the Playlist
    const songUL = document.querySelector(".cardContainer");
    songUL.innerHTML = "";
    for (const song of songs) {
      if (song.includes(".mp3")) {
        let songName = song
          .split("/song/")[1]
          .replaceAll("%20", " ")
          .replaceAll("%26", "&");
        songUL.innerHTML += `<div  id="${(i = i + 1)}" class="card">          
          <img class="songIcon" src="icons/music.svg" alt="">
          <div class="songNameList">${songName}</div>
          <div class="playNow">
            <span>Play Now</span>
            <img src="icons/playSong.svg" alt="">
          </div>
        </div>`;
      }
    }
  };
  myfunc();

  // Attach an event listener to each song
  Array.from(
    document.querySelector(".cardContainer").getElementsByTagName("div")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      playMusic(
        "https://raw.githubusercontent.com/MohdShadab9887/apna-spotify/main/song/" +
          e.getElementsByTagName("div")[0].innerHTML
      );
      currentSongName();
    });
  });
}

// hamberger_div Toggle
let openMenu = document.querySelector(".hamberger_div");
let closeMenu = document.querySelector(".closeBTN");

openMenu.addEventListener("click", () => {
  document.querySelector(".leftContainer").style.zIndex = 10;
  document.querySelector(".leftContainer").style.left = "5px";
});

closeMenu.addEventListener("click", () => {
  document.querySelector(".leftContainer").style.left = "-500px";
});

// StatUp Animation
let startupMessage = document.querySelector(".startUpDiv");
document.addEventListener("DOMContentLoaded", function () {
  function hideStartupMessage() {
    startupMessage.style.display = "none";
  }
  setTimeout(hideStartupMessage, 1000);
});

let closeBtn = document.querySelector(".closeBTN");
let socialBtn = document.querySelector(".socialDiv");
let socialIcon1 = document.querySelector(".socialIcon1");
let socialIcon2 = document.querySelector(".socialIcon2");
let socialIcon3 = document.querySelector(".socialIcon3");

let scaled = false;
setInterval(() => {
  if (scaled) {
    closeBtn.style.transform = "scale(1)";
  } else {
    closeBtn.style.transform = "scale(1.3)";
  }
  scaled = !scaled;
}, 750);

main();
