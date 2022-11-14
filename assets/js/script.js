var urlPrefix = (!document.location.href.includes('https'))?'https://corsanywhere.herokuapp.com/':''

var searchInput = document.querySelector("#search-input");
var searchBtn = document.querySelector("#search-btn");
var searchHistoryEle = document.querySelector("#search-history");
var imgBtnArr = document.querySelectorAll(".img-button")
var coverArtArr = document.querySelectorAll(".cover-art");
var albumNameArr = document.querySelectorAll(".album-name");
var artistNameEle = document.querySelector("#artist-name");
var recArtistImgArr = document.querySelectorAll(".rec-artist-img")
var recArtistNameArr = document.querySelectorAll(".rec-artist-name")
searchBtn.addEventListener("click", function () {
  searchArtist(searchInput.value);
});
searchInput.addEventListener("keypress", (event) => {
  if (event.key === 'Enter') {
    searchArtist(searchInput.value)
  }
})

async function get(url) {
  return await fetch(url)
  .then( (response) => {
    if (!response.ok) { return }
    return response.json()
  })
  .then( (data) => {
    return data
  })
}

async function searchArtist(artistName, addToHistory = true) {
  searchInput.value = ''
  clearButtons()
  artistNameEle.innerText = ''
  clearAll(coverArtArr)
  clearAll(albumNameArr)
  clearAll(recArtistImgArr)
  clearAll(recArtistNameArr)

  document.querySelector(':root').style.setProperty('--results-display', 'flex')

  var searchResult = await get(`https://musicbrainz.org/ws/2/release-group?query=artist:"${artistName}"%20AND%20NOT%20secondarytype:*%20AND%20primarytype:album&fmt=json`)

  if (searchResult.count === 0) {
    alert("No artist found!");
  }
  console.log(searchResult)

  var releaseGroupArr = searchResult["release-groups"];
  var artistName = releaseGroupArr[0]["artist-credit"][0].name;

  artistNameEle.innerText = artistName;

  if (getSearchHistory()[0] === artistName) {
    addToHistory = false
  }
  if (addToHistory) {
    addSearchHistory(artistName);
    renderSearchHistory();
  }

  for (let i = 0; i < coverArtArr.length; i++) {
    var releaseGroup = releaseGroupArr[i];
    if (releaseGroup) {
      displayCover(releaseGroup, coverArtArr[i]);
      displayAlbumName(releaseGroup.title, i);
    }
  }
  displayRecArtists(artistName);
}

function clearButtons() {
  for (let i = 0; i < imgBtnArr.length; i++) {
    imgBtnArr[i].style.display = 'none'
  }
}

function clearAll(eleArr) {
  for (let i = 0; i < eleArr.length; i++) {
    ele = eleArr[i]
    if (ele.tagName === 'IMG') {
      ele.setAttribute('src', '');
    }
    else if (ele.tagName === 'P') {
      ele.innerText = ''
    }
  }
}

async function displayCover(releaseGroup, imgEle) {
  imgEle.parentElement.style.display = 'inline-block'

  var imgURL = '';
  for (let i = 0; i < releaseGroup.releases.length; i++) {
    var release = releaseGroup.releases[i];
    var searchResult = await get(`https://coverartarchive.org/release/${release.id}`)
    if (searchResult) { 
      imgURL = searchResult.images[0].image;
      break;
    }
  }
  imgEle.setAttribute('src', imgURL);
}

function displayAlbumName(name, index) {
  albumNameArr[index].innerHTML = name;
}

async function displayRecArtists(artistName)  {
  var searchResults = await get(`${urlPrefix}https://tastedive.com/api/similar?q=${artistName}&type=music&k=444444-NoStopMu-WI4FVWTE`)
  var resultsList = searchResults.Similar.Results
    for (let i = 0; i < recArtistNameArr.length; i++) {
      console.log(resultsList)
      var name = resultsList[i].Name
      recArtistNameArr[i].innerText = name

      var artistImgEle = recArtistImgArr[i]
      var releaseGroups = await getAlbums(name)

      artistImgEle.parentElement.setAttribute('onclick', `searchArtist('${name}')`)
      console.log(artistImgEle)

      displayCover(releaseGroups[0], artistImgEle)
    }
}

async function getAlbums(artistName) {
    var results = await get(`https://musicbrainz.org/ws/2/release-group?query=artist:"${artistName}"%20AND%20NOT%20secondarytype:*%20AND%20primarytype:album&fmt=json`)
    return results["release-groups"]
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