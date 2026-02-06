/*
go to the url http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/topsongs/limit=25/json

get each of the songs, and make a div containing
the song title, the artist, and an image of the album

advanced:
on hover, show the description of the song or some other additional piece of info.  make it show up above the existing info in the box.
*/

$("document").ready(initiateApp);

function initiateApp() {
  var ajaxOptions = {
    url: "http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/topsongs/limit=30/json",
    dataType: "json",
    success: function (response) {
      makeSongTiles(response.feed.entry);
    },
    error: function () {
      var error = $("<div>").addClass("error");
      var errorTitle = $("<h3>").text("Error");
      var errorText = $("<p>").text(
        "Sorry, there was an error retrieving data from iTunes",
      );

      error.append(errorTitle, errorText);
      $("body").append(error);
    },
  };
  $.ajax(ajaxOptions);
}

function showClip(e) {
  e.preventDefault();
  $(this).children(".audioClip").show();
}

function hideClip(e) {
  e.preventDefault();
  var thisClip = $(this).children(".audioClip");
  if (!thisClip.prop("paused")) {
    thisClip[0].pause();
  }
  thisClip.hide();
}

function makeSongTiles(arrayData) {
  for (var i = 0; i < arrayData.length; i++) {
    var songDiv = $("<div>").addClass("song");
    songDiv.hover(showClip, hideClip);

    var songImgProps = {
      src: arrayData[i]["im:image"][2].label,
      class: "coverArt",
      height: 170 + "px",
    };
    var songImg = $("<img>", songImgProps);
    songDiv.append(songImg);

    var artistDivProps = {
      class: "artist",
      text: arrayData[i]["im:artist"].label,
    };
    var artistDiv = $("<div>", artistDivProps);
    songDiv.append(artistDiv);

    var titleDivProps = {
      class: "songTitle",
      text: arrayData[i]["im:name"].label,
    };
    var titleDiv = $("<div>", titleDivProps);
    songDiv.append(titleDiv);

    var audioClipProps = {
      controls: "",
      text: "sorry, your browser sucks.",
      class: "audioClip",
    };
    var audioClip = $("<audio>", audioClipProps);
    var sourceTagProps = {
      src: arrayData[i].link[1].attributes.href,
      type: arrayData[i].link[1].attributes.type,
    };
    var sourceTag = $("<source>", sourceTagProps);
    audioClip.append(sourceTag);
    songDiv.append(audioClip);

    var songNumProps = {
      class: "number",
      text: i + 1,
    };
    var songNum = $("<div>", songNumProps);
    songDiv.append(songNum);

    $("body").append(songDiv);
  }
}
