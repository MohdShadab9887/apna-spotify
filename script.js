console.log("Lets write JavaScript Code");
let currentSong = new Audio();
let songs;
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
            const username = 'MohdShadab9887'; // Replace with your GitHub username
            const repository = 'apna-spotify'; // Replace with your repository name
            const directory = 'song'; // Replace with your directory name
  currFolder = folder;

  console.log(`currentFolder: ${currFolder}`);
``
  // let a = await fetch(`https://github.com/MohdShadab9887/apna-spotify0/tree/main/${folder}/`);
  let a = await fetch(`https://api.github.com/repos/${username}/${repository}/contents/${directory}/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp4")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
      // play.songs()
    }
  }

  // show all the songs in the plalist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
            <div>
              <img class="menuLIicon" src="icons/music.svg" alt="">
            </div>

            <div class="songInfo">
              <div> ${song.replaceAll("%20", " ")}</div>
            </div>

            <div class="playNow">
              <span>Play Now</span>
              <img src="icons/playSong.svg" alt="">
            </div>
        </li>`;

    Array.from(
      document.querySelector(".songList").getElementsByTagName("li")
    ).forEach((e) => {
      e.addEventListener("click", (element) => {
        // console.log(e.querySelector(".songInfo").firstElementChild.innerHTML);
        playMusic(
          e.querySelector(".songInfo").firstElementChild.innerHTML.trim()
        );
      });
      return songs;
    });
  }
}

const playMusic = (track, pause = false) => {
  currentSong.src = `${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "icons/pauseSong.svg";
  }
  document.querySelector(".songName").innerHTML =
    decodeURI(
      track
    ); /*  or currentSong.src.replaceAll("%20", " ").trim().split("/song/")[1]  */
  document.querySelector(".timer").innerHTML = "00:00 / 00:00";
  // return playMusic
};

async function displayAlbums() {
  console.log("displying albums");
  // currFolder = folder ${currFolder};
  let a = await fetch(`/song/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  // songs = [];
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/song") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[0];

      // Get the metadata of the folder
      //     let a = await fetch(`/song/${folder}/info.json`);
      //     let response = await a.json();
      //     cardContainer.innerHTML =
      //       cardContainer.innerHTML +
      //       ` <div data-folder="${folder}" class="card">
      //     <div class="play">
      //         <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      //             xmlns="http://www.w3.org/2000/svg">
      //             <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
      //                 stroke-linejoin="round" />
      //         </svg>
      //     </div>

      //     <img src="/song/${folder}/cover.jpg" alt="">
      //     <h2>${response.title}</h2>
      //     <p>${response.description}</p>
      // </div>`;
    }
  }
  // songs = []
  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      console.log("Fetching Song");
      songs = await getSongs(`song/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}
async function main() {
  // Get the list of all the songs
  // await getSongs("song/SheikhYassirDosari");
  await getSongs(`song/DinoJames`)
  // //  `https://github.com/MohdShadab9887/apna-spotify0/tree/main/song/SheikhYassirDosari`
  // );

  playMusic(songs[0], true);

  // Display all the albums on the page
  await displayAlbums();

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
}

currentSong.addEventListener("timeupdate", () => {
  document.querySelector(".timer").innerHTML = `${convertSecondsToMinutes(
    currentSong.currentTime
  )} / ${convertSecondsToMinutes(currentSong.duration)}`;
  document.querySelector(".pointer").style.left =
    (currentSong.currentTime / currentSong.duration) * 100 + "%";
});
document.querySelector(".trackBar").addEventListener("click", (e) => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".pointer").style.left = percent + "%";

  currentSong.currentTime = (currentSong.duration * percent) / 100;
});

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

prev.addEventListener("click", () => {
  console.log("prev clicked");
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index - 1 > 0) {
    playMusic(songs[index - 1]);
  }
});
next.addEventListener("click", () => {
  console.log("next clicked");
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index + 1 < songs.length) {
    playMusic(songs[index + 1]);
  }
});
document
  .querySelector(".range")
  .getElementsByTagName("input")[0]
  .addEventListener("change", (e) => {
    currentSong.volume = e.target.value / 100;
  });
Array.from(document.getElementsByClassName("card")).forEach((e) => {
  e.addEventListener("click", async (item) => {
    songs = await getSongs(`song/${item.currentTarget.dataset.folder}`);
  });
});

let startupMessage = document.querySelector(".startUpDiv");
document.addEventListener("DOMContentLoaded", function () {
  function hideStartupMessage() {
    startupMessage.style.display = "none";
  }
  setTimeout(hideStartupMessage, 1000);
});
main();
