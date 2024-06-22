console.log("Let's write JavaScript Code");
let currentSong = new Audio();
let songs = [];
let currFolder;

function convertSecondsToMinutes(totalSeconds) {
  const seconds = Math.floor(totalSeconds);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  try {
    currFolder = folder;
    const response = await fetch(`https://apna-spotify0.vercel.app/${currFolder}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    const div = document.createElement("div");
    div.innerHTML = text;
    const as = div.getElementsByTagName("a");
    songs = [];
    for (const element of as) {
      if (element.href.endsWith(".mp4")) {
        songs.push(element.href.split(`/${folder}/`)[1]);
      }
    }
    updateSongList();
  } catch (error) {
    console.error("Failed to fetch songs:", error);
  }
}

function updateSongList() {
  const songUL = document.querySelector(".songList ul");
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML += `
      <li>
        <div>
          <img class="menuLIicon" src="icons/music.svg" alt="">
        </div>
        <div class="songInfo">
          <div>${song.replaceAll("%20", " ")}</div>
        </div>
        <div class="playNow">
          <span>Play Now</span>
          <img src="icons/playSong.svg" alt="">
        </div>
      </li>`;
  }

  Array.from(document.querySelectorAll(".songList li")).forEach((e) => {
    e.addEventListener("click", () => {
      const songName = e.querySelector(".songInfo div").textContent.trim();
      playMusic(songName);
    });
  });
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    document.getElementById("play").src = "icons/pauseSong.svg";
  }
  document.querySelector(".songName").textContent = decodeURI(track);
  document.querySelector(".timer").textContent = "00:00 / 00:00";
};

async function main() {
  await getSongs("song/SheikhYassirDosari");
  playMusic(songs[0], true);

  document.getElementById("play").addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      document.getElementById("play").src = "icons/pauseSong.svg";
    } else {
      currentSong.pause();
      document.getElementById("play").src = "icons/playSong.svg";
    }
  });
}

currentSong.addEventListener("timeupdate", () => {
  document.querySelector(".timer").textContent = `${convertSecondsToMinutes(currentSong.currentTime)} / ${convertSecondsToMinutes(currentSong.duration)}`;
  document.querySelector(".pointer").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
});

document.querySelector(".trackBar").addEventListener("click", (e) => {
  const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".pointer").style.left = percent + "%";
  currentSong.currentTime = (currentSong.duration * percent) / 100;
});

document.querySelector(".hamberger_div").addEventListener("click", () => {
  document.querySelector(".leftContainer").style.zIndex = 10;
  document.querySelector(".leftContainer").style.left = "5px";
  document.getElementById("myHam").style.display = "none";
});

document.querySelector(".closeBTN").addEventListener("click", () => {
  document.querySelector(".leftContainer").style.left = "-500px";
});

document.getElementById("prev").addEventListener("click", () => {
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index > 0) {
    playMusic(songs[index - 1]);
  }
});

document.getElementById("next").addEventListener("click", () => {
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index < songs.length - 1) {
    playMusic(songs[index + 1]);
  }
});

document.querySelector(".range input").addEventListener("change", (e) => {
  currentSong.volume = e.target.value / 100;
});

Array.from(document.getElementsByClassName("card")).forEach((e) => {
  e.addEventListener("click", async (item) => {
    await getSongs(`song/${item.currentTarget.dataset.folder}`);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelector(".startUpDiv").style.display = "none";
  }, 1000);
});

main();
