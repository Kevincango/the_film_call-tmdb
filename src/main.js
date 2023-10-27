const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    Headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
    }
});

//helpers

const lazyLoading = new IntersectionObserver((entries)=>{
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
    })
})

function moviesMaquetation(movies, lazy = false){
    let moviesContainers = [];

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`;
        })
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(lazy ? 'data-img' : 'src',`https://image.tmdb.org/t/p/w300${movie.poster_path}`);
        movieImg.addEventListener('error', ()=> {
            movieImg.setAttribute('src', '../assets/server-imagenotfound.png')
            const movieSpan = document.createElement('span');
            const movieTitle = document.createTextNode(movie.title);
            movieContainer.appendChild(movieSpan);
            movieSpan.appendChild(movieTitle);

        })
        if(lazy){
            lazyLoading.observe(movieImg);
        }
        
        movieContainer.appendChild(movieImg);
        moviesContainers.push(movieContainer);
    });

    return moviesContainers;
}

function createCategories(categories, container){
    container.innerHTML = "";

    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', ()=> {
            location.hash = `#category=${category.id}-${category.name}`;
        })
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
        
    })
}

async function getTrendingMoviesPreview(){
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    trendingMoviesPreviewList.innerHTML = "";
    const moviesContainers = moviesMaquetation(movies, true);
    moviesContainers.forEach(movie => {
        trendingMoviesPreviewList.appendChild(movie);
    })

}

async function getCategoriesPreview(){
    const {data} = await api('genre/movie/list');
    const categories = data.genres;
    //categoriesPreviewList;
    createCategories(categories,categoriesPreviewList);
}

async function getMoviesByCategory(id){
    const {data} = await api('discover/movie',{
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;
    
    genericSection.innerHTML = "";
    const moviesElements = moviesMaquetation(movies, true);
    moviesElements.forEach(movie => {
        genericSection.appendChild(movie);
    })
}

async function getMovieBySearch(query){
    const {data} = await api('search/movie', {
        params: {
            query,
        }
    });
    const movies = data.results;
    genericSection.innerHTML = "";
    const films = moviesMaquetation(movies, true);
    films.forEach(film => {
        genericSection.appendChild(film);
    })
}

async function getTrendingMovies(){
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    genericSection.innerHTML = "";
    const moviesContainers = moviesMaquetation(movies);
    moviesContainers.forEach(movie => {
        genericSection.appendChild(movie);
    })

    const btnLoadMore = document.createElement('button');
    btnLoadMore.innerText = 'Load more';
    btnLoadMore.addEventListener('click', () => {
        btnLoadMore.style.display = 'none';
        getPaginatedTrendingMovies();
    });
    genericSection.appendChild(btnLoadMore);
}

let page = 1;

async function getPaginatedTrendingMovies(){
    page++;
    const {data} = await api('trending/movie/day', {
        params: {
            page,
        },
    });
    const movies = data.results;
    const moviesContainers = moviesMaquetation(movies);
    moviesContainers.forEach(movie => {
        genericSection.appendChild(movie);
    })
    const btnLoadMore = document.createElement('button');
    btnLoadMore.innerText = 'Load more';
    btnLoadMore.addEventListener('click', () => {
        btnLoadMore.style.display = 'none';
        getPaginatedTrendingMovies();
    });
    genericSection.appendChild(btnLoadMore);
}

async function getMovieById(id){
    const {data: movie} = await api(`movie/${id}`);

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);
    getSimilarMoviesById(id);
}

async function getSimilarMoviesById(id){
    const {data} = await api(`movie/${id}/similar`);
    const similarMovies = data.results;

    relatedMoviesContainer.innerHTML = "";
    const relatedMovies = moviesMaquetation(similarMovies);
    relatedMovies.forEach(movie => {
        relatedMoviesContainer.appendChild(movie);
    })
}