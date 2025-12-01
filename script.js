function init(){
    PokemonData();
}

let offset = 0;
let limit = 20;

const loadingSpinner = document.getElementById('loading');
let isLoading = false;

function getColor(type) {
    switch (type) {
        case "grass": return "#78C850";
        case "fire": return "#F08030";
        case "water": return "#6890F0";
        case "bug": return "#A8B820";
        case "poison": return "#A040A0";
        case "electric": return "#F8D030";
        case "ground": return "#E0C068";
        case "fairy": return "#EE99AC";
        case "normal": return "#A8A878";
        case "psychic": return "#F85888";
        case "ice": return "#98D8D8";
        case "dragon": return "#7038F8";
        case "fighting": return "#C03028";
        case "rock": return "#B8A038";
        case "dark": return "#705848";
        default: return "gray";
    }
}

const cache = {};
async function CacheData(url) {
if (cache[url]){
    return cache[url];
} 
const response = await fetch(url);
const data = await response.json();
cache[url] = data;
return data;
}

async function PokemonData(word = "", mode = "reset") {
    const pokemonCard = document.getElementById("pokemoncard");
    spinnerLoad();
    if (mode === "reset") {
        pokemonCard.innerHTML = "";
        offset = 0; 
    }
    const searchWord = word ? word.trim().toLowerCase() : ""; 
    const loadButton = document.getElementById('loadbutton')
    loadButton.style.display = searchWord ? "none" : "block"
    let foundPokemon = false;
    while (!foundPokemon) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const list = await response.json();
        if (list.results.length === 0) break;
        for (let i = 0; i < list.results.length; i++) {
            const item = list.results[i];
            const data = await CacheData(item.url); 
            const pokemonName = data.name.trim().toLowerCase();
            if (searchWord && !pokemonName.startsWith(searchWord)) continue;
            foundPokemon = true;
            const bgColor = getColor(data.types[0].type.name);
            const card = document.createElement('div');
            card.classList.add('col-xs-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'col-xl-2', 'mt-5', 'card-mobil', 'fade-in')
            card.innerHTML += `
                    <div class="card">
                        <div class="card-body card-body-header bg-secondary text-white">
                            <h5 class="card-title text-capitalize">#${data.id}</h5>
                            <h5 class="card-title text-capitalize">${data.name}</h5>
                        </div>
                        <div style="background-color:${bgColor};"
                             onclick="openDialog(${data.id},'${bgColor}')"
                             class="card-body card-body-pokemon">
                            ${data.types.map(t => `
                                <button class="btn btn-sm text-white mx-1" style="background-color:${bgColor};">
                                    ${t.type.name}
                                </button>`).join("")}
                            <img loading="lazy" 
                                 src="${data.sprites.other?.home?.front_default || data.sprites.front_default}"
                                 class="card-img-top"
                                 alt="${data.name}">
                        </div>
                    </div> `;
            pokemonCard.appendChild(card);
        }
        offset += limit;
        if (!searchWord)  break;
    }
    if (!foundPokemon) {
        pokemonCard.innerHTML = `
            <div class="card-gif">
                <img class="image-gif" src="./img/no-pikachu.gif" alt="">
                <p class="text-light card-gif-text">
                    The Pokémon you are looking for could not be found. "${searchWord}"
                </p>
            </div>`;
        document.getElementById('loadbutton').style.display = "none";
    }
    diableSpinnerLoad();
}

