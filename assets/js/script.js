var searchInput = document.querySelector('#search-input')
var searchBtn = document.querySelector('#search-btn')
var coverArtArr = document.querySelectorAll('.cover-art')
var albumNameArr = document.querySelectorAll('.album-name')
var artistNameEle = document.querySelector('#artist-name')
var searchHistoryEle = document.querySelector('#search-history')
searchBtn.addEventListener('click', function() {
    searchArtist(searchInput.value)
})

function searchArtist(artistName, addToHistory=true) {
    fetch(`http://musicbrainz.org/ws/2/release-group?query=artist:"${artistName}"%20AND%20NOT%20secondarytype:*%20AND%20primarytype:album&fmt=json`)
    .then(function (response) { return response.json()} )
    .then(function(searchResult) {
        var albumsArr = searchResult["release-groups"]
        var artistName = albumsArr[0]["artist-credit"][0].name

        console.log(addToHistory)

        if (addToHistory) {
            addSearchHistory(artistName)
            renderSearchHistory()
        }

        if (albumsArr === []) {
            alert("No artist found!")
        }
        artistNameEle.innerText = artistName
        for (let i = 0; i < albumsArr.length; i++) {
            const albumObj = albumsArr[i].releases[0];
            var albumID = albumObj.id
            displayCover(albumID, i)
            displayAlbumName(albumObj.title, i)
        }
        console.log('hi')
    })
}

function displayCover(MBID, index) {
    fetch(`http://coverartarchive.org/release/${MBID}`)
    .then(function (response) { return response.json()} )
    .then(function(searchResult) {
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
    console.log(`adding ${item}`)
    var searchHistory = getSearchHistory()
    searchHistory.unshift(item)
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
}

function renderSearchHistory() {
    searchHistoryEle.innerHTML = ''
    let searchHistoryArr = getSearchHistory()
    console.log(searchHistoryArr[0])
    for (let i = 0; i < searchHistoryArr.length; i++) {
        // newListItem in loop because otherwise the text of the li element changes, rather than making a new element for each array index
        var artistName = searchHistoryArr[i]
        let newListItem = document.createElement('li')
        newListItem.innerHTML = `<button onclick='searchArtist("${artistName}", false)'>${artistName}</button>`
        searchHistoryEle.appendChild(newListItem)
    }
}
renderSearchHistory()