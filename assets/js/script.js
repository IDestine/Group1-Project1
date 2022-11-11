var searchInput = document.querySelector("#search-input");
var searchBtn = document.querySelector("#search-btn");
var searchHistoryEle = document.querySelector("#search-history");
var coverArtArr = document.querySelectorAll(".cover-art");
var albumNameArr = document.querySelectorAll(".album-name");
var artistNameEle = document.querySelector("#artist-name");
var recArtistNameArr = document.querySelectorAll(".rec-artist-name")
var recArtistImgArr = document.querySelectorAll(".rec-artist-img")
searchBtn.addEventListener("click", function () {
  searchArtist(searchInput.value);
});

function searchArtist(artistName, addToHistory = true) {
  fetch(`http://musicbrainz.org/ws/2/release-group?query=artist:"${artistName}"%20AND%20NOT%20secondarytype:*%20AND%20primarytype:album&fmt=json`)
    .then(function (response) {return response.json();})
    .then(function (searchResult) {
      var albumsArr = searchResult["release-groups"];
      var artistName = albumsArr[0]["artist-credit"][0].name;

      if (addToHistory) {
        addSearchHistory(artistName);
        renderSearchHistory();
      }

      if (albumsArr === []) {
        alert("No artist found!");
      }

      artistNameEle.innerText = artistName;
      for (let i = 0; i < albumsArr.length; i++) {
        const albumObj = albumsArr[i].releases[0];
        var albumID = albumObj.id;
        displayCover(albumID, coverArtArr[i]);
        displayAlbumName(albumObj.title, i);
      }
      console.log("hi");
    });
}

function displayCover(MBID, imgEle) {
  fetch(`https://coverartarchive.org/release/${MBID}`)
    .then(function (response) {
      if (!response.ok) { return }
      return response.json();
    })
    .then(function (searchResult) {
      var imgURL = searchResult.images[0].image || 'https://placeholder.pics/svg/300';
      imgEle.setAttribute("src", imgURL);
    }).catch( (err) => {} )
}

function displayAlbumName(name, index) {
  albumNameArr[index].innerHTML = name;
}

function getReccomendations(artistName) {
    var urlPrefix = (!document.location.href.includes('https'))?'https://corsanywhere.herokuapp.com/':''
  fetch(
    `${urlPrefix}https://tastedive.com/api/similar?q=${artistName}&type=music&info=1&k=444444-NoStopMu-WI4FVWTE`
  )
    .then(function (response) {return response.json();} )
    .then(function (searchResults) {
      searchResults = searchResults.Similar.Results
      displayRecArtists(searchResults)
    });
}

async function displayRecArtists(resultsList)  {
    for (let i = 0; i < recArtistNameArr.length; i++) {
        var name = resultsList[i].Name
        recArtistNameArr[i].innerText = name

        var artistImgEle = recArtistImgArr[i]
        var albums = await getAlbums(name)
        console.log(albums)
        displayCover(albums.id, artistImgEle)
    }
}

async function getAlbums(artistName) {
    albumsArr = await fetch(`http://musicbrainz.org/ws/2/release-group?query=artist:"${artistName}"%20AND%20NOT%20secondarytype:*%20AND%20primarytype:album&fmt=json`)
    .then(function (response) {return response.json();})
    .then( (results) => {
        albumsArr = results["release-groups"]
        return albumsArr
    })
    return albumsArr
}

function getSearchHistory() {
  var result = localStorage.getItem("searchHistory");
  if (result) {
    result = JSON.parse(result);
  } else {
    result = [];
  }
  return result;
}

function addSearchHistory(item) {
  console.log(`adding ${item}`);
  var searchHistory = getSearchHistory();
  searchHistory.unshift(item);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function renderSearchHistory() {
  searchHistoryEle.innerHTML = "";
  let searchHistoryArr = getSearchHistory();
  for (let i = 0; i < searchHistoryArr.length; i++) {
    // newListItem in loop because otherwise the text of the li element changes, rather than making a new element for each array index
    var artistName = searchHistoryArr[i];
    let newListItem = document.createElement("li");
    newListItem.innerHTML = `<button onclick='searchArtist("${artistName}", false)'>${artistName}</button>`;
    searchHistoryEle.appendChild(newListItem);
  }
}
renderSearchHistory();
