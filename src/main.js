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

function moviesMaquetation(movies){
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
        movieImg.setAttribute('src',`https://image.tmdb.org/t/p/w300${movie.poster_path}`);

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
    const moviesContainers = moviesMaquetation(movies);
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
    const moviesElements = moviesMaquetation(movies);
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
    const films = moviesMaquetation(movies);
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