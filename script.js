const urls = [
    "https://pokeapi.co/api/v2/pokemon/1",
    "https://pokeapi.co/api/v2/pokemon/2",
    "https://pokeapi.co/api/v2/pokemon/3",
    "https://pokeapi.co/api/v2/pokemon/4",
    "https://pokeapi.co/api/v2/pokemon/5",
    "https://pokeapi.co/api/v2/pokemon/6",
    "https://pokeapi.co/api/v2/pokemon/7",
    "https://pokeapi.co/api/v2/pokemon/8",
    "https://pokeapi.co/api/v2/pokemon/9",
    "https://pokeapi.co/api/v2/pokemon/10",
    "https://pokeapi.co/api/v2/pokemon/11",
    "https://pokeapi.co/api/v2/pokemon/12",
    "https://pokeapi.co/api/v2/pokemon/13",
    "https://pokeapi.co/api/v2/pokemon/14",
    "https://pokeapi.co/api/v2/pokemon/15",
    "https://pokeapi.co/api/v2/pokemon/16",
    "https://pokeapi.co/api/v2/pokemon/17",
    "https://pokeapi.co/api/v2/pokemon/18",
    "https://pokeapi.co/api/v2/pokemon/19",
    "https://pokeapi.co/api/v2/pokemon/20",
    "https://pokeapi.co/api/v2/pokemon/21",
    "https://pokeapi.co/api/v2/pokemon/22",
    "https://pokeapi.co/api/v2/pokemon/23",
    "https://pokeapi.co/api/v2/pokemon/24",
    "https://pokeapi.co/api/v2/pokemon/25",
    "https://pokeapi.co/api/v2/pokemon/26",
    "https://pokeapi.co/api/v2/pokemon/27",
    "https://pokeapi.co/api/v2/pokemon/28",
    "https://pokeapi.co/api/v2/pokemon/29",
    "https://pokeapi.co/api/v2/pokemon/30",
    "https://pokeapi.co/api/v2/pokemon/31",
    "https://pokeapi.co/api/v2/pokemon/32",
    "https://pokeapi.co/api/v2/pokemon/33",
    "https://pokeapi.co/api/v2/pokemon/34",
    "https://pokeapi.co/api/v2/pokemon/35",
    "https://pokeapi.co/api/v2/pokemon/36",
    "https://pokeapi.co/api/v2/pokemon/37",
    "https://pokeapi.co/api/v2/pokemon/38",
    "https://pokeapi.co/api/v2/pokemon/39",
    "https://pokeapi.co/api/v2/pokemon/40",  
]

const loadingSpinner = document.getElementById('loading');
let isLoading = false;
window.addEventListener('load', () => {
   PokemonData();
});



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
        default: return "gray";
    }
}

let visibleCount = 20;
async function PokemonData(word) {
    const pokemonCard = document.getElementById("pokemoncard");
    spinnerLoad();
    // console.log(word);
    pokemonCard.innerHTML = ""; 

    const searchWord = word ? word.trim().toLowerCase() : "";

    for (let index = 0; index < visibleCount; index++) {
        const url = urls[index];
        const response = await fetch(url);
        const data = await response.json();
        const bgColor = getColor(data.types[0].type.name);
        pokemonCard.style.animationDelay = `${index * 0.015}s`; 
        const pokemonName = data.name.trim().toLowerCase();

        if (searchWord && !pokemonName.includes(searchWord)) {
            continue;
        } 
        pokemonCard.innerHTML += `
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2  mt-5 card-mobil fade-in">
                <div class="card">
                    <div class="card-body card-body-header bg-secondary text-white">
                        <h5 class="card-title text-capitalize">#${data.id}</h5>
                        <h5 class="card-title text-capitalize">${data.name}</h5>
                    </div>
                    <div style="background-color: ${bgColor};" 
                         onclick="openDialog(${data.id},'${bgColor}')" 
                         class="card-body card-body-pokemon">
                        ${data.types.map(item => `
                            <button class="btn btn-sm text-white mx-1" style="background-color: ${bgColor};">
                                ${item.type.name}
                            </button>`).join("")}
                        <img src="${data.sprites.other.home.front_default}" class="card-img-top" alt="${data.name}">
                    </div>
                </div>
            </div>
        `;

       
    }
    await new Promise(resolve => setTimeout(resolve, 500))
    diableSpinnerLoad()
    
}

