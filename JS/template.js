function templatePokemonCard(data,bgColor){
    return  `
        <div class="card">
            <div class="card-body card-body-header bg-secondary text-white">
                <h5 class="card-title text-capitalize">#${data.id}</h5>
                <h5 class="card-title text-capitalize">${data.name}</h5>
            </div>
            <div style="background-color:${bgColor};"
                onclick="openDialog(${data.id},'${bgColor}')" class="card-body card-body-pokemon">
                ${data.types.map(t => `<button class="btn btn-sm text-white mx-1" style="background-color:${bgColor};">
                 ${t.type.name}</button>`).join("")}<img loading="lazy" 
                src="${data.sprites.other?.home?.front_default || data.sprites.front_default}"
                class="card-img-top" alt="${data.name}">
            </div>
        </div> 
            `;
}

function tempalteNoFound(searchWord){
    return `
        <div class="card-gif">
            <img class="image-gif" src="./img/no-pikachu.gif" alt="">
            <p class="text-light card-gif-text">
                The Pokémon "${searchWord}" you are looking for could not be found. 
            </p>
        </div>`;
}

function templateModalHeader(data){
    return  `
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
        </div>`
}

function templateModalInfo(bgColor,data){
    return `
        <a id='AboutID' style="color:${bgColor}; cursor:pointer;" onclick="colorActive('About', ${data.id}, '${bgColor}')">About</a>
        <a id='baseID' style="color:${bgColor}; cursor:pointer;" onclick="colorActive('Base', ${data.id}, '${bgColor}')">Base Stats</a>
        <a id='ShinyID' style="color:${bgColor}; cursor:pointer;" onclick="colorActive('Shiny', ${data.id}, '${bgColor}')">Shiny</a>
        `;
}

function colorActive(item, id, bgColor){
    document.getElementById('AboutID').style.borderBottom = 'none';
    document.getElementById('baseID').style.borderBottom = 'none';
    document.getElementById('ShinyID').style.borderBottom = 'none';

    if(item === 'About') document.getElementById('AboutID').style.borderBottom = `2px solid ${bgColor}`;
    if(item === 'Base')  document.getElementById('baseID').style.borderBottom = `2px solid ${bgColor}`;
    if(item === 'Shiny') document.getElementById('ShinyID').style.borderBottom = `2px solid ${bgColor}`;

    if(item === 'About') modalBodyID.innerHTML = templateModalAbout(bgColor, cache[`https://pokeapi.co/api/v2/pokemon/${id}`]);
    if(item === 'Base')  modalBodyID.innerHTML = templateModalBaseStats(cache[`https://pokeapi.co/api/v2/pokemon/${id}`]);
    if(item === 'Shiny') modalBodyID.innerHTML = templateModalShiny(cache[`https://pokeapi.co/api/v2/pokemon/${id}`]);
}

function tempalteModalFooter(bgColor,data){
    return      `
        <button onclick="backPokemonCard(${data.id})" style="color:${bgColor}" type="button" class="btn"><i class="bi bi-arrow-left-circle icon"></i></button>
        <button onclick="nextPokemonCard(${data.id})" style="color:${bgColor}" type="button" class="btn"><i class="bi bi-arrow-right-circle icon"></i></button>
        `;
}

function templateModalAbout(bgColor,data){
    document.getElementById('AboutID').style.borderBottom = 'none';
    document.getElementById('baseID').style.borderBottom = 'none';
    document.getElementById('ShinyID').style.borderBottom = 'none';
    document.getElementById('AboutID').style.borderBottom = `2px solid ${bgColor}`;
    return `
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

function templateModalBaseStats(data){
    return     `
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

function templateModalShiny(data){
    return  `
        <div class="card-title card-image mb-1 d-flex justify-content-center">
            <img src="${data.sprites.front_shiny}" alt="${data.name}"/>
            <img src="${data.sprites.back_shiny}" alt="${data.name}"/>
        </div>
    `;
} 