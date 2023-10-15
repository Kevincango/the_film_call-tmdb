window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator(){
    console.log({location});

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
        home();
    }
}

function home(){
    console.log('home!');

    getTrendingMoviesPreview();
    getCategoriesPreview();
}

function trendsPage(){
    console.log('trends');
}

function searchPage(){
    console.log('search!');
}

function moviePage(){
    console.log('movie!');
}

function categoriesPage(){
    console.log('home!');
}

