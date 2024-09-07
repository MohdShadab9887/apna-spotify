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
















<script>
        console.log("Lets write JavaScript Code");
        let currentSong = new Audio();
        let songs = [];
        let currFolder;

        // Helper to convert seconds to time format
        function convertSecondsToMinutes(totalSeconds) {
            const seconds = Math.floor(totalSeconds);
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
        }

        // Fetch and display songs
        async function getSongs(folder) {
            currFolder = folder;
            try {
                let response = await fetch(`${folder}/`);
                if (!response.ok) {
                    console.error("Error fetching songs:", response.status);
                    return;
                }
                let text = await response.text();
                let div = document.createElement("div");
                div.innerHTML = text;
                let links = div.getElementsByTagName("a");

                songs = [];
                for (let link of links) {
                    if (link.href.endsWith(".mp4")) {
                        songs.push(link.href.split(`/${folder}/`)[1]);
                    }
                }

                displaySongs();
            } catch (error) {
                console.error("Failed to load songs:", error);
            }
        }

        // Display songs in the UI
        function displaySongs() {
            let songUL = document.querySelector(".songList ul");
            songUL.innerHTML = "";  // Clear current list
            for (let song of songs) {
                songUL.innerHTML += `
                    <li>
                        <div><img class="menuLIicon" src="icons/music.svg" alt=""></div>
                        <div class="songInfo">
                            <div>${song.replaceAll("%20", " ")}</div>
                        </div>
                        <div class="playNow">
                            <span>Play Now</span>
                            <img src="icons/playSong.svg" alt="">
                        </div>
                    </li>`;
            }

            // Attach event listeners to play songs
            Array.from(document.querySelectorAll(".songList li")).forEach((li, index) => {
                li.addEventListener("click", () => playMusic(songs[index]));
            });
        }

        // Play music
        function playMusic(track) {
            currentSong.src = `${currFolder}/` + track;
            currentSong.play();
            document.querySelector(".songName").textContent = track.replaceAll("%20", " ");
            document.querySelector(".timer").textContent = "00:00 / 00:00";
        }

        // Initialize the page
        async function main() {
            try {
                await getSongs('song/SheikhYassirDosari');
                playMusic(songs[0]);
            } catch (error) {
                console.error("Error during initialization:", error);
            }

            // Add other event listeners for play/pause, etc.
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

        // Call main function on DOM content load
        document.addEventListener("DOMContentLoaded", main);

    </script> 



main();