function handleSearch(){
    const input = document.getElementById('input').value.trim().toLowerCase();
    console.log(input);
    console.log(input.length);
    const alertContainer = document.getElementById('alert-container');
    if(!input || input.length < 3){
        alertContainer.innerHTML = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Heey user!</strong> You must write at least 3 characters.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`
        return;
    } 
    PokemonData(input, "reset");
}

function spinnerLoad(){
    loadingSpinner.classList.remove('loading-spinner');
    loadingSpinner.classList.add('loading-spinner_active')
}

function diableSpinnerLoad(){
     loadingSpinner.classList.remove('loading-spinner_active');
     loadingSpinner.classList.add('loading-spinner');
}

async function loadCard() {
     const loadButton = document.getElementById('loadbutton');
    if (isLoading) return;
    isLoading = true;
    await PokemonData("", "append"); 
    isLoading = false;
}

let modalShow = null;
    async function openDialog(id, bgColor) {
    const modalElement = document.getElementById('staticBackdrop');
    const modalHeader = document.getElementById('modalHeader');
    const modalBodyInfo = document.getElementById('modal-body-info');
    const modalBodyID = document.getElementById('modalBodyID');
    const modalFooter = document.getElementById('modal-footer');
    if (!modalShow) modalShow = new bootstrap.Modal(modalElement, { backdrop: true, keyboard: true });
    modalShow.show();
    const data = await CacheData(`https://pokeapi.co/api/v2/pokemon/${id}`);
    modalHeader.style.backgroundColor = bgColor;
    modalHeader.innerHTML = `
        <div class="card-body modal-card-header">
            <h5 class="card-title text-capitalize">#${data.id}</h5>
            <h5 class="card-title text-capitalize">${data.name}</h5>
        </div>
        <div class="card-body modal-card-main mt-3">
            <div class="card-body modal-card-button mt-2">
                ${data.types.map(item => {
                    const color = getColor(data.types[0].type.name);
                    return `<button class="btn btn-sm text-white mx-1 mb-2" style="background-color:${color}">${item.type.name}</button>`;
                }).join('')}
            </div>
            <img src="${data.sprites.other?.showdown?.front_shiny}" class="card-img-top modal-image" alt="${data.name}">
        </div>`;
    modalBodyInfo.innerHTML = `
        <a id='AboutID' style="color:${bgColor}" onclick="modalAbout(${data.id})">About</a>
        <a id='baseID' style="color:${bgColor}" onclick="modalBaseStats(${data.id})">Base Stats</a>
        <a id='ShinyID' style="color:${bgColor}" onclick="modalShiniy(${data.id})">Shiny</a>`;
    modalFooter.innerHTML = `
        <button onclick="backPokemonCard(${data.id})" style="color:${bgColor}" type="button" class="btn"><i class="bi bi-arrow-left-circle icon"></i></button>
        <button onclick="nextPokemonCard(${data.id})" style="color:${bgColor}" type="button" class="btn"><i class="bi bi-arrow-right-circle icon"></i></button>`;
    modalAbout(id);
}

async function modalAbout(id){

    const data = await CacheData(`https://pokeapi.co/api/v2/pokemon/${id}`);
      modalBodyID.innerHTML = `
        <div class="card-title mb-1">
            <div class="card-title-key">Species</div>
            <div class="card-title-value">: ${data.species.name[0].toUpperCase() + data.species.name.slice(1)}</div>
        </div>
         <div class="card-title mb-1">
            <div class="card-title-key">Weight</div>
            <div class="card-title-value">: ${data.weight / 10} kg</div>
        </div>
        <div class="card-title mb-1">
            <div class="card-title-key">Height</div>
            <div class="card-title-value">: ${data.height / 10} m</div>
        </div>
        <div class="card-title mb-1">
            <div class="card-title-key">Abilities</div>
            <div class="card-title-value">: ${data.abilities.map(item=>item.ability.name[0].toUpperCase() + item.ability.name.slice(1))}</div>
        </div> `;
}

async function modalBaseStats(id){
    const data = await CacheData(`https://pokeapi.co/api/v2/pokemon/${id}`);
    modalBodyID.innerHTML = `
         ${data.stats.map(item => `
    <div class="card-title mb-1">
            <div class="card-title-key">${item.stat.name[0].toUpperCase() + item.stat.name.slice(1)}</div>
            <div class="card-title-value">: ${item.base_stat}</div>
            <div class="progress" role="progressbar" aria-label="Success example"  aria-valuenow="" aria-valuemin="" aria-valuemax="100">
            <div class="progress-bar bg-${item.base_stat > 60 ? 'success' : 'danger'}" style="width:${item.base_stat}%"></div>
            </div>
    </div>`).join('')}
        `;
   
}
async function modalShiniy(id){
    console.log(`${id} tiklandi`);
    const data = await CacheData(`https://pokeapi.co/api/v2/pokemon/${id}`);
    modalBodyID.innerHTML = `
        <div class="card-title card-image mb-1 d-flex justify-content-center">
        <img src="${data.sprites.front_shiny}" alt="${data.name}"/>
        <img src="${data.sprites.back_shiny}" alt="${data.name}"/>
        </div>`;
   
}

 async function nextPokemonCard(id) {
    let nextId = id + 1;
    const data = await CacheData(`https://pokeapi.co/api/v2/pokemon/${nextId}`);
    openDialog(nextId, getColor(data.types[0].type.name)); 
}

async function backPokemonCard (id) {
    let backId = id - 1; 
    if (backId < 1){
        backId = 1;
    }
    const data = await CacheData(`https://pokeapi.co/api/v2/pokemon/${backId}`); 
    openDialog(backId, getColor(data.types[0].type.name));
 }
