let page = 1;
let maxPage;
let infiniteScroll;

const translations = {
    en: {
      trending: "Trend",
      seeMore: "See more",
      categories: "Categories",
      favorites: "Favorites movies",
      similar: "Similar movies"
    },
    es: {
      trending: "Tendencia",
      seeMore: "Ver más",
      categories: "Categorías",
      favorites: "Películas favoritas",
      similar: "Películas similares"
    },
    pt_BR: {
      trending: "Tendência",
      seeMore: "Ver mais",
      categories: "Categorias",
      favorites: "Filmes favoritos",
      similar: "Filmes similares"
    },
  };
  

searchFormBtn.addEventListener('click', () => {
    location.hash = '#search=' + searchFormInput.value;
  });

trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
});
  
arrowBtn.addEventListener('click', () => {
    if(location.hash.startsWith('#search')){
        history.go(-2);
        console.log('search: go back')
    }
    else if(location.hash.startsWith("#")){
        history.back();
        console.log('go home')
    }else{
         history.go(-1);
         console.log('go back');
    }
})

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('DOMContentLoaded', function () {
    const langContent = translations[navLanguage.split('-')[0]] || translations.en;
   console.log(navLanguage.split('-')[0]);
    document.querySelector('.trendingPreview-title').textContent = langContent.trending;
    document.querySelector('.trendingPreview-btn').textContent = langContent.seeMore;
    document.querySelector('.categoriesPreview-title').textContent = langContent.categories;
    document.querySelector('.liked-title').textContent = langContent.favorites;
    document.querySelector('.relatedMovies-title').textContent = langContent.similar;
  });
  
/* window.addEventListener('scroll', infiniteScroll, false);     */


function navigator(){
    console.log({location});

    if(infiniteScroll){
        window.removeEventListener('scroll', infiniteScroll, {passive: false});
        infiniteScroll = undefined;
    }
    if(location.hash.startsWith('#trends')){
        trendsPage();
    }else if(location.hash.startsWith('#search=')){
        searchPage();
    }else if(location.hash.startsWith('#movie=')){
        moviePage();
    }else if(location.hash.startsWith('#category=')){
        categoriesPage();
    }
    else{
        homePage();
    }

    window.scroll(0,0);

    if(infiniteScroll){
        window.addEventListener('scroll', infiniteScroll, {passive: false});
    }
}

function homePage() {
    console.log('Home!!');
  
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
  
    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    
    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
  }

function trendsPage(){
    console.log('TRENDS!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
  
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = "Trends";
    getTrendingMovies();
    infiniteScroll = getPaginatedTrendingMovies;
}

function searchPage(){
    console.log('Search!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  const query = location.hash.split('=')[1];
  const nameMovie = query.replaceAll('%20', ' ');
  console.log(`search the movie ${nameMovie}`);
  getMovieBySearch(nameMovie);

  infiniteScroll = getPaginatedMoviesBySearch(nameMovie);
}

function moviePage(){
    console.log('Movie!!');

    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
  
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);
}

function categoriesPage(){
    console.log('categories!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  const [_, categoryData] = location.hash.split('=');
  const [categoryId, categoryName] = categoryData.split('-');
  const newName = categoryName.replace('%20', ' ');
  headerCategoryTitle.innerHTML = newName   ;

  getMoviesByCategory(categoryId);
  infiniteScroll = getPaginatedMoviesByCategory(categoryId);

  decodeStringInPage();
}

