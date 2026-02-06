/*
go to the url http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/topsongs/limit=25/json

get each of the songs, and make a div containing
the song title, the artist, and an image of the album

advanced:
on hover, show the description of the song or some other additional piece of info.  make it show up above the existing info in the box.
*/

document.addEventListener("DOMContentLoaded", initiateApp);

function initiateApp() {
  fetch(
    "http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/topsongs/limit=30/json",
  )
    .then((response) => response.json())
    .then((data) => makeSongTiles(data.feed.entry))
    .catch((error) => {
      const errorDiv = document.createElement("div");
      errorDiv.classList.add("error");

      const errorTitle = document.createElement("h3");
      errorTitle.textContent = "Error";

      const errorText = document.createElement("p");
      errorText.textContent =
        "Sorry, there was an error retrieving data from iTunes";

      errorDiv.appendChild(errorTitle);
      errorDiv.appendChild(errorText);
      document.body.appendChild(errorDiv);
    });
}

function showClip(e) {
  e.preventDefault();
  const audioClip = this.querySelector(".audioClip");
  audioClip.style.display = "block";
}

function hideClip(e) {
  e.preventDefault();
  const audioClip = this.querySelector(".audioClip");
  if (!audioClip.paused) {
    audioClip.pause();
  }
  audioClip.style.display = "none";
}

function makeSongTiles(arrayData) {
  for (let i = 0; i < arrayData.length; i++) {
    const songDiv = document.createElement("div");
    songDiv.classList.add("song");
    songDiv.addEventListener("mouseenter", showClip);
    songDiv.addEventListener("mouseleave", hideClip);

    const songImg = document.createElement("img");
    songImg.src = arrayData[i]["im:image"][2].label;
    songImg.classList.add("coverArt");
    songImg.height = 170;
    songDiv.appendChild(songImg);

    const artistDiv = document.createElement("div");
    artistDiv.classList.add("artist");
    artistDiv.textContent = arrayData[i]["im:artist"].label;

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("songTitle");
    titleDiv.textContent = arrayData[i]["im:name"].label;

    const artistTitleWrapper = document.createElement("div");
    artistTitleWrapper.classList.add("artistTitleWrapper");
    artistTitleWrapper.appendChild(artistDiv);
    artistTitleWrapper.appendChild(titleDiv);
    songDiv.appendChild(artistTitleWrapper);

    const audioClip = document.createElement("audio");
    audioClip.classList.add("audioClip");
    audioClip.controls = true;

    const sourceTag = document.createElement("source");
    sourceTag.src = arrayData[i].link[1].attributes.href;
    sourceTag.type = arrayData[i].link[1].attributes.type;
    audioClip.appendChild(sourceTag);
    songDiv.appendChild(audioClip);

    const songNum = document.createElement("div");
    songNum.classList.add("number");
    songNum.textContent = i + 1;
    songDiv.appendChild(songNum);

    document.body.appendChild(songDiv);
  }
}
