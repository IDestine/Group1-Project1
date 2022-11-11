var searchInput = document.querySelector("#search-input");
var searchBtn = document.querySelector("#search-btn");
var coverArtArr = document.querySelectorAll(".cover-art");
var albumNameArr = document.querySelectorAll(".album-name");
var artistNameEle = document.querySelector("#artist-name");
var searchHistoryEle = document.querySelector("#search-history");
searchBtn.addEventListener("click", function () {
  searchArtist(searchInput.value);
});

function searchArtist(artistName, addToHistory = true) {
  fetch(
    `http://musicbrainz.org/ws/2/release-group?query=artist:"${artistName}"%20AND%20NOT%20secondarytype:*%20AND%20primarytype:album&fmt=json`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (searchResult) {
      var albumsArr = searchResult["release-groups"];
      var artistName = albumsArr[0]["artist-credit"][0].name;

      console.log(addToHistory);

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
        displayCover(albumID, i);
        displayAlbumName(albumObj.title, i);
      }
      console.log("hi");
    });
}

function displayCover(MBID, index) {
  fetch(`https://coverartarchive.org/release/${MBID}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (searchResult) {
      var imgURL = searchResult.images[0].image;
      coverArtArr[index].setAttribute("src", imgURL);
    });
}

function displayAlbumName(name, index) {
  albumNameArr[index].innerHTML = name;
}

function getReccomendations(artistName) {
    const request = {
        headers: {
            "Authorization": "Bearer 444444-NoStopMu-WI4FVWTE",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:5500"
        }
    }
//   fetch(
//     `https://tastedive.com/api/similar?q=band:${artistName}&type=music&info=1`, request
//   )
//     .then(function (response) {
//         console.log(response.headers)
//       return response.json();
//     })
//     .then(function (searchResults) {
//       console.log(searchResults);
//     });
    
    const promise = new Promise((resolve, reject) => {
        return setTimeout(() => {
            if (request && request.headers["Authorization"] === "Bearer 444444-NoStopMu-WI4FVWTE" && typeof artistName === "string" && true) {
                return resolve({"Similar": {
                    "Info": [
                      {
                        "Name": "Red Hot Chili Peppers",
                        "Type": "music"
                      },
                      {
                        "Name": "Pulp Fiction",
                        "Type": "movie"
                      }
                    ],
                    "Results": [
                      {
                        "Name": "Nirvana",
                        "Type": "music"
                      },
                      {
                        "Name": "Foo Fighters",
                        "Type": "music"
                      },
                      {
                        "Name": "System Of A Down",
                        "Type": "music"
                      },
                      {
                        "Name": "The White Stripes",
                        "Type": "music"
                      },
                      {
                        "Name": "Green Day",
                        "Type": "music"
                      },
                      {
                        "Name": "Oasis",
                        "Type": "music"
                      },
                      {
                        "Name": "Incubus",
                        "Type": "music"
                      },
                      {
                        "Name": "Linkin Park",
                        "Type": "music"
                      },
                      {
                        "Name": "Muse",
                        "Type": "music"
                      },
                      {
                        "Name": "The Offspring",
                        "Type": "music"
                      },
                      {
                        "Name": "The Beatles",
                        "Type": "music"
                      },
                      {
                        "Name": "Rage Against The Machine",
                        "Type": "music"
                      },
                      {
                        "Name": "Blink-182",
                        "Type": "music"
                      },
                      {
                        "Name": "Pearl Jam",
                        "Type": "music"
                      },
                      {
                        "Name": "The Killers",
                        "Type": "music"
                      },
                      {
                        "Name": "Radiohead",
                        "Type": "music"
                      },
                      {
                        "Name": "Led Zeppelin",
                        "Type": "music"
                      },
                      {
                        "Name": "Coldplay",
                        "Type": "music"
                      },
                      {
                        "Name": "Gorillaz",
                        "Type": "music"
                      },
                      {
                        "Name": "Metallica",
                        "Type": "music"
                      }
                    ]
                  }})
                }
                return reject()
        }, 3000);
    })
    return promise.then( (data) => console.log(data))
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
