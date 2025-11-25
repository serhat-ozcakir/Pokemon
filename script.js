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
]


function PokemonData() {
    const pokemonCardData = urls.map(url => fetch(url).then(response => response.json()).then(data => {
        console.log(data);
        let pokemonCard = document.getElementById("pokemoncard");
        pokemonCard.innerHTML += `
<div  class="col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-5 mt-5">
    <div class="card">
      <div class="card-body card-body-header bg-secondary text-white">
        <h5 class="card-title text-capitalize">#${data.id}</h5>
        <h5 class="card-title text-capitalize">${data.name}</h5>
      </div>
        <img src="${data.sprites.other.home.front_default}" class="card-img-top" alt="${data.name}">
    </div>
</div>
    `;
    }));
}
PokemonData();