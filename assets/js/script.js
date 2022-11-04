/*** Function to simplify fetching ***/
async function get(url) {
    response = await fetch(url)
    data = await response.json()
    return data
}

/*** Functions For MusicBrainz ***/
async function searchArtist(artist) {
    var data = await get(`https://musicbrainz.org/ws/2/artist?query=${artist}&fmt=json&limit=1`)
    return data.artists[0]
}

var coldplay = searchArtist('coldplay')
console.log(coldplay.id)
// do stuff with coldplay