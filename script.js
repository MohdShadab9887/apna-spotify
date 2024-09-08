console.log("Lets write JavaScript Code");
let i = 0;
let currFolder;
let currentSong = null; // To track the currently playing audio
function convertSecondsToMinutes(totalSeconds) {
  const seconds = Math.floor(totalSeconds);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  // currFolder = folder;
  const owner = "MohdShadab9887"; // Replace with your GitHub username
  const repo = "apna-spotify"; // Replace with your repository name
  const path = "/song"; // Replace with the path to the directory containing songs

  let response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents${path}`
  );
  let files = await response.json();
  // console.log(files)
  // To get songs Links
  let songs = [];
  for (let index = 0; index < files.length; index++) {
    songs.push(files[index].download_url);
    // console.log(files[index].download_url.split("/song/")[1].replaceAll("%20", " "));
  }

  return songs;
}
const playMusic = async (track, songs) => {
  if (currentSong && !currentSong.paused) {
    await currentSong.pause();  // Await the pause to complete
    currentSong.currentTime = 0;  // Reset the time
  }

  currentSong = new Audio(track);  // Load the new track
  await currentSong.play();  // Await the play to complete

  if (currentSong) {
    playButton.src = "icons/pauseSong.svg";  // Update UI
  }

  // Other logic for updating UI, timer, volume, etc.



  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".timer").innerHTML = `${convertSecondsToMinutes(
      currentSong.currentTime
    )} / ${convertSecondsToMinutes(currentSong.duration)}`;
    document.querySelector(".pointer").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Volume (+ or -)
  let vol = document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = e.target.value / 100;
    });

  // seekBar placement
  document.querySelector(".trackBar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".pointer").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  let volume_png = document.querySelector(".volume_png");
  document.querySelector(".volume_png").addEventListener("click", (e) => {
    if (currentSong.volume > 0) {
      currentSong.volume = 0;
      volume_png.src = "/icons/Volume_mute.svg";
    } else {
      currentSong.volume = 50 / 100;
      volume_png.src = "/icons/Volume.svg";
    }
  });
};

// function playPause
let playButton = document.getElementById("play");
playButton.addEventListener("click", (e) => {
  if (currentSong.paused) {
    currentSong.play();
    playButton.src = "icons/pauseSong.svg";
  } else {
    currentSong.pause();
    playButton.src = "icons/playSong.svg";
  }
});

function naam() {
  let div = (document.querySelector(
    ".songName"
  ).innerHTML = `<div> ${currentSong.src
    .split("/song/")[1]
    .replaceAll("%20", " ")} </div>`);
}

async function main() {
  let songs = await getSongs();

  prev.addEventListener("click", () => {
    console.log("prev clicked");
    let index = songs.indexOf(currentSong.src);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
    naam();
  });
  next.addEventListener("click", () => {
    console.log("next clicked");
    let index = songs.indexOf(currentSong.src);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
    naam();
    // div = (document.querySelector(".songName").innerHTML = `<div> ${currentSong.src.split("/song/")[1].replaceAll("%20", " ")} </div>`);
  });

  // Showing all the songs in the Playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    // Ensure song is a valid string and contains "/song/"
    if (song.includes(".mp3")) {
      let songName = song.split("/song/")[1].replaceAll("%20", " ");
      songUL.innerHTML += `
          <li id="${(i = i + 1)}">
            <div>
              <img class="menuLIicon" src="icons/music.svg" alt="">
            </div> 
            <div>${songName}</div>            
            <div class="playNow">
              <span>Play Now</span>
              <img src="icons/playSong.svg" alt="">
            </div>
          </li>`;
    }
  }
  // console.log(songs);

  // Attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      playMusic(
        "https://raw.githubusercontent.com/MohdShadab9887/apna-spotify/main/song/" +
          e.getElementsByTagName("div")[1].innerHTML
      );
      // console.log(e);
      div = document.querySelector(".songName").innerHTML = `<div> ${
        e.getElementsByTagName("div")[1].innerHTML
      } </div>`;
      // console.log(e.getElementsByTagName("div ")[1].innerHTML);
      naam();
      // console.log(currentSong.src.split("/song/")[1].replaceAll("%20", " "));
    });
  });
}

// hamberger_div
let openMenu = document.querySelector(".hamberger_div");
let closeMenu = document.querySelector(".closeBTN");

openMenu.addEventListener("click", () => {
  document.querySelector(".leftContainer").style.zIndex = 10;
  document.querySelector(".leftContainer").style.left = "5px";
  // myHam.style.display = "none";
});

closeMenu.addEventListener("click", () => {
  document.querySelector(".leftContainer").style.left = "-500px";
});

let startupMessage = document.querySelector(".startUpDiv");
document.addEventListener("DOMContentLoaded", function () {
  function hideStartupMessage() {
    startupMessage.style.display = "none";
  }
  setTimeout(hideStartupMessage, 1000);
});

// let i = 0
let closeBtn = document.querySelector(".closeBTN");
let socialBtn = document.querySelector(".socialDiv");
let socialIcon1 = document.querySelector(".socialIcon1");
let socialIcon2 = document.querySelector(".socialIcon2");
let socialIcon3 = document.querySelector(".socialIcon3");
// console.log(socialBtn);

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
