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
]

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
        case "psychic": return "#F85888";
        case "normal": return "#A8A878";
        case "ice": return "#98D8D8";
        case "dragon": return "#7038F8";
        case "fighting": return "#C03028";
        case "rock": return "#B8A038";
        case "dark": return "#705848";
        case "ghost": return "#705898";
        default: return "gray";
    }
}


function PokemonData() {
    const pokemonCardData = urls.map(url => fetch(url).then(response => response.json()).then(data => {
        console.log(data);
        let pokemonCard = document.getElementById("pokemoncard");
        const bgColor = getColor(data.types[0].type.name);
        console.log(bgColor);
        pokemonCard.innerHTML += `
        <div  class="col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-5 mt-5">
            <div class="card">
                <div class="card-body card-body-header bg-secondary text-white">
                    <h5 class="card-title text-capitalize">#${data.id}</h5>
                    <h5 class="card-title text-capitalize">${data.name}</h5>
                </div>
                <div style="background-color: ${bgColor};" onclick="openDialog(${data.id},'${bgColor}')" id="card-body-pokemon" class="card-body card-body-pokemon">
                        ${data.types.map(item => {
                            return `<button class="btn btn-sm text-white mx-1" style="background-color: ${bgColor};">${item.type.name}</button>
                            `;
                                })
                        .join("")}
                        <img  src="${data.sprites.other.home.front_default}" class="card-img-top" alt="${data.name}">
                </div>
            </div>
        </div>`;
    }));
}
PokemonData();

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
       // console.log(data);
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
                    `;})}
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
 //  modalAbout(id)    
}

function modalAbout(id){
      let response = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
     console.log(`${id} tiklandi`);
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
        `;})
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
            <div class="progress-bar bg-${item.base_stat >= 60 ? 'success' : 'danger'}" style="width:${item.base_stat}%"></div>
            </div>
        </div>
    `)} `;
    })
}

function modalShiniy(id){
     let response = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
     console.log(`${id} tiklandi`);
    response.then(res => res.json()).then(data => {
     modalBodyID.innerHTML = `
        <div class="card-title card-image mb-1">
        <img src="${data.sprites.front_shiny}" alt="${data.name}"/>
        </div>`;
    })
}

function nextPokemonCard(id){
    console.log(`${id} tiklandi`);
    if(id < 20){
        const nextIdNummer = id + 1;
        let response = fetch(`https://pokeapi.co/api/v2/pokemon/${nextIdNummer}`);
        response.then(response=> response.json()).then(data=>{
            const nextColor = getColor(data.types[0].type.name);
            openDialog(nextIdNummer,nextColor);
        })
    }
}

function backPokemonCard(id){
    console.log(`${id} tiklandi`);
    if(id > 1){
        const backIdNummer = id - 1;
        let response = fetch(`https://pokeapi.co/api/v2/pokemon/${backIdNummer}`);
        response.then(response=> response.json()).then(data=>{
            const backColor = getColor(data.types[0].type.name);
            openDialog(backIdNummer,backColor);
        })
    }
}