function handleSearch(){
    const input = document.getElementById('input').value.trim().toLowerCase();
    const alertContainer = document.getElementById('alert-container');
    if(!input){
        alertContainer.innerHTML = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Heey user!</strong>Please enter a valid name
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
        `
        return
    }
    console.log(input);
    PokemonData(input)
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
    if (isLoading) return; 
    isLoading = true;
    if (visibleCount === 20) {
        visibleCount = 30;
    } else if (visibleCount === 30) {
        visibleCount = 40;
    }
    await PokemonData();
    if (visibleCount >= urls.length){
        document.getElementById('loadbutton').style.display = "none";
    }
    isLoading = false;
}

let modalShow = null;
function openDialog(id,bgColor) {
      const modalElement = document.getElementById('staticBackdrop');
      const modalBodyID = document.getElementById('modalBodyID');
      const modalHeder = document.getElementById('modalHeader');
      const modalBodyInfo = document.getElementById('modal-body-info');
      const modalFooter =  document.getElementById('modal-footer');
      modalHeder.style.backgroundColor = bgColor;
    if (!modalShow) {
      modalShow = new bootstrap.Modal(modalElement, { backdrop: true, keyboard: true });
    }
    modalShow.show();
    let response = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    response.then(res => res.json()).then(data => {
        console.log(data);
        modalHeder.innerHTML = `
        <div class="card-body modal-card-header">
            <h5 class="card-title text-capitalize">#${data.id}</h5>
            <h5 class="card-title text-capitalize">${data.name}</h5>
        </div>
        <div class="card-body modal-card-main mt-3">
            <div class="card-body modal-card-button mt-2">
                    ${data.types.map(item => {
                    const bgColor = getColor(data.types[0].type.name);
                    return `<button class="btn btn-sm text-white mx-1 mb-2" style="background-color: ${bgColor};">${item.type.name}</button>
                    `;
                     }).join("")}
            </div>
            <img src="${data.sprites.other?.showdown?.front_shiny 
                 || data.sprites.other?.home?.front_default 
                 || data.sprites.front_default}" class="card-img-top modal-image" alt="${data.name}">
        </div>
        
        `;
        modalBodyInfo.innerHTML = `
                <a style="color: ${bgColor};" onclick="modalAbout(${data.id})">About</a><a style="color: ${bgColor};" onclick="modalBaseStats(${data.id})">Base Stats</a><a style="color: ${bgColor}" onclick="modalShiniy(${data.id})">Shiny</a>
        `;
        modalFooter.innerHTML = `
            <button onclick="backPokemonCard(${data.id})" style="color: ${bgColor};" type="button" class="btn"><i class="bi bi-arrow-left-circle icon"></i></button>
            <button onclick="nextPokemonCard(${data.id})" style="color: ${bgColor};" type="button" class="btn"><i class="bi bi-arrow-right-circle icon"></i></button>
        `;
    });
   modalAbout(id)    
}

function modalAbout(id){
    let response = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    response.then(res => res.json()).then(data => {
      modalBodyID.innerHTML = `
        <div class="card-title mb-1">
            <div class="card-title-key">Species</div>
            <div class="card-title-value">: ${data.species.name[0].toUpperCase() + data.species.name.slice(1)}</div>
        </div>
         <div class="card-title mb-1">
            <div class="card-title-key">Weight</div>
            <div class="card-title-value">: ${data.weight} kg</div>
        </div>
        <div class="card-title mb-1">
            <div class="card-title-key">Height</div>
            <div class="card-title-value">: ${data.height} m</div>
        </div>
        <div class="card-title mb-1">
            <div class="card-title-key">Abilities</div>
            <div class="card-title-value">: ${data.abilities.map(item=>item.ability.name[0].toUpperCase() + item.ability.name.slice(1))}</div>
        </div>      
        `;
})
}

function modalBaseStats(id){
    let response = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    console.log(`${id} tiklandi`);
    response.then(res => res.json()).then(data => {
    modalBodyID.innerHTML = `
         ${data.stats.map(item => `
    <div class="card-title mb-1">
            <div class="card-title-key">${item.stat.name[0].toUpperCase() + item.stat.name.slice(1)}</div>
            <div class="card-title-value">: ${item.base_stat}</div>
            <div class="progress" role="progressbar" aria-label="Success example"  aria-valuenow="" aria-valuemin="" aria-valuemax="100">
            <div class="progress-bar bg-${item.base_stat > 60 ? 'success' : 'danger'}" style="width:${item.base_stat}%"></div>
            </div>
    </div>
    `).join('')}
        `;
    })
}
function modalShiniy(id){
     let response = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
     console.log(`${id} tiklandi`);
    response.then(res => res.json()).then(data => {
     modalBodyID.innerHTML = `
        <div class="card-title card-image mb-1 d-flex justify-content-center">
        <img src="${data.sprites.front_shiny}" alt="${data.name}"/>
        <img src="${data.sprites.back_shiny}" alt="${data.name}"/>
        </div>`;
    })
}

function nextPokemonCard(id){
    console.log(`${id} tiklandi`);
    let nexIdNumber = id + 1
    if(nexIdNumber >= visibleCount){
        nexIdNumber = 1
    }
     fetch(`https://pokeapi.co/api/v2/pokemon/${nexIdNumber}`)
        .then(response => response.json())
        .then(data => {
            const backColor = getColor(data.types[0].type.name);
            openDialog(nexIdNumber, backColor);
        });
}

function backPokemonCard(id){
    console.log(`${id} tiklandi`);
    let backIdNummer = id - 1;
    if(backIdNummer < 1){
        backIdNummer = visibleCount;
    }
     fetch(`https://pokeapi.co/api/v2/pokemon/${backIdNummer}`)
        .then(response => response.json())
        .then(data => {
            const backColor = getColor(data.types[0].type.name);
            openDialog(backIdNummer, backColor);
        });
}
