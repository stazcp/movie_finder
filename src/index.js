import "./styles.css";

const APIKEY = "6d46d44f7f8f21704305048480d2f128";
const baseURL = "https://api.themoviedb.org/3/";
let poster_size = "w300";
let baseImageURL = null;
let searchForm = document.getElementById("search");
let infoModal = document.getElementById("infoModal");
let closeModal = infoModal.querySelector("button");
let page = 1;
let currentPage = 1;
let totalPages = 0;
let searchID = "popular";
let searchValue = null;

const init = () => {
  getConfig();
  setPage();
};

const getConfig = () => {
  let url = "".concat(baseURL, "configuration?api_key=", APIKEY);
  fetch(url)
    .then(result => {
      return result.json();
    })
    .then(data => {
      baseImageURL = data.images.secure_base_url;
      getMovies(searchID);
    })
    .catch(err => console.log(err));
};

const capitalize = string => {
  return string
    .split("_")
    .map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
  // return string.charAt(0).toUpperCase() + string.slice(1);
};

const setPage = () => {
  document.getElementById("currentPage").innerText = currentPage;
  document.getElementById("nOfPages").innerText = totalPages;
  document.querySelector("h4").innerText = capitalize(searchID);
};

const getNextPage = () => {
  page++;
  if (searchValue === null) {
    getMovies();
  } else {
    runSearch(searchValue);
  }
  currentPage = page;
  setPage();
};

const getPrevPage = () => {
  if (currentPage > 1) {
    page--;
    if (searchValue === null) {
      getMovies();
    } else {
      runSearch(searchValue);
    }
    currentPage = page;
    setPage();
  }
};

document.getElementById("nextPageBtn").addEventListener("click", e => {
  getNextPage();
});
document.getElementById("prevPageBtn").addEventListener("click", e => {
  getPrevPage();
});

// the id of dropdown will be the id for the url to retrieve relative movies
document.getElementById("categories").addEventListener("click", e => {
  searchID = e.target.id;
  searchValue = null;
  page = 1;
  currentPage = page;
  setPage();
  getMovies();
});

const getMovies = () => {
  let movieArr = [];
  let url = `${baseURL}movie/${searchID}?api_key=${APIKEY}&language=en-US&page=${page}`;
  fetch(url)
    .then(result => result.json())
    .then(data => {
      movieArr.push(...data.results);
      totalPages = data.total_pages;
      setPage();
      displayPosters(movieArr);
    })
    .catch(err => console.log(err));
};

// search result only appears for a millisecond!
const runSearch = keyword => {
  let movieArr = [];
  let url = `${baseURL}search/movie?api_key=${APIKEY}&query=${keyword}&page=${page}&adult=true`;
  fetch(url)
    .then(result => result.json())
    .then(data => {
      //process the returned data
      movieArr.push(...data.results);
      totalPages = data.total_pages;
      console.log(data.total_pages);
      setPage();
      displayPosters(movieArr);
    })
    .catch(err => console.log(err));
};

//search event listener, triggers a search
searchForm.addEventListener("submit", event => {
  event.preventDefault(); //prevents page from refreshing after getting results
  searchValue = searchForm.search.value;
  page = 1;
  currentPage = page;
  setPage();
  document.querySelector("h4").innerText = "";
  runSearch(searchValue);
});

const onClickMovie = movie => {
  showModal(movie);
  closeModal.onclick = hideModal;
};

const showModal = movie => {
  infoModal.style.display = "block";
  infoModal.classList.add("show");
  infoModal.removeAttribute("aria-hidden");
  infoModal.setAttribute("aria-modal", "true");
  document.querySelector("body").classList.add("modal-open");
  document.getElementById("movieTitle").innerText = movie.title;
  document.getElementById("modalBody").innerText = movie.overview;
};

const hideModal = () => {
  infoModal.style.display = "none";
  infoModal.classList.remove("show");
  infoModal.setAttribute("aria-hidden", "true");
  infoModal.removeAttribute("aria-modal");
  document.querySelector("body").classList.remove("modal-open");
};

const displayPosters = data => {
  if (data.length < 1) return;
  document.getElementById("output").innerHTML = null;
  data.map(movie => {
    let poster = `${baseImageURL}${poster_size}${movie.poster_path}`;
    let moviePoster = document.createElement("img");
    moviePoster.src = poster;
    moviePoster.id = movie.id;
    moviePoster.setAttribute("data-toggle", "modal");
    moviePoster.setAttribute("data-target", "infoModal");
    moviePoster.setAttribute("role", "button");

    moviePoster.onclick = () => onClickMovie(movie); //wrapping the func to not execute without click
    document.getElementById("output").appendChild(moviePoster);
    return null;
  });
};

init();
