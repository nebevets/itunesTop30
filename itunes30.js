/*
go to the url http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/topsongs/limit=25/json

get each of the songs, and make a div containing
the song title, the artist, and an image of the album

advanced:
on hover, show the description of the song or some other additional piece of info.  make it show up above the existing info in the box.
*/

document.addEventListener("DOMContentLoaded", initiateApp);

const CLIP_STATE = {
  SHOW: "show",
  HIDE: "hide",
};

let globalAudioClip = null;

function initiateApp() {
  globalAudioClip = document.createElement("audio");
  globalAudioClip.classList.add("audioClip");
  globalAudioClip.controls = true;
  document.body.appendChild(globalAudioClip);

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

function toggleClip(state) {
  return function (e) {
    e.preventDefault();
    switch (state) {
      case CLIP_STATE.SHOW:
        globalAudioClip.innerHTML = "";
        const sourceTag = document.createElement("source");
        sourceTag.src = this.dataset.audioSrc;
        sourceTag.type = this.dataset.audioType;
        globalAudioClip.appendChild(sourceTag);
        globalAudioClip.load();
        globalAudioClip.currentTime = 0;
        this.appendChild(globalAudioClip);
        globalAudioClip.style.display = "block";
        break;
      case CLIP_STATE.HIDE:
        if (!globalAudioClip.paused) {
          globalAudioClip.pause();
        }
        globalAudioClip.currentTime = 0;
        globalAudioClip.style.display = "none";
        break;
      default:
        break;
    }
  };
}

function makeSongTiles(arrayData) {
  for (let i = 0; i < arrayData.length; i++) {
    const songDiv = document.createElement("div");
    songDiv.classList.add("song");
    songDiv.addEventListener("mouseenter", toggleClip(CLIP_STATE.SHOW));
    songDiv.addEventListener("mouseleave", toggleClip(CLIP_STATE.HIDE));

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

    songDiv.dataset.audioSrc = arrayData[i].link[1].attributes.href;
    songDiv.dataset.audioType = arrayData[i].link[1].attributes.type;

    const songNum = document.createElement("div");
    songNum.classList.add("number");
    songNum.textContent = i + 1;
    songDiv.appendChild(songNum);

    document.body.appendChild(songDiv);
  }
}
