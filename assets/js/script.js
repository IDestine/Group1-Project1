var searchInput = document.querySelector('#search-input')
var searchBtn = document.querySelector('#search-btn')
var coverArtArr = document.querySelectorAll('.cover-art')
searchBtn.addEventListener('click', function() {
    searchArtist(searchInput.value)
})

function searchArtist(artistName) {
    fetch(`http://musicbrainz.org/ws/2/release-group?query=artist:"${artistName}"%20AND%20NOT%20secondarytype:*%20AND%20primarytype:album&fmt=json`)
    .then(function (response) { return response.json()} )
    .then(function(searchResult) {
        var albumsArr = searchResult["release-groups"]
        console.log(albumsArr)
        for (let i = 0; i < albumsArr.length; i++) {
            const albumObj = albumsArr[i];
            var albumID = albumObj.id
            displayCover(albumID, i)
        }
    })
}

function displayCover(MBID, index) {
    fetch(`https://coverartarchive.org/release/${MBID}`)
    .then(function (response) { return response.json()} )
    .then(function(searchResult) {
        console.log(searchResult)
        var imgURL = searchResult.images[0].image
        coverArtArr[index].setAttribute('src', imgURL)
    })
}




// function renderSearchHistory(cityName) {
//     searchHistoryEl.empty();
//     let searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
//     for (let i = 0; i < searchHistoryArr.length; i++) {
//         // newListItem in loop because otherwise the text of the li element changes, rather than making a new element for each array index
//         let newListItem = $("<li>").attr("class", "historyEntry");
//         newListItem.text(searchHistoryArr[i]);
//         searchHistoryEl.prepend(newListItem);
//     }
// }