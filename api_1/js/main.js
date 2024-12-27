
"use strict";
const baseURL = "https://api.themoviedb.org/3";
const apiToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOWIxYjMyZjA1NGMyNGFlOTZlMDAwOGRkOTM0NmQ2NyIsIm5iZiI6MTczNDY0NjY0Ny45NjEsInN1YiI6IjY3NjQ5Yjc3YjA0YmVmYzFkZWViYzE1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CLXpMNJXYstg7J402PBkXRBi1DkKJkQNki6I2IOgK0g";
const wrapper = document.querySelector(".collection__row");
let search = document.getElementById("search-field");
let select = document.getElementById("select-category")
wrapper.innerHTML = "";

// categories

let categories = [];

let payload = {
    search: "",
    value: ""
}

const options = {
    method: 'GET',
    headers: {
      'Content-type' : 'application/json',
      Authorization: `Bearer ${apiToken}` 
    }
  };

const fetchCategories = async () => {
    try {
        let res = await fetch(`${baseURL}/genre/movie/list`, options);
        let categoriesData = await res.json()

        categoriesData.genres.forEach(function(category){
            categories.push({id: category.id, name: category.name})
        })

        // add categories in select input field
        categories.map(function(selectOption){
            let option = document.createElement("option");
            option.value = selectOption.id;
            option.textContent = selectOption.name;
            select.appendChild(option)
        })
        
        
    } catch (error) {
        console.log(error);
    }
}
fetchCategories()



const fetchMoviesData = async () => {
    try { 
        let res = await fetch(`${baseURL}/discover/movie`, options);
        let moviesRes = await res.json();
        getMoviesData(moviesRes.results);
    } catch (err) {
        console.log(err)
    }
}
fetchMoviesData()



const getMoviesData = (moviesData) => {
    wrapper.innerHTML = "";
    moviesData.forEach(function(movie){
        let div = document.createElement("div");
        div.className = "card";
        let genreName = movie.genre_ids.map(function(genreId){
            let category = categories.find(function(category){
                return category.id === genreId
            })

            return category ? category.name : ""
         }).filter(genre => genre !== "");

         console.log(genreName)


        div.innerHTML = `
            <div class="card__img-wrap">
                <img src=https://image.tmdb.org/t/p/w500/${movie.poster_path} alt="">
            </div>
            <div class="card__cap">
                <div class="card__categ-wrap">
                     <a href="" class='category'>${genreName.join("</a><a href='' class='category'>")}</a>
                    
                </div>
                <h3 class="card__title">${movie.title}</h3>
                <p class="card__desc">${movie.overview.slice(0, 130)}...</p>
            </div>
        `;

        wrapper.appendChild(div)
    })

}

// search payload
search.addEventListener("input", function(){
    let inputValue = search.value.toLowerCase();
    payload.search = inputValue;
    searchFilter()
})

let searchFilter = async ()=> {
    try {
        let res= await fetch(`${baseURL}/search/movie?query=${encodeURIComponent(payload.search)}`, options)
         let searchResult = await res.json()
        getMoviesData(searchResult.results)
    } catch (error) {
       console.log(error);
    }
}


// select categories payload
select.addEventListener("change", function(){
    let movieType = select.value;
    console.log(movieType);
    
    payload.type = movieType;
    selectFilter()
})

const selectFilter = async() => {
    try { 
        let res = await fetch(`${baseURL}/discover/movie?with_genres=${encodeURIComponent(payload.type)}`, options);
        let moviesRes = await res.json();
        getMoviesData(moviesRes.results);
    } catch (err) {
        console.log(err)
    }
}
