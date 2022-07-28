const ITEMS_ON_PAGE = 10;
const BASE_URL = "https://swapi.dev/api/people/";
let example = "https://swapi.dev/api/people/?search=r&page=2";


const pagination = document.getElementById('pagination');
const itemsList = document.getElementById('items');
const searchForm = document.getElementById('search');

let expandButtons;
let hideButtons;
let active;
let search;

document.addEventListener('DOMContentLoaded', showInitialItems);

pagination.addEventListener('click', showItems);

searchForm.addEventListener('submit', getSearchedData);

async function getData(url) {
    let response = await fetch(url);

    return await response.json();

}

function createPaginationItems(num, search) {

    pagination.innerHTML = "";

    for (let i = 1; i <= num; i++) {

        let itemHTML;

        if (search) {
            itemHTML = `
            <li class="items__list-item"><a class="items__link" href="#?search=${search}&page=${i}">${i}</a></li>
            `;
        } else {
            itemHTML = `
            <li class="items__list-item"><a class="items__link" href="#?page=${i}">${i}</a></li>
            `;
        }
        

        pagination.insertAdjacentHTML('beforeend', itemHTML);
    }
}

async function showItems(event, search) {
    if (event.target.classList.contains('items__link')) {

        if (active) {
            active.classList.remove('active');
        }

        active = event.target.closest('li');
        active.classList.add('active');

        let url;

        if (search) {
            url = BASE_URL + `?search=${search}&page=${event.target.textContent}`;
        } else {
            url = BASE_URL + `?page=${event.target.textContent}`;
        }

        const data = await getData(url);

        itemsList.innerHTML = "";

        let items = data.results;

        items.forEach(item => {
            let itemHTML = createItemHTML(item);

            itemsList.insertAdjacentHTML('beforeend', itemHTML); 
        });

        expandButtons = document.querySelectorAll('.expand-toggle');
        hideButtons = document.querySelectorAll('.hide-toggle');
    }

    addButtonEvents();
}

function createItemHTML(item) {

    const { name, birth_year, gender, height, mass, hair_color, skin_color, eye_color } = item;

    let html = `<li>
                    <p>Name: ${name}</p>
                    <button class="expand-toggle toggle">Expand</button>
                    <p class="second-data hide">Birth Year: ${birth_year}</p>
                    <p class="second-data hide">Gender: ${gender}</p>
                    <p class="second-data hide">Height: ${height}</p>
                    <p class="second-data hide">Mass: ${mass}</p>
                    <p class="second-data hide">Hair Color: ${hair_color}</p>
                    <p class="second-data hide">Skin Color: ${skin_color}</p>
                    <p class="second-data hide">Eye Color: ${eye_color}</p>
                    <button class="hide hide-toggle toggle">Hide</button>
                </li>
                `
                
    return html;
}


async function showInitialItems(search) {

    itemsList.innerHTML = "";

    let location = document.location.href;

    let url;
    let pageID = "";

    if (search) {

    }

    if (location.indexOf('page') != -1) {
        pageID = location.substr(location.indexOf('page') + 5, 1);

        url = BASE_URL + `?page=${pageID}`;
        
    } else {
        url = BASE_URL + "?page=1";
    }

    const data = await getData(url);

    let pageItems = Math.ceil(data.count / ITEMS_ON_PAGE);

    createPaginationItems(pageItems);
    
    let items = data.results;

    if (pageID) {
        for (let li of pagination.children) {
            if (li.textContent == pageID) {
                active = li;
                active.classList.add('active');
            }
        }
    } else {
        active = pagination.firstElementChild;
        active.classList.add('active');
    }

    items.forEach(item => {
        let itemHTML = createItemHTML(item);

        itemsList.insertAdjacentHTML('beforeend', itemHTML);
    });

    expandButtons = document.querySelectorAll('.expand-toggle');
    hideButtons = document.querySelectorAll('.hide-toggle');
    
    addButtonEvents();
}

function addButtonEvents() {
    expandButtons.forEach(item => {
        item.addEventListener('click', event => {
            const li = event.target.closest('li');
            li.querySelectorAll('*').forEach(item => {
                item.classList.remove('hide');
            });

            event.target.classList.add('hide');
        });
    });

    hideButtons.forEach(item => {
        item.addEventListener('click', event => {
            const li = event.target.closest('li');
            li.querySelectorAll('.second-data').forEach(item => {
                item.classList.add('hide');
            });

            event.target.classList.add('hide');

            li.querySelector('.expand-toggle').classList.remove('hide');
        });
    });
}

async function getSearchedData(event) {

    event.preventDefault();

    const input = document.querySelector('input');

    if (input.value) {

        itemsList.innerHTML = "";

        search = input.value;

        const url = BASE_URL + `?search=${search}`;
        const data = await getData(url);

         if (!data.results.length) {
             itemsList.insertAdjacentHTML('beforeend', `<h2 style="color: white; font-size: 40px;">No results</h2>`);
        }

        let pageItems = Math.ceil(data.count / ITEMS_ON_PAGE);
        createPaginationItems(pageItems, input.value);
        
        active = pagination.firstElementChild;
        active.classList.add('active');

        const items = data.results;

        items.forEach(item => {
            let itemHTML = createItemHTML(item);

            itemsList.insertAdjacentHTML('beforeend', itemHTML);
        });

        pagination.removeEventListener('click', showItems);
        pagination.addEventListener('click', event => {

            if (event.target.classList.contains('items__link')) {
                showSerchedItems(event);
            }
        });

        expandButtons = document.querySelectorAll('.expand-toggle');
        hideButtons = document.querySelectorAll('.hide-toggle');

        addButtonEvents();

        searchForm.reset();
    }
}


async function showSerchedItems(event) {

    if (active) {
        active.classList.remove('active');
    }

    active = event.target.closest('li');
    active.classList.add('active');

    let url = BASE_URL + `?search=${search}&page=${event.target.textContent}`;

    const data = await getData(url);

    itemsList.innerHTML = "";

    let items = data.results;

    items.forEach(item => {
        let itemHTML = createItemHTML(item);

        itemsList.insertAdjacentHTML('beforeend', itemHTML); 
    });

    expandButtons = document.querySelectorAll('.expand-toggle');
    hideButtons = document.querySelectorAll('.hide-toggle');

    addButtonEvents();
}
