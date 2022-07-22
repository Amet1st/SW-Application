const ITEMS_ON_PAGE = 10;
const BASE_URL = "https://swapi.dev/api/people/";

let pagination = document.getElementById('pagination');
let itemsList = document.getElementById('items');
let active;

document.addEventListener('DOMContentLoaded', getData);

pagination.addEventListener('click', showItems);

async function getData(url) {
    let response = await fetch(BASE_URL);

    let result = await response.json();

    let pageItems = Math.ceil(result.count / ITEMS_ON_PAGE);

    createPaginationItems(pageItems);

    showInitialItems();
}

function createPaginationItems(num) {

    for (let i = 1; i <= num; i++) {
        let itemHTML = `
            <li class="items__list-item"><a class="items__link" href="#?page=${i}">${i}</a></li>
        `
        let li = createElementFromHTML(itemHTML);

        pagination.append(li);

    }
}

function createElementFromHTML(htmlString) {

    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();
 
    return div.firstChild;
}

async function showItems(event) {
    if (event.target.classList.contains('items__link')) {

        if (active) {
            active.classList.remove('active');
        }

        active = event.target.closest('li');
        active.classList.add('active');

        url = BASE_URL + `?page=${event.target.textContent}`;

        let response = await fetch(url);

        let json = await response.json();

        itemsList.innerHTML = "";

        let items = json.results;

        for (let i = 0; i < items.length; i++) {
            let itemHTML = createItemHTML(items[i]);

            let item = createElementFromHTML(itemHTML);

            itemsList.append(item);
        }
    }
}

function createItemHTML(item) {
    let html = `<li>
                    <p>Name: ${item.name}</p>
                    <p>Height: ${item.height}</p>
                    <p>Mass: ${item.mass}</p>
                    <p>Hair Color: ${item.hair_color}</p>
                    <p>Skin Color: ${item.skin_color}</p>
                    <p>Eye Color: ${item.eye_color}</p>
                    <p>Birth Year: ${item.birth_year}</p>
                    <p>Gender: ${item.gender}</p>
                </li>`
    return html;
}


async function showInitialItems(event) {
    let location = document.location.href;

    let url;

    if (location.indexOf('page') != -1) {
        pageId = location.substr(location.indexOf('page') + 5, 1);

        url = BASE_URL + `?page=${pageId}`;

        for (let li of pagination.children) {
            if (li.textContent == pageId) {
                active = li;
                active.classList.add('active');
            }
        }
    } else {
        url = BASE_URL + "?page=1";

        pagination.firstElementChild.classList.add('active');

    }

    let response = await fetch(url);

    let json = await response.json();

    let items = json.results;
    
    for (let item of items) {
        let itemHTML = createItemHTML(item);

        let itemElement = createElementFromHTML(itemHTML);

        itemsList.append(itemElement);
    }
}