import "./styles.css";

const APIKEY = "6d46d44f7f8f21704305048480d2f128";
const baseURL = "https://api.themoviedb.org/3/";
let poster_size = "w300";
let baseImageURL = null;
let searchForm = document.getElementById("search");

const getConfig = () => {
  let url = "".concat(baseURL, "configuration?api_key=", APIKEY);
  fetch(url)
    .then(result => {
      return result.json();
    })
    .then(data => {
      baseImageURL = data.images.secure_base_url;
      popularMovies();
    })
    .catch(err => console.log(err));
};

getConfig();

const popularMovies = () => {
  let movieArr = [];
  for (let i = 0; i < 10; i++) {
    let url = `${baseURL}movie/popular?api_key=${APIKEY}&language=en-US&page=${i}`;
    fetch(url)
      .then(result => result.json())
      .then(data => {
        movieArr.push(...data.results);
        console.log(data);
        displayPosters(movieArr);
      })
      .catch(err => console.log(err));
  }
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
searchForm.addEventListener("submit", event => {
  event.preventDefault(); //prevents page from refreshing after getting results
  let searchValue = searchForm.search.value;
  document.querySelector("h4").innerText = "";
  runSearch(searchValue);
});

const onMouseOverMovie = movie => {
  console.log(movie.title);
};

const displayPosters = data => {
  if (data.length < 1) return;
  document.getElementById("output").innerHTML = null;
  data.map(movie => {
    let poster = `${baseImageURL}${poster_size}${movie.poster_path}`;
    let moviePoster = document.createElement("img");
    moviePoster.src = poster;
    moviePoster.onmouseover = () => onMouseOverMovie(movie); //wrapping the func to not execute without click
    moviePoster.toggle = "popover";

    document.getElementById("output").appendChild(moviePoster);
    return null;
  });
};
