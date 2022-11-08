artistName = 'coldplay'

fetch(`http://musicbrainz.org/ws/2/release-group?query=artist:${artistName}%20AND%20NOT%20secondarytype:*%20AND%20primarytype:album&fmt=json`)
.then(function (response) { return response.json()} )
.then(function(searchResult) {
    console.log(searchResult)
})