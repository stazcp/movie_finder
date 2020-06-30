import "./styles.css";

const APIKEY = "6d46d44f7f8f21704305048480d2f128";
const baseURL = "https://api.themoviedb.org/3/";
let poster_size = "w300";
let baseImageURL = null;
let page = 1;
let totalPages = 0;
let searchID = "popular";
let searchValue = null;
let searchForm = document.getElementById("search");
let infoModal = document.getElementById("infoModal");
let closeModal = infoModal.querySelector("button");

//event.preventDefault
//init is called at the bottom
const init = () => {
  console.log("initializing");
  console.log(document.querySelector("output"));
  if (document.querySelector("output") === null) {
    getConfig();
    setPage();
  }
  //event listeners
  document.getElementById("nextPageBtn").addEventListener("click", e => {
    getNextPage();
  });
  document.getElementById("prevPageBtn").addEventListener("click", e => {
    getPrevPage();
  });
  // request a specific page, results don't persist!
  document.getElementById("goToPage").addEventListener("click", e => {
    e.preventDefault();
    page = document.getElementById("getPageNo").selectPage.value;
    getMovies();
  });
  // the id of dropdown ele will be used to retrieve relative movies
  document.getElementById("categories").addEventListener("click", e => {
    searchID = e.target.id;
    searchValue = null;
    page = 1;
    // setPage();
    getMovies();
  });
  //when a movie is searched for
  searchForm.addEventListener("submit", event => {
    event.preventDefault(); //prevents page from refreshing after getting results
    searchValue = searchForm.search.value;
    page = 1;
    setPage();
    document.querySelector("h4").innerText = "";
    runSearch(searchValue);
  });
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

//display's page numbers and category
const setPage = () => {
  document.getElementById("currentPage").innerText = page;
  document.getElementById("nOfPages").innerText = totalPages;
  document.querySelector("h4").innerText = capitalize(searchID);
};

const getNextPage = () => {
  page++;
  setPage();
  if (searchValue === null) {
    getMovies();
  } else {
    runSearch(searchValue);
  }
};

const getPrevPage = () => {
  page--;
  setPage();
  if (page > 0) {
    if (searchValue === null) {
      getMovies();
    } else {
      runSearch(searchValue);
    }
  }
};

const getMovies = () => {
  let movieArr = [];
  console.log(`get page: ${page}`);
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
      setPage();
      displayPosters(movieArr);
    })
    .catch(err => console.log(err));
};

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
  if (data.length < 1) {
    document.getElementById("output").innerHTML =
      "<h1>No movies found, please try again.</h1>";
    document.querySelector("h4").innerText = "";
    return null;
  }
  document.getElementById("output").innerHTML = null;
  data.map(movie => {
    if (!movie.poster_path) return undefined;
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
