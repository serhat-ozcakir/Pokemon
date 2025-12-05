let offset = 0;
let limit = 30;
const pokemonCard = document.getElementById("pokemoncard");
const loadingSpinner = document.getElementById('loading');
const loadButton = document.getElementById('loadbutton');
const modalElement = document.getElementById('staticBackdrop');
const modalHeader = document.getElementById('modalHeader');
const modalBodyInfo = document.getElementById('modal-body-info');
const modalBodyID = document.getElementById('modalBodyID');
const modalFooter = document.getElementById('modal-footer');
let isLoading = false;
let filteredList = [];
let allPokemonList = [];
let modalCurrentList = [];
let modalCurrentIndex = [];

async function init(){
    loadButton.style.display = 'none';
    spinnerLoad();
    await new Promise(resolve => setTimeout(resolve, 1200));
    await renderPokemonData();
    diableSpinnerLoad();
}

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
const searchCache = {};
async function CacheData(url) {
    if (cache[url]){
        return cache[url];
    } else{
        const response = await fetch(url);
        const data = await response.json();
        cache[url] = data;
        return data; 
    } 
}

async function PokemonListData(searchWord) {
    const listUrl = searchWord ? "https://pokeapi.co/api/v2/pokemon?limit=400&offset=0" : 
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    if (searchCache[listUrl]){
      return searchCache[listUrl];  
    } else{
        const response = await fetch(listUrl);
        const data = await response.json();
        searchCache[listUrl] = data;
        return data;
    }
}

async function renderPokemonData(word = ""){
    const searchWord = word ? word.trim().toLowerCase() : "";
    if (word){
        pokemonCard.innerHTML = "";
        offset = 0;}
        loadButton.style.display = searchWord ? "none" : "block";
        const list = await PokemonListData(searchWord);
        const matchedPokemonList = filterPokemonName(list, searchWord).map(item=>{
            const id = Number(item.url.split("pokemon/")[1].replace("/",""))
            return {...item,id}})
        filteredList = matchedPokemonList;
        await filterPokemonList(matchedPokemonList, pokemonCard);
        updateAllPokemonOrModalList(searchWord,matchedPokemonList)
        if (!searchWord) offset += limit;
        await buttonDisplayControl(searchWord, matchedPokemonList.length > 0, pokemonCard);
        hideSpinnerLoad()
}

function updateAllPokemonOrModalList(searchWord,matchedPokemonList){
    if(!searchWord){
            if(offset === 0){
                allPokemonList = matchedPokemonList;
            } else{
                allPokemonList = allPokemonList.concat(matchedPokemonList)
            }
            modalCurrentList = allPokemonList;
    } else{
            modalCurrentList = filteredList;
        }
}

function  hideSpinnerLoad(searchWord){
    if (searchWord) {setTimeout(() => diableSpinnerLoad(), 500);}
        else {diableSpinnerLoad();}
}

function filterPokemonName(list, searchWord) {
    return list.results.filter(item => {
        return searchWord ? item.name.toLowerCase().includes(searchWord) : true;
    });
}

async function filterPokemonList(list, pokemonCard) {
    for (let i = 0; i < list.length; i++){
        const item = list[i];
        const data = await CacheData(item.url);
        const bgColor = getColor(data.types[0].type.name);
        const card = document.createElement('div');
        card.classList.add('col-xs-12','col-sm-6','col-md-4','col-lg-3','col-xl-2','mt-5','card-mobil','fade-in');
        card.innerHTML = templatePokemonCard(data, bgColor);
        pokemonCard.appendChild(card);
    }
}

function handleSearch(){
    const input = document.getElementById('input').value.trim().toLowerCase();
    if(!input || input.length < 3){
    const toastElement = document.getElementById('orderToast');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
        return;
    } 
    renderPokemonData(input);
  
}

const inputEl = document.getElementById('input');
inputEl.addEventListener('input', () => {
    if (inputEl.value.trim() === "") {
        pokemonCard.innerHTML = "";
        offset = 0;
        renderPokemonData(null); 
    }
});

async function buttonDisplayControl(searchWord,foundPokemon,pokemonCard) {
    if (!foundPokemon) {
        pokemonCard.innerHTML = tempalteNoFound(searchWord)     
        loadButton.style.display = "none";
    } else {
        return foundPokemon; 
    }
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
    loadButton.disabled = true;
    loadButton.textContent = "Loading...";
    if(allPokemonList.length > 150){
        setTimeout(() => {
            loadButton.disabled = false;
            loadButton.textContent = "Load more..";}, 2500); }else{
            setTimeout(() => {
            loadButton.disabled = false;
            loadButton.textContent = "Load more.."; }, 2000); }
    await renderPokemonData(); 
    isLoading = false;
}

let modalShow = null;
async function openDialog(id, bgColor) {
    if (!modalShow) modalShow = new bootstrap.Modal(modalElement, { backdrop: true, keyboard: true });
        modalShow.show();
    if(modalCurrentList.length === 0){
        modalCurrentList = filteredList.length ? filteredList : allPokemonList;
    }
    modalCurrentIndex = modalCurrentList.findIndex(item => item.id === id);
    if(modalCurrentIndex === -1) modalCurrentIndex = 0;
    const data = await CacheData(`https://pokeapi.co/api/v2/pokemon/${id}`);
    modalHeader.style.backgroundColor = bgColor;
    modalHeader.innerHTML = templateModalHeader(data);
    modalBodyInfo.innerHTML = templateModalInfo(bgColor,data);
    modalFooter.innerHTML = tempalteModalFooter(bgColor,data);
    colorActive('About', id, bgColor);
}

async function modalAbout(id){
    const data = await CacheData(`https://pokeapi.co/api/v2/pokemon/${id}`);
    modalBodyID.innerHTML = templateModalAbout(data);   
}

async function modalBaseStats(id){
    const data = await CacheData(`https://pokeapi.co/api/v2/pokemon/${id}`);
    modalBodyID.innerHTML = templateModalBaseStats(data);
}

async function modalShiniy(id){
    console.log(`${id} tiklandi`);
    const data = await CacheData(`https://pokeapi.co/api/v2/pokemon/${id}`);
    modalBodyID.innerHTML = templateModalShiny(data)
}

async function nextPokemonCard() {
    modalCurrentIndex = modalCurrentIndex + 1;
    if (modalCurrentIndex >= modalCurrentList.length) {
        modalCurrentIndex = 0;
    }

    const nextPokemon = modalCurrentList[modalCurrentIndex];
    const nextData = await CacheData(nextPokemon.url);
    openDialog(nextData.id, getColor(nextData.types[0].type.name));
}

async function backPokemonCard() {
    modalCurrentIndex = modalCurrentIndex - 1;
    if (modalCurrentIndex < 0) {
        modalCurrentIndex = modalCurrentList.length - 1;
    }
    const backPokemon = modalCurrentList[modalCurrentIndex];
    const backData = await CacheData(backPokemon.url);
    openDialog(backData.id, getColor(backData.types[0].type.name));
}
