var searchInput = document.querySelector('#search-input')
var searchBtn = document.querySelector('#search-btn')
var coverArtArr = document.querySelectorAll('.cover-art')
var albumNameArr = document.querySelectorAll('.album-name')
var artistNameEle = document.querySelector('#artist-name')
var searchHistoryEle = document.querySelector('#search-history')
searchBtn.addEventListener('click', function() {
    searchArtist(searchInput.value)
})

function searchArtist(artistName) {
    fetch(`http://musicbrainz.org/ws/2/release-group?query=artist:"${artistName}"%20AND%20NOT%20secondarytype:*%20AND%20primarytype:album&fmt=json`)
    .then(function (response) { return response.json()} )
    .then(function(searchResult) {
        var albumsArr = searchResult["release-groups"]
        if (albumsArr === []) {
            alert("No artist found!")
        }
        console.log(albumsArr)
        artistNameEle.innerText = albumsArr[0]["artist-credit"][0].name
        for (let i = 0; i < albumsArr.length; i++) {
            const albumObj = albumsArr[i].releases[0];
            var albumID = albumObj.id
            displayCover(albumID, i)
            displayAlbumName(albumObj.title, i)
        }
    })
}

function displayCover(MBID, index) {
    fetch(`http://coverartarchive.org/release/${MBID}`)
    .then(function (response) { return response.json()} )
    .then(function(searchResult) {
        console.log(searchResult)
        var imgURL = searchResult.images[0].image
        coverArtArr[index].setAttribute('src', imgURL)
    })
}

function displayAlbumName(name, index) {
    albumNameArr[index].innerHTML = name
}

function getSearchHistory() {
    var result = localStorage.getItem("searchHistory")
    if (result) {
        result = JSON.parse(result)
    }
    else {
        result = []
    }
    return result
}

function addSearchHistory(item) {
    var searchHistory = getSearchHistory()
    searchHistory.unshift(item)
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
}

function renderSearchHistory() {
    searchHistoryEl.empty()
    let searchHistoryArr = getSearchHistory()
    for (let i = 0; i < searchHistoryArr.length; i++) {
        // newListItem in loop because otherwise the text of the li element changes, rather than making a new element for each array index
        let newListItem = $("<li class='historyEntry'>")
        newListItem.text(searchHistoryArr[i])
        searchHistoryEl.prepend(newListItem)
    }
}