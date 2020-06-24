import "./styles.css";

// document.getElementById("app").innerHTML = `
// <h1>Hello Vanilla!</h1>
// <div>
//   We use the same configuration as Parcel to bundle this sandbox, you can find more
//   info about Parcel
//   <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
// </div>
// `;
// sample request:
// https://api.themoviedb.org/3/movie/550?api_key=6d46d44f7f8f21704305048480d2f128

/**
Movie poster base URL: http://image.tmdb.org/t/p/w185//nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg
Get popular movies: https://api.themoviedb.org/3/movie/popular?api_key=3e12504afe592b359b01ff7d91ac166f&language=en-US&page=1
Search for movie: https://api.themoviedb.org/3/search/movie?api_key=3e12504afe592b359b01ff7d91ac166f&language=en-US&query=${query}&page=1&include_adult=false
*/

const APIKEY = "6d46d44f7f8f21704305048480d2f128";
const baseURL = "https://api.themoviedb.org/3/";
let poster_size = "w300";
let baseImageURL = null;
let searchForm = document.getElementById("search");
let posterDisplay = false; // if no posters are displayed currently, we will want to get some

const getConfig = () => {
  let url = "".concat(baseURL, "configuration?api_key=", APIKEY);
  fetch(url)
    .then(result => {
      return result.json();
    })
    .then(data => {
      baseImageURL = data.images.secure_base_url;
      console.log("config:", data);
      if (posterDisplay === false) {
        nowPlaying();
      }
    })
    .catch(err => console.log(err));
};

getConfig();

const nowPlaying = () => {
  let url = "".concat(
    baseURL,
    "movie/now_playing?api_key=",
    APIKEY,
    "&language=en-US"
  );
  fetch(url)
    .then(result => result.json())
    .then(data => {
      displayPosters(data);
    })
    .catch(err => console.log(err));
};

// search result only appears for a millisecond!
const runSearch = keyword => {
  let url = "".concat(
    baseURL,
    "search/movie?api_key=",
    APIKEY,
    "&query=",
    keyword
  );
  fetch(url)
    .then(result => result.json())
    .then(data => {
      //process the returned data
      displayPosters(data);
    })
    .catch(err => console.log(err));
};

//search event listener, triggers a search
searchForm.addEventListener("submit", searchMovie => {
  let searchValue = searchForm.search.value;
  document.querySelector("h1").innerText = "";
  runSearch(searchValue);
});

const displayPosters = data => {
  document.getElementById("output").innerHTML = null;
  for (let i = 0; i < data.results.length; i++) {
    let poster = `${baseImageURL}${poster_size}${data.results[i].poster_path}`;
    document.getElementById("output").innerHTML += `<img src=${poster}>`;
  }
  posterDisplay = true;
  window.stop(); // had to put this here otherwise page will reset automatically!
};

//do I need event listener, document onready state?
