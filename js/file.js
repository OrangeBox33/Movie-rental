let text;
let page = 1;
let timer0;
let storesArr = JSON.parse(localStorage.getItem(0)) || [];
const history = document.getElementsByClassName("history");
//console.log(history[0])

for (let k = storesArr.length - 1; k >= 0; k--) {
    let block = document.createElement("div");
    history[0].appendChild(block);
    block.classList.toggle('block');

    let aHistory = document.createElement("span");
    block.appendChild(aHistory);
    aHistory.textContent = storesArr[k];
}



const main = document.getElementById("main");
const inputForm = document.getElementById("input-form");
const inputHistory = document.getElementsByClassName('block');
const close = document.getElementById("close");



const STATE_SEARCH = 'search';
const STATE_SEARCH_ACTIVE = 'search_active';
const STATE_SEARCH_LIVE = 'search_live';
const STATE_SEARCH_NOT_FOUND = 'search_not_found';
const STATE_SCROLL = 'scroll';

let state = STATE_SEARCH;
//let storesArr = [];



function buildMovie(url, name, year, id) {
    let genre;
    let rating;
    //console.log(info(id))
    info(id).then(value => {
        genre = value[0];
        rating = value[1];
    });
    //console.log(info(id))

    let image = document.createElement("div");

    let title = document.createElement("div");
    image.appendChild(title);
    title.classList.toggle('blockFilm_adv');

    let nameOfFilm = document.createElement("h1");
    image.appendChild(nameOfFilm);
    nameOfFilm.classList.toggle('span1');

    let ratingOfFilm = document.createElement("div");
    title.appendChild(ratingOfFilm);
    ratingOfFilm.classList.toggle('span4');

    let imgRating = document.createElement("IMG");
    title.appendChild(imgRating);
    imgRating.classList.toggle('img');

    let genreOfFilm = document.createElement("span");
    title.appendChild(genreOfFilm);
    genreOfFilm.classList.toggle('span2');

    let yearOfFilm = document.createElement("span");
    title.appendChild(yearOfFilm);
    yearOfFilm.classList.toggle('span3');


    let newImg = new Image;
    newImg.onload = function() {
        //console.log('55');
        image.src = this.src;
    }
    newImg.src = url;
    //console.log(newImg.src);

    if (newImg.src[0] === 'h') {
        
        image.classList.add("blockFilm");
        image.style.background = `url("${url}")`;

        image.addEventListener("mouseover", function () {
            document.body.style.cursor = "pointer";
            image.style.background = `linear-gradient( 180deg, rgba(0, 0, 0, 0) 26.43%, rgba(0, 0, 0, 0.8) 72.41% ), url("${url}")`;
            nameOfFilm.textContent = name;
            yearOfFilm.textContent = year;
            genreOfFilm.textContent = genre;
            ratingOfFilm.textContent = rating;
            const currentRatingImg = currentRating (rating);
            imgRating.src = "img/png/r0" + currentRatingImg + ".png";
            imgRating.style.display = 'inline';
        });
        image.addEventListener("mouseout", function() {
            document.body.style.cursor = "auto";
            image.style.backgroundImage = `url("${url}")`;
            nameOfFilm.textContent = '';
            yearOfFilm.textContent = '';
            genreOfFilm.textContent = '';
            ratingOfFilm.textContent = '';
            imgRating.style.display = 'none';
        });

        image.addEventListener("click", () => {
            window.open("https://www.imdb.com/title/" + id);
        });

    } else {
        image.classList.add("blockNoWords"); 
        nameOfFilm.textContent = name;
        yearOfFilm.textContent = year;
        genreOfFilm.textContent = genre;
    }



    //console.log(nameOfFilm)


    return image;
}

function mainClick() {
    let classOfmain = main.classList.value;
    if (classOfmain === STATE_SEARCH) {
        main.classList.remove(STATE_SEARCH);
        main.classList.add(STATE_SEARCH_ACTIVE);    
    }
}



async function info (id) {
    const data = await fetch(
        `http://www.omdbapi.com/?type=movie&apikey=b8c60d7d&i=${id}`
    ).then(
        response => response.json()
    );
    return [data.Genre, data.imdbRating];
}









async function mainSubmit (event) {

        if (typeof event === 'object') {
            text = event.target[0].value;
            event.preventDefault();
        } else { 
            text = event;
        }

        if (page === 1) {
            const films = document.getElementById('films');
            films.style.display = 'none';
            main.style.position = 'fixed';
            const loader = document.getElementById('loader');
            loader.classList.add('lds-default');
        }

        const data = await fetch(
            `http://www.omdbapi.com/?type=movie&apikey=b8c60d7d&page=${page}&s=${text}`
        ).then(
            response => {
                loader.classList.remove('lds-default');
                films.classList.add('films');
                return response.json();
            }
        );

        if (data.Search) {
            //console.log(data.Search);
            main.classList.remove(STATE_SEARCH_ACTIVE);
            main.classList.remove(STATE_SEARCH_NOT_FOUND);
            main.classList.add(STATE_SEARCH_LIVE);
            main.style.position = 'relative';
            films.style.display = 'inline';
            pictures = document.getElementsByClassName("pictures")[0];

            if (!storesArr.includes(text.toLowerCase())) {
                storesArr.unshift(text.toLowerCase());
                localStorage.setItem(0, JSON.stringify(storesArr));
                storesArr = JSON.parse(localStorage.getItem(0)) || [];
                let block = document.createElement("div");
                history[0].appendChild(block);
                block.classList.toggle('block');
                let aHistory = document.createElement("span");
                block.appendChild(aHistory);
                aHistory.textContent = storesArr[0];
            }
            
            if (page === 1) {
                deleteBlock(document.getElementsByClassName('blockFilm'));
                deleteBlock(document.getElementsByClassName('blockNoWords'));
            }


            

            const qtyOfFilms = document.getElementsByTagName('h2')[0];
            qtyOfFilms.textContent = 'Нашли ' + data.totalResults + ' ' + getDeclension(data.totalResults);



            for (let movie of data.Search) {
                const image = buildMovie(movie.Poster, movie.Title, movie.Year, movie.imdbID);
                //console.log(movie);
                //console.log(data.Search)
                pictures.appendChild(image);
            }
            
            for (let i = 0; i < inputHistory.length; i++) {
                //console.log(i);
                inputHistory[i].addEventListener("mouseover", function () {
                    document.body.style.cursor = "pointer";
                });
                inputHistory[i].addEventListener("mouseout", function() {
                    document.body.style.cursor = "auto";
                });
                inputHistory[i].addEventListener("click", getEvent);
                inputHistory[i].addEventListener("click", getEvent);
            }

        } else {
            if (page === 1) {
                //console.log('data');
                main.classList.remove(STATE_SEARCH_ACTIVE);
                main.classList.remove(STATE_SEARCH_LIVE);
                main.classList.add(STATE_SEARCH_NOT_FOUND);
            }
        }
    
    
    //return stores;
}

//console.log(inputHistory);
for (let i = 0; i < inputHistory.length; i++) {
    //console.log(i);
    inputHistory[i].addEventListener("mouseover", function () {
        document.body.style.cursor = "pointer";
    });
    inputHistory[i].addEventListener("mouseout", function() {
        document.body.style.cursor = "auto";
    });
    inputHistory[i].addEventListener("click", getEvent);
}




function getEvent (preEvent) {
    //console.log(preEvent.path[0]);
    //console.log(preEvent);
    if (preEvent.altKey) {
        //console.log(inputHistory);
        
        //console.log(preEvent.path[1]);
        if (preEvent.path.length === 8) {
            preEvent.path[1].remove();
        } else preEvent.path[0].remove();
        //console.log(storesArr);
        const index = storesArr.indexOf(preEvent.srcElement.textContent);
        storesArr.splice(index, 1);
        //console.log(storesArr);
        localStorage.setItem(0, JSON.stringify(storesArr));
        storesArr = JSON.parse(localStorage.getItem(0)) || [];
    } else {
        //console.log(preEvent.srcElement.textContent);
        //console.log(prevent.textContent);
        //console.log(preEvent)
        preSubmit(preEvent.srcElement.textContent);
    }
}

function deleteBlock (blocks) {
    if (blocks.length !== 0) {
        for (let j = blocks.length - 1; j >= 0; j--) {
            blocks[j].remove();
        }
    }
}

function debounce (event) {
    if (timer0) { 
        //console.log('123');
        clearTimeout(timer0); 
    }
    if (event.key === "Enter") return;
    //console.log(event);
    if (event.srcElement.value) { timer0 = setTimeout(preSubmit, 1000, event.srcElement.value); }
}

function deleteInput (event) {
    clearTimeout(timer0);
    //console.log(event);
    //console.log(event.srcElement.previousElementSibling.value);
    event.srcElement.previousElementSibling.value = '';
}

function currentRating (rating) {
    if (+rating >= 8) { return 5; }
    if (+rating >= 6) { return 4; }
    if (+rating >= 4) { return 3; }
    if (+rating >= 2) { return 2; }
    return 1; 
}

const getDeclension = (count) => {
    count %= 100;
    if (count >= 5 && count <= 20) {
      return 'фильмов';
    }
    count %= 10;
    if (count === 1) {
      return 'фильм';
    }
    if (count >= 2 && count <= 4) {
      return 'фильма';
    }
    return 'фильмов';
}

function preSubmit (text) {
    page = 1;
    mainSubmit(text);
}

inputForm.addEventListener("click", mainClick);
inputForm.addEventListener("submit", preSubmit);
inputForm.addEventListener("keyup", debounce);
close.addEventListener("click", deleteInput);

window.onscroll = function() {
    let scrolled = window.pageYOffset || document.documentElement.scrollTop;
    console.log(scrolled + 'px');
    if (scrolled > 450) {
        main.classList.remove(STATE_SEARCH_LIVE);
        main.classList.add(STATE_SCROLL);  
        //console.log(state)
    } else {
        main.classList.remove(STATE_SCROLL);
        main.classList.add(STATE_SEARCH_LIVE); 
    }
    if (scrolled > 400 + 1200 * (page - 1)) {
        page++;
        mainSubmit(text);
    }
}

